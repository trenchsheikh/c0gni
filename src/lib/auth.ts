import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'auth_token'

export interface AuthUser {
  userId: string
  email?: string
  username?: string
  publicKey?: string
}

export async function authenticateUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Try JWT token from Authorization header first
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring('Bearer '.length)
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        return {
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username,
          publicKey: decoded.publicKey
        }
      } catch (error) {
        console.warn('Invalid JWT token:', error)
      }
    }

    // Fallback to cookie-based authentication
    const tokenCookie = request.cookies.get(COOKIE_NAME)
    if (!tokenCookie?.value) {
      return null
    }

    const decoded = jwt.verify(tokenCookie.value, JWT_SECRET) as any
    return {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      publicKey: decoded.publicKey
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function createUser(data: {
  email?: string
  username?: string
  publicKey?: string
  password?: string
}): Promise<AuthUser> {
  let hashedPassword: string | undefined
  
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10)
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      publicKey: data.publicKey,
      // Store password hash in a separate field if needed
    },
  })

  return {
    userId: user.id,
    email: user.email || undefined,
    username: user.username || undefined,
    publicKey: user.publicKey || undefined
  }
}

export async function signJWT(user: AuthUser): Promise<string> {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      username: user.username,
      publicKey: user.publicKey
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export async function getUserWithMemories(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      memories: {
        orderBy: { lastUsed: 'desc' },
        take: 100 // Latest 100 memories
      },
      contexts: {
        orderBy: { updatedAt: 'desc' },
        take: 1 // Most recent context
      },
      subscriptions: {
        where: { status: 'active' },
        take: 1
      }
    }
  })
}

export async function createApiKey(
  userId: string, 
  name: string, 
  permissions: string[] = ['chat']
): Promise<{ key: string; keyPreview: string; keyId: string }> {
  // Generate a secure API key
  const apiKey = 'sk-' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(36))
    .join('')

  const keyHash = await bcrypt.hash(apiKey, 10)
  const keyPreview = '...' + apiKey.slice(-4)

  const dbKey = await prisma.apiKey.create({
    data: {
      userId,
      name,
      keyHash,
      keyPreview,
      permissions,
    }
  })

  return {
    key: apiKey,
    keyPreview,
    keyId: dbKey.id
  }
}

export async function validateApiKey(apiKey: string): Promise<AuthUser | null> {
  if (!apiKey.startsWith('sk-')) {
    return null
  }

  const dbKeys = await prisma.apiKey.findMany({
    where: { active: true },
    include: { user: true }
  })

  for (const dbKey of dbKeys) {
    const isValid = await bcrypt.compare(apiKey, dbKey.keyHash)
    if (isValid) {
      // Update usage
      await prisma.apiKey.update({
        where: { id: dbKey.id },
        data: { 
          lastUsed: new Date(),
          usageCount: { increment: 1 }
        }
      })

      return {
        userId: dbKey.user.id,
        email: dbKey.user.email || undefined,
        username: dbKey.user.username || undefined,
        publicKey: dbKey.user.publicKey || undefined
      }
    }
  }

  return null
}