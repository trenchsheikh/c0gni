import { getMarketData } from './redis'

const HL_INFO_URL = process.env.HYPERLIQUID_INFO_URL || 'https://api.hyperliquid.xyz/info'

async function postHL(body: any) {
  const resp = await fetch(HL_INFO_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(body),
  })
  if (!resp.ok) throw new Error(`Hyperliquid info error ${resp.status}`)
  return resp.json()
}

export async function getHyperliquidMarkets(): Promise<any[]> {
  // Try Redis-backed cache first
  try {
    const cached = await getMarketData()
    if (cached && Array.isArray(cached) && cached.length) return cached
  } catch {}

  // Fallback: query Hyperliquid info API directly
  try {
    const [metaAndAssetCtxs, mids] = await Promise.all([
      postHL({ type: 'metaAndAssetCtxs' }),
      postHL({ type: 'allMids' }),
    ])

    let universe: any[] | undefined
    let assetCtxs: any[] | undefined
    if (Array.isArray(metaAndAssetCtxs) && metaAndAssetCtxs.length >= 2) {
      ;[universe, assetCtxs] = metaAndAssetCtxs
      if ((universe as any)?.universe) universe = (universe as any).universe
    }
    if (!Array.isArray(universe) || !Array.isArray(assetCtxs)) {
      throw new Error('Invalid Hyperliquid metaAndAssetCtxs response')
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
  } catch (e) {
    // Last-resort empty list
    return []
  }
}

