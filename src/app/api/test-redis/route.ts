import { NextRequest, NextResponse } from 'next/server'
import { redis, REDIS_KEYS } from '@/lib/redis'

export async function GET(req: NextRequest) {
  if (!redis) {
    return NextResponse.json({ error: 'Redis not initialized' }, { status: 500 })
  }

  try {
    // Test basic Redis operations
    const testKey = 'test:basic'
    const testValue = { test: true, timestamp: Date.now() }

    // Set test data
    await redis.setex(testKey, 30, JSON.stringify(testValue))
    console.log('✅ Test set operation successful')

    // Get test data
    const retrieved = await redis.get(testKey)
    console.log('📥 Retrieved:', typeof retrieved, retrieved)

    // Check if hyperliquid markets exist
    const marketsData = await redis.get(REDIS_KEYS.HYPERLIQUID_MARKETS)
    console.log('📊 Markets data exists:', !!marketsData, 'Type:', typeof marketsData)

    // List all keys
    const keys = await redis.keys('*')
    console.log('🔑 All Redis keys:', keys)

    return NextResponse.json({
      testWrite: 'success',
      testRead: retrieved ? (typeof retrieved === 'string' ? JSON.parse(retrieved) : retrieved) : null,
      marketsExists: !!marketsData,
      marketsType: typeof marketsData,
      allKeys: keys,
      redisKey: REDIS_KEYS.HYPERLIQUID_MARKETS
    })

  } catch (error: any) {
    console.error('❌ Redis test error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}