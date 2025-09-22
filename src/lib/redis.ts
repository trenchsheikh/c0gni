import { Redis } from '@upstash/redis'
import {
  memoryCache,
  CACHE_KEYS,
  CACHE_TTL,
  setMarketDataCache,
  getMarketDataCache,
  setOrderBookDataCache,
  getOrderBookDataCache,
  getLastUpdateCache,
  setPolymarketMarketsCache,
  getPolymarketMarketsCache
} from './in-memory-cache'

// Redis client configuration using Upstash
function createRedisClient() {
  // Try multiple environment variable names for compatibility
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    console.warn('Redis credentials not found. Using fallback mode.')
    console.warn('Looking for: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL, KV_REST_API_TOKEN')
    return null
  }

  console.log('✅ Redis client created with Upstash credentials')
  return new Redis({ url, token })
}

export const redis = createRedisClient()

// Redis keys for Hyperliquid data
export const REDIS_KEYS = {
  HYPERLIQUID_MARKETS: 'hyperliquid:markets',
  HYPERLIQUID_ORDERBOOK: (symbol: string) => `hyperliquid:orderbook:${symbol}`,
  HYPERLIQUID_LAST_UPDATE: 'hyperliquid:last_update',
  HYPERLIQUID_META: 'hyperliquid:meta',
  POLYMARKET_MARKETS: 'polymarket:markets',
  POLYMARKET_LAST_UPDATE: 'polymarket:last_update',
  POLYMARKET_MARKET: (id: string) => `polymarket:market:${id}`,
} as const

// TTL values (in seconds)
export const TTL = {
  MARKETS: 300, // 5 minutes - longer cache for better performance
  ORDERBOOK: 30, // 30 seconds
  META: 600, // 10 minutes
} as const

// Helper functions for Redis operations
export async function setMarketData(data: any) {
  // Always cache in memory for fast access
  setMarketDataCache(data)

  // Try Redis if available
  if (redis) {
    try {
      await redis.setex(REDIS_KEYS.HYPERLIQUID_MARKETS, TTL.MARKETS, JSON.stringify(data))
      await redis.set(REDIS_KEYS.HYPERLIQUID_LAST_UPDATE, Date.now())
      return true
    } catch (error) {
      console.warn('Redis setMarketData error, using memory cache only:', error.message)
    }
  }

  // Memory cache always works
  return true
}

export async function getMarketData() {
  // Try Redis first
  if (redis) {
    try {
      console.log('🔍 Attempting to get market data from Redis...')
      const data = await redis.get(REDIS_KEYS.HYPERLIQUID_MARKETS)
      console.log('📊 Redis data result:', data ? `Found ${JSON.stringify(data).length} chars` : 'null')

      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data as string) : (data as any)
        console.log(`✅ Redis returned ${Array.isArray(parsed) ? parsed.length : 'non-array'} markets`)
        // Also cache in memory for faster subsequent access
        setMarketDataCache(parsed)
        return parsed
      }
    } catch (error) {
      console.warn('Redis getMarketData error, falling back to memory cache:', error.message)
    }
  }

  console.log('💾 Falling back to memory cache')
  return getMarketDataCache()
}

export async function setOrderBookData(symbol: string, data: any) {
  // Always cache in memory for fast access
  setOrderBookDataCache(symbol, data)

  // Try Redis if available
  if (redis) {
    try {
      await redis.setex(REDIS_KEYS.HYPERLIQUID_ORDERBOOK(symbol), TTL.ORDERBOOK, JSON.stringify(data))
      return true
    } catch (error) {
      console.warn('Redis setOrderBookData error, using memory cache only:', error.message)
    }
  }

  // Memory cache always works
  return true
}

export async function getOrderBookData(symbol: string) {
  // Try Redis first
  if (redis) {
    try {
      const data = await redis.get(REDIS_KEYS.HYPERLIQUID_ORDERBOOK(symbol))
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data as string) : (data as any)
        // Also cache in memory for faster subsequent access
        setOrderBookDataCache(symbol, parsed)
        return parsed
      }
    } catch (error) {
      console.warn('Redis getOrderBookData error, falling back to memory cache:', error.message)
    }
  }

  // Fallback to memory cache
  return getOrderBookDataCache(symbol)
}

export async function setMetaData(data: any) {
  if (!redis) return false
  try {
    await redis.setex(REDIS_KEYS.HYPERLIQUID_META, TTL.META, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Redis setMetaData error:', error)
    return false
  }
}

export async function getMetaData() {
  if (!redis) return null
  try {
    const data = await redis.get(REDIS_KEYS.HYPERLIQUID_META)
    return data ? (typeof data === 'string' ? JSON.parse(data as string) : (data as any)) : null
  } catch (error) {
    console.error('Redis getMetaData error:', error)
    return null
  }
}

export async function getLastUpdate() {
  // Try Redis first
  if (redis) {
    try {
      const update = await redis.get(REDIS_KEYS.HYPERLIQUID_LAST_UPDATE)
      if (update) return update
    } catch (error) {
      console.warn('Redis getLastUpdate error, falling back to memory cache:', error.message)
    }
  }

  // Fallback to memory cache
  return getLastUpdateCache()
}

export async function getPolymarketLastUpdate() {
  if (redis) {
    try {
      const update = await redis.get(REDIS_KEYS.POLYMARKET_LAST_UPDATE)
      if (update) return update
    } catch (error) {
      console.warn('Redis getPolymarketLastUpdate error, falling back to memory cache:', (error as any).message)
    }
  }
  return memoryCache.get(CACHE_KEYS.POLYMARKET_LAST_UPDATE)
}

// Polymarket caching helpers
export async function setPolymarketMarkets(markets: any[]) {
  // Always set memory cache too
  setPolymarketMarketsCache(markets)
  if (redis) {
    try {
      await redis.setex(REDIS_KEYS.POLYMARKET_MARKETS, TTL.MARKETS, JSON.stringify(markets))
      await redis.set(REDIS_KEYS.POLYMARKET_LAST_UPDATE, Date.now())
      // Also store each market individually for quick lookup
      const pipeline = redis.pipeline()
      for (const m of markets) {
        if (m?.id) pipeline.setex(REDIS_KEYS.POLYMARKET_MARKET(m.id), TTL.MARKETS, JSON.stringify(m))
      }
      await pipeline.exec()
      return true
    } catch (e: any) {
      console.warn('Redis setPolymarketMarkets error:', e.message)
    }
  }
  return true
}

export async function getPolymarketMarkets(): Promise<any[] | null> {
  if (redis) {
    try {
      const data = await redis.get(REDIS_KEYS.POLYMARKET_MARKETS)
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data as string) : (data as any)
        setPolymarketMarketsCache(parsed)
        return parsed
      }
    } catch (e: any) {
      console.warn('Redis getPolymarketMarkets error:', e.message)
    }
  }
  return getPolymarketMarketsCache()
}

export async function getPolymarketMarket(id: string): Promise<any | null> {
  if (redis) {
    try {
      const data = await redis.get(REDIS_KEYS.POLYMARKET_MARKET(id))
      if (data) return typeof data === 'string' ? JSON.parse(data as string) : (data as any)
    } catch {}
  }
  // fallback: try memory cache list
  const list = getPolymarketMarketsCache()
  return Array.isArray(list) ? list.find((m: any) => m.id === id) || null : null
}

// Test Redis connection
export async function testRedisConnection() {
  if (!redis) return false
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Redis connection failed:', error)
    return false
  }
}
