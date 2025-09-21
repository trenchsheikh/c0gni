import { prisma } from './prisma'
import { ChatOpenAI } from '@langchain/openai'
import { generateEmbedding, storeEmbedding } from './embeddings'

// Enhanced session management types
export interface ChatSessionData {
  id: string
  userId?: string
  sessionType: 'private' | 'shared' | 'temporary'
  title?: string
  description?: string
  tags: string[]
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  contextWindow: number
  autoSummarize: boolean
  summary?: string
  lastSummaryAt?: Date
  isActive: boolean
  isPinned: boolean
  isArchived: boolean
  lastActivity: Date
  messageCount: number
  totalTokens: number
  avgResponseTime?: number
  mainTopics: string[]
  currentTopic?: string
  topicHistory?: any
  createdAt: Date
  updatedAt: Date
}

export interface MessageData {
  id: string
  sessionId: string
  userId: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  messageType: 'text' | 'voice' | 'image' | 'code' | 'system'
  isEdited: boolean
  editHistory?: any
  metadata?: any
  tokens?: number
  model?: string
  toolCalls?: any
  thinking?: string
  confidence?: number
  processingTime?: number
  firstTokenTime?: number
  parentId?: string
  threadDepth: number
  contextUsed?: any
  isBookmarked: boolean
  isFlagged: boolean
  flagReason?: string
  extractedTopics: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
  createdAt: Date
  updatedAt: Date
}

// Initialize summarization LLM
const summarizerLlm = new ChatOpenAI({
  model: process.env.SUMMARIZER_MODEL || 'openai/gpt-4o-mini',
  temperature: 0.3,
  maxTokens: 1000,
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://c0gnilabs.xyz',
      'X-Title': 'c0gni AI Chat - Summarization',
    },
  },
  streaming: false,
})

export class ChatSessionManager {
  /**
   * Create a new chat session
   */
  async createSession(
    userId?: string,
    options: Partial<ChatSessionData> = {}
  ): Promise<ChatSessionData> {
    console.log(`📝 [SESSION] Creating new chat session for user: ${userId || 'anonymous'}`)
    
    const session = await prisma.chatSession.create({
      data: {
        userId,
        sessionType: options.sessionType || (userId ? 'private' : 'shared'),
        title: options.title,
        description: options.description,
        tags: options.tags || [],
        model: options.model || process.env.DEFAULT_MODEL || 'openai/gpt-4o',
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 4000,
        systemPrompt: options.systemPrompt,
        contextWindow: options.contextWindow || 20,
        autoSummarize: options.autoSummarize ?? true,
        isPinned: options.isPinned || false,
        mainTopics: options.mainTopics || [],
        currentTopic: options.currentTopic,
        topicHistory: options.topicHistory,
      }
    })

    console.log(`✅ [SESSION] Created session: ${session.id}`)
    return session as ChatSessionData
  }

