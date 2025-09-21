// In-memory cache for Hyperliquid data (fallback when Redis unavailable)
// This provides fast caching for Vercel serverless functions

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })

    // Clean up expired entries periodically
    this.cleanup()
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  clear(): void {
    this.cache.clear()
  }

  private cleanup(): void {
    // Only cleanup every 100 operations to avoid performance impact
    if (this.cache.size % 100 !== 0) return

    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  size(): number {
    return this.cache.size
  }

  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++
      } else {
        valid++
      }
    }

    return { total: this.cache.size, valid, expired }
  }
}

// Global cache instance
export const memoryCache = new InMemoryCache()

// Cache keys
export const CACHE_KEYS = {
  HYPERLIQUID_MARKETS: 'hyperliquid:markets',
  HYPERLIQUID_ORDERBOOK: (symbol: string) => `hyperliquid:orderbook:${symbol}`,
  HYPERLIQUID_LAST_UPDATE: 'hyperliquid:last_update',
  HYPERLIQUID_META: 'hyperliquid:meta',
} as const

// TTL values (in seconds)
export const CACHE_TTL = {
  MARKETS: 30, // 30 seconds for markets (frequent updates)
  ORDERBOOK: 5, // 5 seconds for order books (very frequent)
  META: 300, // 5 minutes for metadata
} as const

// Helper functions
export function setMarketDataCache(data: any): void {
  memoryCache.set(CACHE_KEYS.HYPERLIQUID_MARKETS, data, CACHE_TTL.MARKETS)
  memoryCache.set(CACHE_KEYS.HYPERLIQUID_LAST_UPDATE, Date.now(), CACHE_TTL.MARKETS)
}

export function getMarketDataCache() {
  return memoryCache.get(CACHE_KEYS.HYPERLIQUID_MARKETS)
}

export function setOrderBookDataCache(symbol: string, data: any): void {
  memoryCache.set(CACHE_KEYS.HYPERLIQUID_ORDERBOOK(symbol), data, CACHE_TTL.ORDERBOOK)
}

export function getOrderBookDataCache(symbol: string) {
  return memoryCache.get(CACHE_KEYS.HYPERLIQUID_ORDERBOOK(symbol))
}

export function getLastUpdateCache() {
  return memoryCache.get(CACHE_KEYS.HYPERLIQUID_LAST_UPDATE)
}