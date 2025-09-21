import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Ensure shared knowledge base user exists
export async function ensureSharedKnowledgeBaseUser() {
  // Guard: only create this system user when explicitly enabled
  const enabled = (
    process.env.ENABLE_SHARED_KNOWLEDGE_BASE === '1' ||
    process.env.ENABLE_SHARED_KNOWLEDGE_BASE === 'true'
  )
  if (!enabled) {
    console.log('ℹ️ [PRISMA] Skipping shared knowledge base user (disabled)')
    return
  }

  const knowledgeId = 'crypto_knowledge_base'

  try {
    await prisma.user.upsert({
      where: { id: knowledgeId },
      update: {},
      create: {
        id: knowledgeId,
        email: 'crypto_knowledge@system.local',
        username: 'crypto_knowledge_base',
        bio: 'Shared crypto and blockchain knowledge base',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log('✅ [PRISMA] Shared knowledge base user ensured')
  } catch (error) {
    console.error('❌ [PRISMA] Error ensuring shared knowledge base user:', error)
  }
}
