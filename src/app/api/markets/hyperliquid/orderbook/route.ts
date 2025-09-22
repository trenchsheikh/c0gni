import { NextRequest } from 'next/server'
import { getOrderBookData, setOrderBookData } from '@/lib/redis'
const HL_INFO_URL = process.env.HYPERLIQUID_INFO_URL || 'https://api.hyperliquid.xyz/info'

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

    // If no cached data, fetch and cache on demand
    try {
      const resp = await fetch(HL_INFO_URL, {
        method: 'POST', headers: { 'content-type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ type: 'l2Book', coin: symbol.replace('-USD', '') })
      })
      if (resp.ok) {
        const data = await resp.json()
        if (data?.levels) {
          const [bids, asks] = data.levels
          const formatted = {
            bids: bids.map((l: any, i: number) => ({ price: parseFloat(l.px), size: parseFloat(l.sz), total: bids.slice(0, i + 1).reduce((s: number, x: any) => s + parseFloat(x.sz), 0) })),
            asks: asks.map((l: any, i: number) => ({ price: parseFloat(l.px), size: parseFloat(l.sz), total: asks.slice(0, i + 1).reduce((s: number, x: any) => s + parseFloat(x.sz), 0) })),
            spread: asks.length && bids.length ? parseFloat(asks[0].px) - parseFloat(bids[0].px) : 0,
            lastUpdate: new Date(),
          }
          await setOrderBookData(symbol, formatted)
          return Response.json({ orderBook: formatted, cached: false, symbol, message: 'Fetched and cached order book' })
        }
      }
    } catch {}
    return Response.json({ orderBook: null, cached: false, symbol, message: 'Order book not available' })

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
