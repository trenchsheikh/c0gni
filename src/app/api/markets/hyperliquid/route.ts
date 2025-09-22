import { NextRequest } from 'next/server'
import { getMarketData, getLastUpdate, setMarketData, TTL } from '@/lib/redis'

const HL_INFO_URL = process.env.HYPERLIQUID_INFO_URL || 'https://api.hyperliquid.xyz/info'

async function hlPostInfo(body: any) {
  const resp = await fetch(HL_INFO_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(body),
  })
  if (!resp.ok) throw new Error(`Hyperliquid info error ${resp.status}`)
  return resp.json()
}

async function fetchHyperliquidMarkets() {
  const [metaAndAssetCtxs, mids] = await Promise.all([
    hlPostInfo({ type: 'metaAndAssetCtxs' }),
    hlPostInfo({ type: 'allMids' })
  ])

  let universe: any = undefined
  let assetCtxs: any = undefined
  if (Array.isArray(metaAndAssetCtxs) && metaAndAssetCtxs.length >= 2) {
    ;[universe, assetCtxs] = metaAndAssetCtxs
    if (universe?.universe) universe = universe.universe
  } else {
    throw new Error('Invalid metaAndAssetCtxs response structure')
  }

  if (!Array.isArray(universe) || !Array.isArray(assetCtxs)) {
    throw new Error('Invalid data arrays from Hyperliquid')
  }

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
        nextFunding: new Date(Date.now() + 8 * 60 * 60 * 1000),
        maxLeverage: asset.maxLeverage,
        status: 'active',
        szDecimals: asset.szDecimals,
        premium: parseFloat(ctx?.premium || '0'),
        dayBaseVlm: parseFloat(ctx?.dayBaseVlm || '0'),
      }
    })

  return markets
}

export async function GET(_req: NextRequest) {
  try {
    const cached = await getMarketData()
    const last = await getLastUpdate()
    const stale = !last || (Date.now() - Number(last) > TTL.MARKETS * 1000)

    if (!cached || !Array.isArray(cached) || cached.length === 0 || stale) {
      // Auto-refresh when empty or stale
      const markets = await fetchHyperliquidMarkets()
      await setMarketData(markets)
      return Response.json({ markets, cached: false, lastUpdate: new Date().toISOString(), autoRefreshed: true })
    }

    return Response.json({
      markets: cached,
      cached: true,
      lastUpdate: last ? new Date(Number(last)).toISOString() : null
    })
  } catch (e: any) {
    console.error('Error in markets API:', e)
    return Response.json({ error: e?.message || 'Failed to load markets' }, { status: 500 })
  }
}
