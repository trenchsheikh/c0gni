import { prisma } from './prisma'

interface RateLimitOptions {
  windowMs?: number
  freeUserLimit?: number
  proUserLimit?: number
}

export async function trackMessageUsage(
  userId: string,
  options: RateLimitOptions = {}
): Promise<boolean> {
  const {
    windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'),
    freeUserLimit = parseInt(process.env.FREE_USER_MESSAGE_LIMIT || '100'),
    proUserLimit = parseInt(process.env.PRO_USER_MESSAGE_LIMIT || '1000')
  } = options

  try {
    // Get user's subscription status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          take: 1
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isProUser = user.subscriptions.length > 0 && 
                     user.subscriptions[0].planType === 'pro'
    
    const limit = isProUser ? proUserLimit : freeUserLimit

    // For simplicity, we'll use the subscription table to track usage
    // In production, you might want a dedicated rate limiting table
    if (user.subscriptions.length > 0) {
      const subscription = user.subscriptions[0]
      const now = new Date()
      const periodStart = subscription.periodStart
      
      // Reset usage if we're in a new period
      const timeSinceStart = now.getTime() - periodStart.getTime()
      if (timeSinceStart >= windowMs) {
        // Reset the period
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            periodStart: now,
            currentMonthUsage: 1
          }
        })
        return true
      }

      // Check if within limit
      if (subscription.currentMonthUsage >= limit) {
        return false
      }

      // Increment usage
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          currentMonthUsage: { increment: 1 }
        }
      })
      
      return true
    } else {
      // Free user - create a basic subscription record for tracking
      const now = new Date()
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId }
      })

      if (!existingSubscription) {
        await prisma.subscription.create({
          data: {
            userId,
            planType: 'free',
            status: 'active',
            periodStart: now,
            currentMonthUsage: 1,
            monthlyMessageLimit: freeUserLimit
          }
        })
        return true
      }

      // Check if within limit and period
      const timeSinceStart = now.getTime() - existingSubscription.periodStart.getTime()
      if (timeSinceStart >= windowMs) {
        // Reset the period
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            periodStart: now,
            currentMonthUsage: 1
          }
        })
        return true
      }

      if (existingSubscription.currentMonthUsage >= freeUserLimit) {
        return false
      }

      // Increment usage
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          currentMonthUsage: { increment: 1 }
        }
      })

      return true
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // On error, allow the request (fail open)
    return true
  }
}

export async function getRemainingUsage(userId: string): Promise<{
  used: number
  limit: number
  remaining: number
  resetTime: Date
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: 'active' },
        take: 1
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isProUser = user.subscriptions.length > 0 && 
                   user.subscriptions[0].planType === 'pro'
  
  const limit = isProUser 
    ? parseInt(process.env.PRO_USER_MESSAGE_LIMIT || '1000')
    : parseInt(process.env.FREE_USER_MESSAGE_LIMIT || '100')

  let subscription = user.subscriptions[0]
  
  if (!subscription) {
    subscription = await prisma.subscription.findUnique({
      where: { userId }
    }) as any
  }

  if (!subscription) {
    return {
      used: 0,
      limit,
      remaining: limit,
      resetTime: new Date(Date.now() + parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'))
    }
  }

  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000')
  const resetTime = new Date(subscription.periodStart.getTime() + windowMs)

  return {
    used: subscription.currentMonthUsage,
    limit,
    remaining: Math.max(0, limit - subscription.currentMonthUsage),
    resetTime
  }
}