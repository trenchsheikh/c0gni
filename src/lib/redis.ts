import {
    memoryCache,
    CACHE_KEYS, setMarketDataCache,
    getMarketDataCache,
    setOrderBookDataCache,
    getOrderBookDataCache,
    getLastUpdateCache,
    setPolymarketMarketsCache,
    getPolymarketMarketsCache
} from './in-memory-cache'

// Redis client configuration using Upstash
function createRedisClient() {
  console.log('ℹ️ [REDIS] Redis disabled by default for Vercel build compatibility')
  return null
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
  return true
}

export async function getMarketData() {
  console.log('💾 Falling back to memory cache')
  return getMarketDataCache()
}

export async function setOrderBookData(symbol: string, data: any) {
  // Always cache in memory for fast access
  setOrderBookDataCache(symbol, data)
  return true
}

export async function getOrderBookData(symbol: string) {
  // Fallback to memory cache
  return getOrderBookDataCache(symbol)
}

export async function setMetaData(data: any) {
  return false
}

export async function getMetaData() {
  return null
}

export async function getLastUpdate() {
  // Fallback to memory cache
  return getLastUpdateCache()
}

export async function getPolymarketLastUpdate() {
  return memoryCache.get(CACHE_KEYS.POLYMARKET_LAST_UPDATE)
}

// Polymarket caching helpers
export async function setPolymarketMarkets(markets: any[]) {
  // Always set memory cache too
  setPolymarketMarketsCache(markets)
  return true
}

export async function getPolymarketMarkets(): Promise<any[] | null> {
  return getPolymarketMarketsCache()
}

export async function getPolymarketMarket(id: string): Promise<any | null> {
  // fallback: try memory cache list
  const list = getPolymarketMarketsCache()
  return Array.isArray(list) ? list.find((m: any) => m.id === id) || null : null
}

// Test Redis connection
export async function testRedisConnection() {
  return false
}
