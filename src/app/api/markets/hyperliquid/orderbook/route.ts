import { NextRequest } from 'next/server'
import { getOrderBookData } from '@/lib/redis'

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

// Fallback function for when Redis doesn't have the order book
async function getFallbackOrderBook(coin: string) {
  try {
    const orderBook = await postInfo({ type: 'l2Book', coin })
    if (!orderBook?.levels) return null

    const [bids, asks] = orderBook.levels
    return {
      bids: bids.map((level: any, index: number) => ({
        price: parseFloat(level.px),
        size: parseFloat(level.sz),
        total: bids.slice(0, index + 1).reduce((sum: number, l: any) => sum + parseFloat(l.sz), 0)
      })),
      asks: asks.map((level: any, index: number) => ({
        price: parseFloat(level.px),
        size: parseFloat(level.sz),
        total: asks.slice(0, index + 1).reduce((sum: number, l: any) => sum + parseFloat(l.sz), 0)
      })),
      spread: asks.length > 0 && bids.length > 0 ? parseFloat(asks[0].px) - parseFloat(bids[0].px) : 0,
      lastUpdate: new Date(),
    }
  } catch (error) {
    console.error('Failed to fetch order book from Hyperliquid:', error)
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')

  if (!symbol) {
    return Response.json({ error: 'Missing symbol parameter' }, { status: 400 })
  }

  try {
    // Try to get cached order book from Redis first
    const cachedOrderBook = await getOrderBookData(symbol)

    if (cachedOrderBook) {
      return Response.json({
        orderBook: cachedOrderBook,
        cached: true,
        symbol
      })
    }

    // If no cached data, try to fetch directly from Hyperliquid
    const coin = symbol.replace('-USD', '')
    const orderBook = await getFallbackOrderBook(coin)

    if (orderBook) {
      return Response.json({
        orderBook,
        cached: false,
        symbol,
        message: 'Data fetched directly from Hyperliquid API'
      })
    }

    return Response.json({
      orderBook: null,
      symbol,
      message: 'Order book not available'
    })

  } catch (error: any) {
    console.error('Error in order book API:', error)
    return Response.json(
      {
        error: error?.message || 'Failed to load order book',
        symbol
      },
      { status: 500 }
    )
  }
}

