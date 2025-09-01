import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth'
import { aiAgent } from '@/lib/agent'
import { trackMessageUsage } from '@/lib/rate-limit'

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
  console.log('🚀 [API /chat] New request received')
  
  try {
    // Use shared knowledge base ID for crypto knowledge aggregation
    const knowledgeId = 'crypto_knowledge_base'
    console.log('📚 [API /chat] Public chat session - shared crypto knowledge active')

    // Parse request body
    const { message, deepResearchMode = false } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' }, 
        { status: 400 }
      )
    }

    // No persistence - each conversation is stateless
    console.log('⚡ [API /chat] Stateless conversation mode')
    
    // No chat history - each request is independent
    const chatHistory: Array<{ role: string; content: string }> = []
    
    // Create temporary session ID for this request only
    const sessionId = 'session_' + Date.now().toString()
    console.log('🆔 [API /chat] Temporary session:', sessionId)

    // Create streaming response
    const encoder = new TextEncoder()
    let assistantResponse = ''
    let toolsUsed: string[] = []

    const stream = new ReadableStream({
      start(controller) {
        // Send initial session info (no chat ID - stateless)
        const sessionInfo = JSON.stringify({
          type: 'session_info',
          data: { sessionId, knowledgeMode: 'shared_crypto' }
        })
        controller.enqueue(encoder.encode(`data: ${sessionInfo}\n\n`))
        
        // Start AI processing with shared knowledge base
        processAIResponse(
          controller, 
          encoder, 
          message, 
          chatHistory, 
          knowledgeId,
          deepResearchMode
        ).then(({ response, tools }) => {
          assistantResponse = response
          toolsUsed = tools
          
          // No message persistence - but extract crypto knowledge for shared base
          console.log('🧠 [API /chat] Extracting crypto knowledge for shared knowledge base')
          
          // Send completion (no chat persistence)
          const completion = JSON.stringify({
            type: 'complete',
            data: { success: true, sessionId }
          })
          controller.enqueue(encoder.encode(`data: ${completion}\n\n`))
          controller.close()
        }).catch(error => {
          console.error('[API /chat] AI processing failed:', error)
          const errorResponse = JSON.stringify({
            type: 'error',
            data: { message: 'Failed to process message' }
          })
          controller.enqueue(encoder.encode(`data: ${errorResponse}\n\n`))
          controller.close()
        })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Credentials': 'true',
        'X-Accel-Buffering': 'no', // Disable proxy buffering
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

async function processAIResponse(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  message: string,
  chatHistory: Array<{ role: string; content: string }>,
  userId: string,
  deepResearchMode = false
): Promise<{ response: string; tools: string[] }> {
  let fullResponse = ''
  const toolsUsed: string[] = []

  try {
    console.log('🤖 [API /chat] Starting AI processing')

    // Stream the AI response
    for await (const event of aiAgent.streamMessage(
      message,
      chatHistory,
      userId,
      deepResearchMode
    )) {
      switch (event.type) {
        case 'thinking_stream':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'thinking_stream',
            data: {
              content: event.content,
              metadata: event.metadata
            }
          })}\n\n`))
          break

        case 'memory_access':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'memory_access',
            data: {
              content: event.content,
              metadata: event.metadata
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
              metadata: event.metadata
            }
          })}\n\n`))
          break

        case 'tool_result':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'tool_result',
            data: {
              content: event.content,
              metadata: event.metadata
            }
          })}\n\n`))
          break

        case 'content':
          if (event.content) {
            fullResponse += event.content
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'content',
              data: { content: event.content }
            })}\n\n`))
          }
          break

        case 'error':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            data: { 
              message: event.content,
              metadata: event.metadata
            }
          })}\n\n`))
          break

        case 'complete':
          console.log('✅ [API /chat] AI processing complete')
          break
      }
    }

    return { response: fullResponse, tools: toolsUsed }
  } catch (error) {
    console.error('[API /chat] AI processing error:', error)
    throw error
  }
}