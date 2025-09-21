import { NextRequest } from 'next/server'

const DEFAULT_GAMMA = 'https://gamma-api.polymarket.com'
const DEFAULT_CLOB = 'https://clob.polymarket.com'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

    const clobBase = process.env.POLYMARKET_CLOB_BASE || DEFAULT_CLOB

    // First, try to get market data to find token IDs
    const marketUrl = `${clobBase.replace(/\/$/, '')}/markets?condition_id=${encodeURIComponent(id)}`
    let marketResp = await fetch(marketUrl, { cache: 'no-store' })

    if (!marketResp.ok) {
      // If condition_id doesn't work, try searching by question or ID
      const fallbackUrl = `${clobBase.replace(/\/$/, '')}/markets?limit=1000`
      marketResp = await fetch(fallbackUrl, { cache: 'no-store' })
    }

    if (!marketResp.ok) {
      return Response.json({ orderBook: null }, { status: 200 })
    }

    const marketData = await marketResp.json()
    const markets = marketData?.data || []

    // Find the market by ID or condition_id
    const market = markets.find((m: any) =>
      m.id === id ||
      m.condition_id === id ||
      m.question_id === id ||
      m.slug === id
    )

    if (!market || !market.tokens || !Array.isArray(market.tokens)) {
      return Response.json({ orderBook: null }, { status: 200 })
    }

    // Try to get orderbook for each token
    const orderBookData = {
      yes: { bids: [], asks: [] },
      no: { bids: [], asks: [] }
    }

    for (const token of market.tokens) {
      try {
        const bookUrl = `${clobBase.replace(/\/$/, '')}/book?token_id=${token.token_id}`
        const bookResp = await fetch(bookUrl, { cache: 'no-store' })

        if (bookResp.ok) {
          const bookData = await bookResp.json()

          // Determine if this is YES or NO token based on outcome
          const isYes = token.outcome?.toLowerCase().includes('yes') ||
                       token.outcome?.toLowerCase().includes('true') ||
                       token.price > 0.5

          const side = isYes ? 'yes' : 'no'

          if (bookData.bids) {
            orderBookData[side].bids = bookData.bids.map((bid: any) => ({
              price: parseFloat(bid.price || bid[0] || 0),
              size: parseFloat(bid.size || bid[1] || 0),
              total: parseFloat(bid.price || bid[0] || 0) * parseFloat(bid.size || bid[1] || 0)
            }))
          }

          if (bookData.asks) {
            orderBookData[side].asks = bookData.asks.map((ask: any) => ({
              price: parseFloat(ask.price || ask[0] || 0),
              size: parseFloat(ask.size || ask[1] || 0),
              total: parseFloat(ask.price || ask[0] || 0) * parseFloat(ask.size || ask[1] || 0)
            }))
          }
        }
      } catch (e) {
        // Continue if one token fails
        console.warn(`Failed to fetch orderbook for token ${token.token_id}:`, e)
      }
    }

    return Response.json({ orderBook: orderBookData })
  } catch (e) {
    console.error('Orderbook fetch error:', e)
    return Response.json({ orderBook: null })
  }
}
