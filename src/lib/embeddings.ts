import { OpenAIEmbeddings } from '@langchain/openai'
import { prisma } from './prisma'

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
  model: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002'
})

export interface MemoryEmbedding {
  id: string
  content: string
  type: string
  metadata?: any
  similarity?: number
  createdAt: Date
}

// Simple in-memory cache for embeddings to reduce API calls
const embeddingCache = new Map<string, number[]>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour
const cacheTimestamps = new Map<string, number>()

/**
 * Generate embedding for text with caching
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const cacheKey = `${process.env.EMBEDDING_MODEL || 'text-embedding-ada-002'}:${text}`
  const now = Date.now()
  
  // Check cache
  if (embeddingCache.has(cacheKey)) {
    const timestamp = cacheTimestamps.get(cacheKey)!
    if (now - timestamp < CACHE_TTL) {
      return embeddingCache.get(cacheKey)!
    }
    // Remove expired cache entry
    embeddingCache.delete(cacheKey)
    cacheTimestamps.delete(cacheKey)
  }

  try {
    const embedding = await embeddings.embedQuery(text)
    
    // Cache the result
    embeddingCache.set(cacheKey, embedding)
    cacheTimestamps.set(cacheKey, now)
    
    // Clean up old cache entries periodically
    if (embeddingCache.size > 1000) {
      cleanupCache()
    }
    
    return embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

function cleanupCache() {
  const now = Date.now()
  const toDelete: string[] = []
  
  cacheTimestamps.forEach((timestamp, key) => {
    if (now - timestamp > CACHE_TTL) {
      toDelete.push(key)
    }
  })
  
  toDelete.forEach(key => {
    embeddingCache.delete(key)
    cacheTimestamps.delete(key)
  })
}

/**
 * Store embedding in database with pgvector support and enhanced error handling
 */
