import { NextRequest } from 'next/server'
import { getMarketData, getLastUpdate } from '@/lib/redis'

const HL_INFO_URL = process.env.HYPERLIQUID_INFO_URL || 'https://api.hyperliquid.xyz/info'

async function postInfo(body: any) {
  const resp = await fetch(HL_INFO_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(body),
  })
  if (!resp.ok) throw new Error(`Hyperliquid info error ${resp.status}`)
  return resp.json()
}

// Fallback function for when Redis is unavailable - fetch full data
async function getFallbackMarkets() {
  try {
    console.log('📡 Fetching complete market data as fallback...')

    // Fetch complete data like the sync endpoint does
    const [metaAndAssetCtxs, mids, fundingRates] = await Promise.all([
      postInfo({ type: 'metaAndAssetCtxs' }),
      postInfo({ type: 'allMids' }),
      postInfo({ type: 'fundingRates' }).catch(() => null),
    ])

    // Handle the response structure correctly
    let universe, assetCtxs
    if (Array.isArray(metaAndAssetCtxs) && metaAndAssetCtxs.length >= 2) {
      [universe, assetCtxs] = metaAndAssetCtxs
      if (universe?.universe) {
        universe = universe.universe
      }
    } else {
      throw new Error('Invalid metaAndAssetCtxs response structure')
    }

    if (!Array.isArray(universe) || !Array.isArray(assetCtxs)) {
      throw new Error(`Invalid data arrays: universe=${Array.isArray(universe)}, assetCtxs=${Array.isArray(assetCtxs)}`)
    }

    console.log(`📊 Processing ${universe.length} assets with ${assetCtxs.length} contexts (fallback)`)

    // Process market data with full statistics
    const markets = universe
      .filter((asset: any) => !asset.isDelisted)
      .map((asset: any, index: number) => {
        const ctx = assetCtxs[index]
        const symbol = `${asset.name}-USD`
        const midPrice = parseFloat(mids[asset.name] || '0')
        const markPrice = parseFloat(ctx?.markPx || '0')
        const prevDayPrice = parseFloat(ctx?.prevDayPx || '0')
        const volume24h = parseFloat(ctx?.dayNtlVlm || '0')
        const openInterest = parseFloat(ctx?.openInterest || '0')
        const fundingRate = parseFloat(ctx?.funding || '0')

        // Calculate 24h change
        const priceChange24h = markPrice - prevDayPrice
        const priceChangePercent24h = prevDayPrice > 0 ? (priceChange24h / prevDayPrice) * 100 : 0

        return {
          symbol,
          marketType: 'perp' as const,
          baseAsset: asset.name,
          quoteAsset: 'USD',
          markPrice,
          indexPrice: parseFloat(ctx?.oraclePx || '0'),
          lastPrice: midPrice,
          priceChange24h,
          priceChangePercent24h,
          volume24h,
          openInterest,
          fundingRate,
          nextFunding: new Date(Date.now() + 8 * 60 * 60 * 1000), // Next funding in 8 hours (approximate)
          maxLeverage: asset.maxLeverage,
          status: 'active',
          szDecimals: asset.szDecimals,
          premium: parseFloat(ctx?.premium || '0'),
          dayBaseVlm: parseFloat(ctx?.dayBaseVlm || '0'),
        }
      })

    console.log(`✅ Fallback returned ${markets.length} markets with complete data`)
    return markets

  } catch (error) {
    console.error('Fallback market fetch failed:', error)

    // Ultimate fallback - basic data only
    const [meta, mids] = await Promise.all([
      postInfo({ type: 'meta' }).catch(() => ({})),
      postInfo({ type: 'allMids' }).catch(() => ({})),
    ])

    const perps = meta?.universe || []
    return perps.map((asset: any) => ({
      symbol: `${asset.name}-USD`,
      marketType: 'perp',
      baseAsset: asset.name,
      quoteAsset: 'USD',
      markPrice: parseFloat(mids[asset.name] || '0'),
      lastPrice: parseFloat(mids[asset.name] || '0'),
      priceChange24h: 0,
      priceChangePercent24h: 0,
      volume24h: 0,
      openInterest: 0,
      fundingRate: 0,
      maxLeverage: asset.maxLeverage,
      status: 'active',
    }))
  }
}

export async function GET(_req: NextRequest) {
  try {
    // Try to get cached data from Redis first
    const cachedMarkets = await getMarketData()

    if (cachedMarkets && Array.isArray(cachedMarkets)) {
      const lastUpdate = await getLastUpdate()
      return Response.json({
        markets: cachedMarkets,
        cached: true,
        lastUpdate: lastUpdate ? new Date(Number(lastUpdate)).toISOString() : null
      })
    }

    // If no cached data, fall back to direct API call
    console.log('No cached data found, falling back to direct API call')
    const markets = await getFallbackMarkets()

    return Response.json({
      markets,
      cached: false,
      message: 'Data fetched directly from Hyperliquid API. Consider running /api/hyperliquid/sync to cache data.'
    })
  } catch (e: any) {
    console.error('Error in markets API:', e)
    return Response.json({ error: e?.message || 'Failed to load markets' }, { status: 500 })
  }
}