  /**
   * Get session by ID with full message history
   */
  async getSession(sessionId: string, includeMessages = false): Promise<ChatSessionData | null> {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: includeMessages ? {
          orderBy: { createdAt: 'asc' },
          include: {
            reactions: true,
            replies: true,
          }
        } : false,
        summaries: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Get last 5 summaries
        }
      }
    })

    return session as ChatSessionData | null
  }

  /**
   * Get user's active sessions
   */
  async getUserSessions(
    userId: string, 
    options: { 
      includeArchived?: boolean
      limit?: number
      offset?: number
    } = {}
  ): Promise<ChatSessionData[]> {
    const sessions = await prisma.chatSession.findMany({
      where: {
        userId,
        isActive: true,
        isArchived: options.includeArchived || false
      },
      orderBy: { lastActivity: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0,
      include: {
        summaries: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return sessions as ChatSessionData[]
  }

  /**
   * Get session context (recent messages + summary)
   */
  async getSessionContext(
    sessionId: string,
    contextWindow?: number
  ): Promise<{ 
    messages: MessageData[]
    summary?: string
    contextTokens: number
  }> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    const limit = contextWindow || session.contextWindow || 20

    // Get recent messages within context window
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        reactions: true
      }
    })

    // Reverse to get chronological order
    const orderedMessages = messages.reverse() as MessageData[]

    // Calculate approximate token count for context
    const contextTokens = orderedMessages.reduce((sum, msg) => sum + (msg.tokens || 0), 0)

    // Get latest summary if available
    const summary = session.summary

    console.log(`🧠 [SESSION] Retrieved context: ${orderedMessages.length} messages, ${contextTokens} tokens, summary: ${summary ? 'yes' : 'no'}`)

    return {
      messages: orderedMessages,
      summary,
      contextTokens
    }
  }

  /**
   * Add message to session with context and topic tracking
   */
  async addMessage(
    sessionId: string,
    userId: string,
    content: string,
    role: 'user' | 'assistant' | 'system' | 'tool',
    metadata: {
      messageType?: 'text' | 'voice' | 'image' | 'code' | 'system'
      model?: string
      tokens?: number
      toolCalls?: any
      thinking?: string
      confidence?: number
      processingTime?: number
      firstTokenTime?: number
      parentId?: string
      extractedTopics?: string[]
      sentiment?: 'positive' | 'negative' | 'neutral'
    } = {}
  ): Promise<MessageData> {
    const startTime = Date.now()

    // Extract topics from content if not provided
    const extractedTopics = metadata.extractedTopics || await this.extractTopics(content)

    // Create message
    const message = await prisma.message.create({
      data: {
        sessionId,
        userId,
        role,
        content,
        messageType: metadata.messageType || 'text',
        model: metadata.model,
        tokens: metadata.tokens,
        toolCalls: metadata.toolCalls,
        thinking: metadata.thinking,
        confidence: metadata.confidence,
        processingTime: metadata.processingTime,
        firstTokenTime: metadata.firstTokenTime,
        parentId: metadata.parentId,
        threadDepth: metadata.parentId ? await this.getThreadDepth(metadata.parentId) + 1 : 0,
        extractedTopics,
        sentiment: metadata.sentiment || await this.analyzeSentiment(content)
      },
      include: {
        reactions: true
      }
    })

    // Update session statistics and activity
    await this.updateSessionActivity(sessionId, {
      messageCount: { increment: 1 },
      totalTokens: { increment: metadata.tokens || 0 },
      lastActivity: new Date(),
      currentTopic: extractedTopics[0] || undefined,
      mainTopics: extractedTopics.length > 0 ? { push: extractedTopics } : undefined
    })

    // Check if summarization is needed
    if (role === 'assistant') {
      await this.checkAndSummarize(sessionId)
    }

    // Store message embedding for future semantic search
    if (content.trim().length > 10) {
      await this.storeMessageEmbedding(message as MessageData)
    }

    console.log(`💬 [SESSION] Added ${role} message to ${sessionId}: ${content.substring(0, 100)}...`)
    
    return message as MessageData
  }

  /**
   * Update session activity and metadata
   */
  private async updateSessionActivity(
    sessionId: string, 
    updates: any
  ): Promise<void> {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: updates
    })
  }

  /**
   * Check if conversation needs summarization and create summary if needed
   */
  async checkAndSummarize(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId)
    if (!session || !session.autoSummarize) return false

    const messageCount = session.messageCount
    const timeSinceLastSummary = session.lastSummaryAt ? 
      Date.now() - session.lastSummaryAt.getTime() : 
      Date.now() - session.createdAt.getTime()

    // Summarize if:
    // - More than 30 messages since last summary OR
    // - More than 2 hours since last summary and at least 10 messages
    const shouldSummarize = 
      messageCount > 30 || 
      (timeSinceLastSummary > 2 * 60 * 60 * 1000 && messageCount >= 10)

    if (shouldSummarize) {
      console.log(`📖 [SESSION] Auto-summarizing session ${sessionId} (${messageCount} messages)`)
      await this.createSummary(sessionId)
      return true
    }

    return false
  }

  /**
   * Create conversation summary using AI
   */
  async createSummary(sessionId: string): Promise<void> {
    try {
      const context = await this.getSessionContext(sessionId, 50) // Get more messages for summarization
      
      if (context.messages.length < 5) {
        console.log(`⏩ [SESSION] Skipping summarization - too few messages (${context.messages.length})`)
        return
      }

      // Prepare conversation for summarization
      const conversationText = context.messages
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n')

      const summaryPrompt = `Analyze and summarize the following crypto/blockchain conversation. Focus on:

1. **Key Topics Discussed**: Main crypto/blockchain topics covered
2. **Important Facts & Insights**: Technical details, prices, analysis, trading insights
3. **Action Items**: Any decisions, recommendations, or next steps mentioned
4. **Context for Continuation**: What would be important to remember for future messages

CONVERSATION:
${conversationText}

Provide a structured summary in the following JSON format:
{
  "summary": "Detailed summary of the conversation covering main points and insights",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "keyInsights": ["insight1", "insight2", "insight3"],
  "actionItems": ["action1", "action2"],
  "continuationContext": "Brief context for continuing this conversation"
}`

      const response = await summarizerLlm.invoke([
        { role: 'user', content: summaryPrompt }
      ])

      let summaryData
      try {
        // Try to parse JSON response
        const jsonMatch = String(response.content).match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          summaryData = JSON.parse(jsonMatch[0])
        } else {
          // Fallback to plain text summary
          summaryData = {
            summary: String(response.content),
            keyTopics: context.messages.flatMap(m => m.extractedTopics).filter((t, i, arr) => arr.indexOf(t) === i).slice(0, 5),
            keyInsights: [],
            actionItems: [],
            continuationContext: String(response.content).substring(0, 200) + '...'
          }
        }
      } catch (parseError) {
        console.warn('[SESSION] Failed to parse summary JSON, using fallback')
        summaryData = {
          summary: String(response.content),
          keyTopics: [],
          keyInsights: [],
          actionItems: [],
          continuationContext: String(response.content).substring(0, 200) + '...'
        }
      }

      // Store summary in database
      await prisma.conversationSummary.create({
        data: {
          sessionId,
          summary: summaryData.summary,
          keyTopics: summaryData.keyTopics || [],
          keyInsights: summaryData.keyInsights || [],
          messageRange: {
            start: context.messages[0]?.id,
            end: context.messages[context.messages.length - 1]?.id,
            count: context.messages.length
          },
          summaryType: 'auto',
          model: 'openai/gpt-4o-mini',
          confidence: 0.8,
          tokenCount: context.contextTokens,
          messageCount: context.messages.length,
          timeSpan: Math.round((
            new Date(context.messages[context.messages.length - 1]?.createdAt).getTime() - 
            new Date(context.messages[0]?.createdAt).getTime()
          ) / (1000 * 60)) // minutes
        }
      })

      // Update session with summary
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          summary: summaryData.summary,
          lastSummaryAt: new Date(),
          mainTopics: summaryData.keyTopics || [],
        }
      })

      // Store summary embedding for semantic search
      await storeEmbedding(
        sessionId,
        summaryData.summary,
        'message',
        {
          type: 'conversation_summary',
          session_id: sessionId,
          key_topics: summaryData.keyTopics,
          key_insights: summaryData.keyInsights
        }
      )

      console.log(`✅ [SESSION] Created summary for ${sessionId}: ${summaryData.keyTopics?.join(', ')}`)
    } catch (error) {
      console.error('[SESSION] Summarization failed:', error)
    }
  }

  /**
   * Extract topics from message content using simple keyword matching
   */
  private async extractTopics(content: string): Promise<string[]> {
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

  /**
   * Analyze sentiment of message content
   */
  private async analyzeSentiment(content: string): Promise<'positive' | 'negative' | 'neutral'> {
    const positiveWords = ['good', 'great', 'excellent', 'bullish', 'pump', 'profit', 'gain', 'up', 'high', 'moon']
    const negativeWords = ['bad', 'terrible', 'bearish', 'dump', 'loss', 'down', 'low', 'crash', 'risk', 'danger']
    
    const lowerContent = content.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  /**
   * Get thread depth for nested conversations
   */
  private async getThreadDepth(parentId: string): Promise<number> {
    const parent = await prisma.message.findUnique({
      where: { id: parentId },
      select: { threadDepth: true }
    })
    
    return parent?.threadDepth || 0
  }

  /**
   * Store message embedding for semantic search
   */
  private async storeMessageEmbedding(message: MessageData): Promise<void> {
    try {
      await storeEmbedding(
        message.sessionId,
        message.content,
        'message',
        {
          message_id: message.id,
          role: message.role,
          session_id: message.sessionId,
          topics: message.extractedTopics,
          sentiment: message.sentiment,
          confidence: message.confidence
        }
      )
    } catch (error) {
      console.warn(`[SESSION] Failed to store embedding for message ${message.id}:`, error)
    }
  }

  /**
   * Archive session
   */
  async archiveSession(sessionId: string): Promise<void> {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        isArchived: true,
        isActive: false,
        lastActivity: new Date()
      }
    })
    console.log(`🗄️ [SESSION] Archived session: ${sessionId}`)
  }

  /**
   * Delete session and all related data
   */
  async deleteSession(sessionId: string): Promise<void> {
    await prisma.chatSession.delete({
      where: { id: sessionId }
    })
    console.log(`🗑️ [SESSION] Deleted session: ${sessionId}`)
  }

  /**
   * Get session analytics
   */
  async getSessionAnalytics(sessionId: string): Promise<any> {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          select: {
            role: true,
            tokens: true,
            extractedTopics: true,
            sentiment: true,
            createdAt: true,
            processingTime: true
          }
        },
        reactions: {
          select: {
            reaction: true,
            isHelpful: true,
            accuracy: true,
            relevance: true
          }
        },
        summaries: {
          select: {
            keyTopics: true,
            createdAt: true
          }
        }
      }
    })

    if (!session) return null

    const messages = session.messages
    const userMessages = messages.filter(m => m.role === 'user')
    const assistantMessages = messages.filter(m => m.role === 'assistant')
    
    return {
      sessionId,
      totalMessages: messages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      totalTokens: session.totalTokens,
      avgTokensPerMessage: session.totalTokens / messages.length,
      avgResponseTime: assistantMessages.reduce((sum, m) => sum + (m.processingTime || 0), 0) / assistantMessages.length,
      topicDistribution: this.calculateTopicDistribution(messages),
      sentimentAnalysis: this.calculateSentimentDistribution(messages),
      sessionDuration: session.updatedAt.getTime() - session.createdAt.getTime(),
      messageFrequency: messages.length / ((Date.now() - session.createdAt.getTime()) / (1000 * 60 * 60)), // messages per hour
      summaryCount: session.summaries?.length || 0,
      reactionStats: this.calculateReactionStats(session.reactions || [])
    }
  }

  private calculateTopicDistribution(messages: any[]): Record<string, number> {
    const topicCounts: Record<string, number> = {}
    messages.forEach(msg => {
      msg.extractedTopics?.forEach((topic: string) => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1
      })
    })
    return topicCounts
  }

  private calculateSentimentDistribution(messages: any[]): Record<string, number> {
    const sentimentCounts: Record<string, number> = { positive: 0, negative: 0, neutral: 0 }
    messages.forEach(msg => {
      if (msg.sentiment) {
        sentimentCounts[msg.sentiment]++
      }
    })
    return sentimentCounts
  }

  private calculateReactionStats(reactions: any[]): any {
    const reactionCounts: Record<string, number> = {}
    let totalHelpful = 0
    let totalAccuracy = 0
    let totalRelevance = 0
    let ratedCount = 0

    reactions.forEach(reaction => {
      reactionCounts[reaction.reaction] = (reactionCounts[reaction.reaction] || 0) + 1
      if (reaction.isHelpful !== null) totalHelpful += reaction.isHelpful ? 1 : 0
      if (reaction.accuracy !== null) {
        totalAccuracy += reaction.accuracy
        ratedCount++
      }
      if (reaction.relevance !== null) totalRelevance += reaction.relevance
    })

    return {
      reactionCounts,
      helpfulnessRate: reactions.length > 0 ? totalHelpful / reactions.length : 0,
      avgAccuracy: ratedCount > 0 ? totalAccuracy / ratedCount : 0,
      avgRelevance: ratedCount > 0 ? totalRelevance / ratedCount : 0
    }
  }
}

// Export singleton instance
export const chatSessionManager = new ChatSessionManager()