export async function storeEmbedding(
  knowledgeId: string, // Changed from userId to knowledgeId for shared knowledge base
  content: string,
  type: 'memory' | 'message' | 'blockchain_data' | 'market_analysis' | 'crypto_knowledge',
  metadata?: any
): Promise<string> {
  try {
    const embedding = await generateEmbedding(content)
    
    // Try pgvector first, fallback to regular storage if needed
    try {
      // Store in database using raw SQL for pgvector (shared knowledge base)
      const result = await prisma.$queryRaw`
        INSERT INTO user_embeddings (
          id, "userId", content, embedding, vector_embedding, type, metadata, "createdAt", "updatedAt", "lastUsed"
        )
        VALUES (
          gen_random_uuid()::text,
          ${knowledgeId},
          ${content},
          ${embedding},
          ${embedding}::vector,
          ${type},
          ${metadata ? JSON.stringify(metadata) : null}::jsonb,
          NOW(),
          NOW(),
          NOW()
        )
        RETURNING id
      ` as Array<{ id: string }>
      
      console.log(`✅ [EMBEDDINGS] Stored embedding with pgvector: ${result[0].id}`)
      return result[0].id
    } catch (pgvectorError) {
      console.warn('[EMBEDDINGS] pgvector storage failed, using fallback:', pgvectorError)
      
      // Fallback to regular Prisma create without vector field
      const result = await prisma.userEmbedding.create({
        data: {
          userId: knowledgeId, // Use knowledgeId instead of userId
          content,
          embedding,
          type,
          metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
          confidence: 1.0
        },
        select: { id: true }
      })
      
      console.log(`📦 [EMBEDDINGS] Stored embedding with fallback: ${result.id}`)
      return result.id
    }
  } catch (error) {
    console.error('❌ [EMBEDDINGS] Error storing embedding:', error)
    throw new Error(`Failed to store embedding: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Search for similar memories using vector similarity with production error handling
 */
export async function searchSimilarMemories(
  knowledgeId: string, // Changed from userId to knowledgeId for shared knowledge base
  query: string,
  threshold: number = 0.7,
  limit: number = 10
): Promise<MemoryEmbedding[]> {
  try {
    // Validate inputs
    if (!knowledgeId || !query.trim()) {
      console.warn('[EMBEDDINGS] Invalid search parameters:', { knowledgeId: !!knowledgeId, queryLength: query.length })
      return []
    }

    // Clamp values to reasonable ranges
    threshold = Math.max(0, Math.min(1, threshold))
    limit = Math.max(1, Math.min(100, limit))

    let queryEmbedding: number[]
    try {
      queryEmbedding = await generateEmbedding(query)
    } catch (embeddingError) {
      console.warn('[EMBEDDINGS] Embedding generation failed, using fallback search:', embeddingError)
      return await fallbackTextSearch(knowledgeId, query, limit)
    }
    
    // Try pgvector similarity search first
    try {
      const results = await prisma.$queryRaw`
        SELECT 
          id,
          content,
          type,
          metadata,
          1 - (vector_embedding <=> ${queryEmbedding}::vector) as similarity,
          created_at
        FROM user_embeddings
        WHERE user_id = ${knowledgeId}
        AND vector_embedding IS NOT NULL
        AND 1 - (vector_embedding <=> ${queryEmbedding}::vector) > ${threshold}
        ORDER BY vector_embedding <=> ${queryEmbedding}::vector
        LIMIT ${limit}
      ` as Array<{
        id: string
        content: string
        type: string
        metadata: any
        similarity: number
        created_at: Date
      }>
      
      console.log(`🔍 [EMBEDDINGS] Vector search found ${results.length} results for "${query.substring(0, 50)}..."`)
      
      return results.map(result => ({
        id: result.id,
        content: result.content,
        type: result.type,
        metadata: result.metadata,
        similarity: Math.max(0, Math.min(1, result.similarity)),
        createdAt: result.created_at
      }))
    } catch (vectorError) {
      console.warn('[EMBEDDINGS] Vector search failed, using text fallback:', vectorError)
      return await fallbackTextSearch(knowledgeId, query, limit)
    }
  } catch (error) {
    console.error('❌ [EMBEDDINGS] Error in similarity search:', error)
    return await fallbackTextSearch(knowledgeId, query, limit)
  }
}

/**
 * Fallback text search when vector search fails
 */
async function fallbackTextSearch(
  knowledgeId: string,
  query: string,
  limit: number
): Promise<MemoryEmbedding[]> {
  try {
    const results = await prisma.userEmbedding.findMany({
      where: {
        userId: knowledgeId, // Search from shared knowledge base
        content: {
          contains: query,
          mode: 'insensitive'
        }
      },
      take: Math.min(limit, 5),
      orderBy: {
        createdAt: 'desc'
      }
    })

    return results.map(result => ({
      id: result.id,
      content: result.content,
      type: result.type,
      metadata: result.metadata,
      similarity: 0.5, // Default similarity for text matches
      createdAt: result.createdAt
    }))
  } catch (fallbackError) {
    console.error('Fallback search also failed:', fallbackError)
    return []
  }
}

/**
 * Update user context with conversation patterns
 */
export async function updateUserContext(
  userId: string,
  patterns: {
    communicationStyle?: string
    topicsOfInterest?: string[]
    expertiseAreas?: string[]
    preferredResponseStyle?: string
    tradingExperience?: string
    preferredChains?: string[]
    riskTolerance?: string
    timezone?: string
  }
): Promise<void> {
  try {
    const existingContext = await prisma.userContext.findUnique({
      where: { userId }
    })

    const conversationPattern = JSON.stringify({
      lastUpdated: new Date().toISOString(),
      patterns
    })

    if (existingContext) {
      await prisma.userContext.update({
        where: { id: existingContext.id },
        data: {
          conversationPattern,
          communicationStyle: patterns.communicationStyle,
          topicsOfInterest: patterns.topicsOfInterest || [],
          expertiseAreas: patterns.expertiseAreas || [],
          preferredResponseStyle: patterns.preferredResponseStyle,
          tradingExperience: patterns.tradingExperience,
          preferredChains: patterns.preferredChains || [],
          riskTolerance: patterns.riskTolerance,
          timezone: patterns.timezone
        }
      })
    } else {
      await prisma.userContext.create({
        data: {
          userId,
          conversationPattern,
          communicationStyle: patterns.communicationStyle,
          topicsOfInterest: patterns.topicsOfInterest || [],
          expertiseAreas: patterns.expertiseAreas || [],
          preferredResponseStyle: patterns.preferredResponseStyle,
          tradingExperience: patterns.tradingExperience,
          preferredChains: patterns.preferredChains || [],
          riskTolerance: patterns.riskTolerance,
          timezone: patterns.timezone
        }
      })
    }
  } catch (error) {
    console.error('Error updating user context:', error)
  }
}

/**
 * Store user memory with embedding
 */
export async function storeUserMemory(
  knowledgeId: string, // Changed from userId to knowledgeId for shared knowledge base
  type: 'preference' | 'fact' | 'context' | 'skill' | 'blockchain_knowledge',
  category: string,
  key: string,
  value: string,
  confidence: number = 1.0,
  source: 'conversation' | 'explicit' | 'inferred' | 'blockchain_data' = 'conversation',
  messageId?: string,
  chainId?: number,
  tokenAddress?: string,
  protocol?: string
): Promise<void> {
  try {
    // Store the structured memory in shared knowledge base
    await prisma.userMemory.upsert({
      where: {
        userId_key: {
          userId: knowledgeId, // Use knowledgeId for shared knowledge base
          key
        }
      },
      update: {
        value,
        confidence,
        category,
        source,
        messageId,
        chainId,
        tokenAddress,
        protocol,
        lastUsed: new Date()
      },
      create: {
        userId: knowledgeId, // Use knowledgeId for shared knowledge base
        type,
        category,
        key,
        value,
        confidence,
        source,
        messageId,
        chainId,
        tokenAddress,
        protocol
      }
    })

    // Also store as embedding for semantic search in shared knowledge base
    const embeddingContent = `${type}: ${key} - ${value} (${category})`
    await storeEmbedding(knowledgeId, embeddingContent, 'crypto_knowledge', {
      type,
      category,
      key,
      value,
      confidence,
      source,
      chainId,
      tokenAddress,
      protocol
    })
  } catch (error) {
    console.error('Error storing user memory:', error)
  }
}