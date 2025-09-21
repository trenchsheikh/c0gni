import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth'
import { aiAgent } from '@/lib/agent'
import { trackMessageUsage } from '@/lib/rate-limit'
import { chatSessionManager, type ChatSessionData, type MessageData } from '@/lib/chat-session'

// CORS configuration
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3000'

// Add OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const requestOrigin = request.headers.get('origin')

  if (requestOrigin === ALLOWED_ORIGIN) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  } else {
    console.warn(`[API /chat] CORS blocked for origin: ${requestOrigin}`)
    return new NextResponse(null, { status: 403 })
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 [API /chat] Enhanced chat request received')
  
  try {
    // Parse request body with enhanced session support
    const { 
      message, 
      sessionId, 
      userId,
      deepResearchMode = false,
      sessionOptions = {}
    } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' }, 
        { status: 400 }
      )
    }

    // Enhanced session management
    let currentSession: ChatSessionData
    let isNewSession = false

    if (sessionId) {
      // Try to get existing session
      const existingSession = await chatSessionManager.getSession(sessionId)
      if (existingSession) {
        currentSession = existingSession
        console.log(`📂 [API /chat] Using existing session: ${sessionId}`)
      } else {
        console.log(`⚠️ [API /chat] Session ${sessionId} not found, creating new session`)
        currentSession = await chatSessionManager.createSession(userId, sessionOptions)
        isNewSession = true
      }
    } else {
      // Create new session
      console.log('🆕 [API /chat] Creating new session')
      currentSession = await chatSessionManager.createSession(userId, sessionOptions)
      isNewSession = true
    }

    // Get session context (messages + summary) for AI
    const sessionContext = await chatSessionManager.getSessionContext(
      currentSession.id, 
      currentSession.contextWindow
    )

    console.log(`🧠 [API /chat] Context loaded: ${sessionContext.messages.length} messages, ${sessionContext.contextTokens} tokens`)

    // Build chat history from session context
    const chatHistory: Array<{ role: string; content: string }> = [
      // Add summary as system context if available
      ...(sessionContext.summary ? [{
        role: 'system' as const,
        content: `Previous conversation summary: ${sessionContext.summary}`
      }] : []),
      // Add recent messages
      ...sessionContext.messages.map(msg => ({
        role: msg.role as string,
        content: msg.content
      }))
    ]

    // Use shared crypto knowledge base or session-specific knowledge
    const knowledgeId = userId || 'crypto_knowledge_base'

    // Create streaming response with enhanced session data
    const encoder = new TextEncoder()
    let assistantResponse = ''
    let toolsUsed: string[] = []
    let processingStartTime = Date.now()
    let firstTokenTime: number | null = null

    const stream = new ReadableStream({
      async start(controller) {
        // Send enhanced session info
        const sessionInfo = JSON.stringify({
          type: 'session_info',
          data: { 
            sessionId: currentSession.id,
            isNewSession,
            knowledgeMode: userId ? 'personal' : 'shared_crypto',
            contextWindow: currentSession.contextWindow,
            messageCount: currentSession.messageCount,
            mainTopics: currentSession.mainTopics,
            summary: sessionContext.summary ? 'available' : 'none'
          }
        })
        controller.enqueue(encoder.encode(`data: ${sessionInfo}\n\n`))
        
        try {
          // Add user message to session first
          const userMessageData = await chatSessionManager.addMessage(
            currentSession.id,
            userId || 'anonymous',
            message,
            'user',
            {
              messageType: 'text',
              extractedTopics: await extractTopicsFromMessage(message)
            }
          )

          // Process AI response with enhanced context
          const { response, tools, confidence } = await processEnhancedAIResponse(
            controller, 
            encoder, 
            message, 
            chatHistory, 
            knowledgeId,
            deepResearchMode,
            currentSession
          )
          
          assistantResponse = response
          toolsUsed = tools
          const processingTime = Date.now() - processingStartTime

          // Add assistant message to session
          await chatSessionManager.addMessage(
            currentSession.id,
            userId || 'assistant',
            assistantResponse,
            'assistant',
            {
              messageType: 'text',
              model: currentSession.model || process.env.DEFAULT_MODEL,
              tokens: Math.ceil(assistantResponse.length / 3), // Rough estimate
              toolCalls: toolsUsed.length > 0 ? { tools: toolsUsed } : null,
              confidence,
              processingTime,
              firstTokenTime,
              extractedTopics: await extractTopicsFromMessage(assistantResponse)
            }
          )
          
          // Send enhanced completion with session analytics
          const sessionAnalytics = await chatSessionManager.getSessionAnalytics(currentSession.id)
          const completion = JSON.stringify({
            type: 'complete',
            data: { 
              success: true,
              sessionId: currentSession.id,
              messageCount: currentSession.messageCount + 2, // +2 for user and assistant messages
              processingTime,
              toolsUsed,
              confidence,
              analytics: sessionAnalytics
            }
          })
          controller.enqueue(encoder.encode(`data: ${completion}\n\n`))
          controller.close()
          
        } catch (error) {
          console.error('[API /chat] AI processing failed:', error)
          const errorResponse = JSON.stringify({
            type: 'error',
            data: { 
              message: 'Failed to process message',
              sessionId: currentSession.id,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          })
          controller.enqueue(encoder.encode(`data: ${errorResponse}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Credentials': 'true',
        'X-Accel-Buffering': 'no',
      }
    })

  } catch (error) {
    console.error('[API /chat] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Enhanced AI processing with session context and analytics
async function processEnhancedAIResponse(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  message: string,
  chatHistory: Array<{ role: string; content: string }>,
  knowledgeId: string,
  deepResearchMode = false,
  session: ChatSessionData
): Promise<{ response: string; tools: string[]; confidence?: number }> {
  let fullResponse = ''
  const toolsUsed: string[] = []
  let confidence: number | undefined
  let firstTokenSent = false

  try {
    console.log('🤖 [API /chat] Starting enhanced AI processing')

    // Send thinking indicator
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'thinking_stream',
      data: {
        content: 'Processing your message with conversation context...',
        metadata: { 
          phase: 'context_analysis',
          sessionId: session.id,
          contextWindow: session.contextWindow,
          messageCount: session.messageCount
        }
      }
    })}\n\n`))

    // Stream the AI response with enhanced context
    for await (const event of aiAgent.streamMessage(
      message,
      chatHistory,
      knowledgeId,
      deepResearchMode
    )) {
      switch (event.type) {
        case 'thinking_stream':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'thinking_stream',
            data: {
              content: event.content,
              metadata: {
                ...event.metadata,
                sessionId: session.id
              }
            }
          })}\n\n`))
          break

        case 'memory_access':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'memory_access',
            data: {
              content: event.content,
              metadata: {
                ...event.metadata,
                sessionId: session.id,
                knowledgeMode: knowledgeId === 'crypto_knowledge_base' ? 'shared' : 'personal'
              }
            }
          })}\n\n`))
          break

        case 'tool_call':
          if (event.content && !toolsUsed.includes(event.content)) {
            toolsUsed.push(event.content)
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'tool_call',
            data: {
              tool: event.content,
              metadata: {
                ...event.metadata,
                sessionId: session.id
              }
            }
          })}\n\n`))
          break

        case 'tool_result':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'tool_result',
            data: {
              content: event.content,
              metadata: {
                ...event.metadata,
                sessionId: session.id
              }
            }
          })}\n\n`))
          break

        case 'content':
          if (event.content) {
            fullResponse += event.content
            
            // Track first token time for analytics
            if (!firstTokenSent) {
              firstTokenSent = true
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'first_token',
                data: { 
                  timestamp: Date.now(),
                  sessionId: session.id
                }
              })}\n\n`))
            }
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'content',
              data: { 
                content: event.content,
                sessionId: session.id
              }
            })}\n\n`))
          }
          break

        case 'error':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            data: { 
              message: event.content,
              metadata: {
                ...event.metadata,
                sessionId: session.id
              }
            }
          })}\n\n`))
          break

        case 'complete':
          // Extract confidence from metadata if available
          confidence = event.metadata?.confidence || 0.8
          console.log('✅ [API /chat] Enhanced AI processing complete')
          break
      }
    }

    return { response: fullResponse, tools: toolsUsed, confidence }
  } catch (error) {
    console.error('[API /chat] Enhanced AI processing error:', error)
    throw error
  }
}

// Utility function to extract topics from message content
async function extractTopicsFromMessage(content: string): Promise<string[]> {
  const lowerContent = content.toLowerCase()
  const cryptoKeywords = {
    'trading': ['trading', 'trade', 'buy', 'sell', 'position', 'profit', 'loss'],
    'defi': ['defi', 'yield', 'farming', 'liquidity', 'pool', 'staking', 'lending'],
    'analysis': ['analysis', 'technical', 'chart', 'trend', 'support', 'resistance'],
    'tokens': ['bitcoin', 'btc', 'ethereum', 'eth', 'token', 'coin', 'price'],
    'blockchain': ['blockchain', 'network', 'gas', 'transaction', 'smart contract'],
    'market': ['market', 'volume', 'cap', 'pump', 'dump', 'bullish', 'bearish']
  }

  const foundTopics: string[] = []
  
  for (const [topic, keywords] of Object.entries(cryptoKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      foundTopics.push(topic)
    }
  }

  return foundTopics.slice(0, 3) // Limit to 3 topics
}

// GET /api/chat - Get user's chat sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const includeArchived = searchParams.get('includeArchived') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const sessions = await chatSessionManager.getUserSessions(userId, {
      includeArchived,
      limit,
      offset
    })

    return NextResponse.json({
      sessions,
      total: sessions.length,
      offset,
      limit
    })
  } catch (error) {
    console.error('[API /chat GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// DELETE /api/chat - Delete or archive session
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId, action = 'archive' } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    if (action === 'delete') {
      await chatSessionManager.deleteSession(sessionId)
    } else {
      await chatSessionManager.archiveSession(sessionId)
    }

    return NextResponse.json({
      success: true,
      action,
      sessionId
    })
  } catch (error) {
    console.error('[API /chat DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}