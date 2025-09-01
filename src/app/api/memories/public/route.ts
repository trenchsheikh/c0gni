import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface MemoryNode {
  id: string
  content: string
  type: string
  category: string
  key?: string
  value?: string
  confidence: number
  source: string
  metadata: any
  similarity?: number
  createdAt: Date
  updatedAt: Date
  chainId?: number
  tokenAddress?: string
  protocol?: string
}

export interface MemoryConnection {
  source: string
  target: string
  strength: number
  type: 'similarity' | 'category' | 'protocol' | 'chain'
}

export interface MindmapData {
  nodes: MemoryNode[]
  connections: MemoryConnection[]
  categories: Record<string, number>
  types: Record<string, number>
  totalMemories: number
}

// Must match the ID used when storing shared memories (see src/lib/prisma.ts and src/lib/agent.ts)
const SHARED_KNOWLEDGE_ID = 'crypto_knowledge_base' // Consistent ID for shared memories

/**
 * GET /api/memories/public - Fetch memories for public mindmap visualization
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    // If no limit provided, return all. If provided, use as-is (>=1).
    const limitParam = searchParams.get('limit')
    const parsed = limitParam ? parseInt(limitParam, 10) : NaN
    const limit = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined

    // Build filter conditions
    const whereConditions: any = {
      userId: SHARED_KNOWLEDGE_ID, // Only fetch shared knowledge
    }

    if (category) {
      whereConditions.category = category
    }

    if (type) {
      whereConditions.type = type
    }

    // Fetch memories from UserMemory table
    const memories = await prisma.userMemory.findMany({
      where: whereConditions,
      ...(limit ? { take: limit } : {}),
      orderBy: [
        { confidence: 'desc' },
        { lastUsed: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Fetch embeddings for similarity calculations
    const embeddings = await prisma.userEmbedding.findMany({
      where: {
        userId: SHARED_KNOWLEDGE_ID,
        type: type || undefined,
        category: category || undefined
      },
      ...(limit ? { take: limit } : {}),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        type: true,
        metadata: true,
        confidence: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Transform memories to nodes
    const memoryNodes: MemoryNode[] = memories.map(memory => ({
      id: memory.id,
      content: `${memory.key}: ${memory.value}`,
      type: memory.type,
      category: memory.category,
      key: memory.key,
      value: memory.value,
      confidence: memory.confidence,
      source: memory.source,
      metadata: {
        original_id: memory.id,
        source_type: 'memory',
        verified: memory.verified,
        message_id: memory.messageId
      },
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
      chainId: memory.chainId || undefined,
      tokenAddress: memory.tokenAddress || undefined,
      protocol: memory.protocol || undefined
    }))

    // Add embedding nodes
    const embeddingNodes: MemoryNode[] = embeddings.map(embedding => {
      const metadata = embedding.metadata as any
      return {
        id: embedding.id,
        content: embedding.content,
        type: embedding.type,
        category: metadata?.category || 'general',
        confidence: embedding.confidence,
        source: 'embedding',
        metadata: {
          ...(metadata || {}),
          original_id: embedding.id,
          source_type: 'embedding'
        },
        createdAt: embedding.createdAt,
        updatedAt: embedding.updatedAt
      }
    })

    // Combine all nodes
    const allNodes = [...memoryNodes, ...embeddingNodes]

    // Generate connections based on categories, protocols, and chains
    const connections: MemoryConnection[] = []
    
    // Create category-based connections
    const categoryGroups = new Map<string, MemoryNode[]>()
    allNodes.forEach(node => {
      const category = node.category
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, [])
      }
      categoryGroups.get(category)!.push(node)
    })

    // Connect nodes within same categories
    categoryGroups.forEach((nodes, category) => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < Math.min(nodes.length, i + 4); j++) { // Limit connections per node
          const strength = Math.min(0.7, nodes[i].confidence * nodes[j].confidence)
          if (strength > 0.3) {
            connections.push({
              source: nodes[i].id,
              target: nodes[j].id,
              strength,
              type: 'category'
            })
          }
        }
      }
    })

    // Create protocol-based connections
    const protocolGroups = new Map<string, MemoryNode[]>()
    allNodes.forEach(node => {
      if (node.protocol) {
        if (!protocolGroups.has(node.protocol)) {
          protocolGroups.set(node.protocol, [])
        }
        protocolGroups.get(node.protocol)!.push(node)
      }
    })

    protocolGroups.forEach((nodes, protocol) => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < Math.min(nodes.length, i + 3); j++) {
          const strength = Math.min(0.8, nodes[i].confidence * nodes[j].confidence + 0.1)
          connections.push({
            source: nodes[i].id,
            target: nodes[j].id,
            strength,
            type: 'protocol'
          })
        }
      }
    })

    // Create chain-based connections
    const chainGroups = new Map<number, MemoryNode[]>()
    allNodes.forEach(node => {
      if (node.chainId) {
        if (!chainGroups.has(node.chainId)) {
          chainGroups.set(node.chainId, [])
        }
        chainGroups.get(node.chainId)!.push(node)
      }
    })

    chainGroups.forEach((nodes, chainId) => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < Math.min(nodes.length, i + 3); j++) {
          const strength = Math.min(0.6, nodes[i].confidence * nodes[j].confidence)
          connections.push({
            source: nodes[i].id,
            target: nodes[j].id,
            strength,
            type: 'chain'
          })
        }
      }
    })

    // Calculate statistics
    const categories: Record<string, number> = {}
    const types: Record<string, number> = {}

    allNodes.forEach(node => {
      categories[node.category] = (categories[node.category] || 0) + 1
      types[node.type] = (types[node.type] || 0) + 1
    })

    const mindmapData: MindmapData = {
      nodes: allNodes,
      connections,
      categories,
      types,
      totalMemories: allNodes.length
    }

    return NextResponse.json(mindmapData)

  } catch (error) {
    console.error('Error fetching memories for mindmap:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}
