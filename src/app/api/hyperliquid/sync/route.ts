import { NextRequest, NextResponse } from 'next/server'
import { redis, setMarketData, setOrderBookData, setMetaData } from '@/lib/redis'

const HL_INFO_URL = process.env.HYPERLIQUID_INFO_URL || 'https://api.hyperliquid.xyz/info'

interface HyperliquidAssetContext {
  funding: string
  openInterest: string
  prevDayPx: string
  dayNtlVlm: string
  premium: string
  oraclePx: string
  markPx: string
  midPx: string
  impactPxs: string[]
  dayBaseVlm: string
}

interface HyperliquidAsset {
  szDecimals: number
  name: string
  maxLeverage: number
  marginTableId: number
  isDelisted?: boolean
  onlyIsolated?: boolean
}

interface HyperliquidOrderBookLevel {
  px: string
  sz: string
  n: number
}

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

export async function GET(req: NextRequest) {
  try {
    console.log('🔄 Starting Hyperliquid data sync...')

    // Fetch all required data in parallel
    const [metaAndAssetCtxs, mids, fundingRates] = await Promise.all([
      postInfo({ type: 'metaAndAssetCtxs' }),
      postInfo({ type: 'allMids' }),
      postInfo({ type: 'fundingRates' }).catch(() => null),
    ])

    // Handle the response structure correctly
    let universe, assetCtxs

    if (Array.isArray(metaAndAssetCtxs) && metaAndAssetCtxs.length >= 2) {
      [universe, assetCtxs] = metaAndAssetCtxs
      // Extract universe array from the first element
      if (universe?.universe) {
        universe = universe.universe
      }
    } else {
      throw new Error('Invalid metaAndAssetCtxs response structure')
    }

    if (!Array.isArray(universe) || !Array.isArray(assetCtxs)) {
      throw new Error(`Invalid data arrays: universe=${Array.isArray(universe)}, assetCtxs=${Array.isArray(assetCtxs)}`)
    }

    console.log(`📊 Processing ${universe.length} assets with ${assetCtxs.length} contexts`)

    // Process market data
    const markets = universe
      .filter((asset: HyperliquidAsset) => !asset.isDelisted)
      .map((asset: HyperliquidAsset, index: number) => {
        const ctx: HyperliquidAssetContext = assetCtxs[index]
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

    // Store market data in Redis
    await setMarketData(markets)

    // Store metadata
    await setMetaData({
      universe,
      fundingRates,
      lastSync: new Date().toISOString(),
    })

    console.log(`✅ Synced ${markets.length} markets to Redis`)

    // Optionally sync order books for top markets (to avoid rate limits, only sync a few)
    const topMarkets = ['BTC', 'ETH', 'SOL', 'AVAX', 'ARB']
    const orderBookPromises = topMarkets.map(async (coin) => {
      try {
        const orderBook = await postInfo({ type: 'l2Book', coin })
        if (orderBook?.levels) {
          const [bids, asks] = orderBook.levels
          const formattedOrderBook = {
            bids: bids.map((level: HyperliquidOrderBookLevel, index: number) => ({
              price: parseFloat(level.px),
              size: parseFloat(level.sz),
              total: bids.slice(0, index + 1).reduce((sum: number, l: HyperliquidOrderBookLevel) => sum + parseFloat(l.sz), 0)
            })),
            asks: asks.map((level: HyperliquidOrderBookLevel, index: number) => ({
              price: parseFloat(level.px),
              size: parseFloat(level.sz),
              total: asks.slice(0, index + 1).reduce((sum: number, l: HyperliquidOrderBookLevel) => sum + parseFloat(l.sz), 0)
            })),
            spread: asks.length > 0 && bids.length > 0 ? parseFloat(asks[0].px) - parseFloat(bids[0].px) : 0,
            lastUpdate: new Date(),
          }
          await setOrderBookData(`${coin}-USD`, formattedOrderBook)
        }
      } catch (error) {
        console.warn(`Failed to sync order book for ${coin}:`, error)
      }
    })

    await Promise.allSettled(orderBookPromises)

    return NextResponse.json({
      success: true,
      marketsCount: markets.length,
      timestamp: new Date().toISOString(),
      message: 'Hyperliquid data synced to Redis'
    })

  } catch (error: any) {
    console.error('❌ Hyperliquid sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to sync Hyperliquid data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Optional: Add a simple endpoint to trigger sync manually
export async function POST(req: NextRequest) {
  return GET(req)
}