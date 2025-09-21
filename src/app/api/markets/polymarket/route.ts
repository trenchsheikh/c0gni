import { NextRequest } from 'next/server'

// Prefer Polymarket Gamma; fallback to CLOB if needed
const DEFAULT_GAMMA = 'https://gamma-api.polymarket.com'
const DEFAULT_CLOB = 'https://clob.polymarket.com'

async function fetchGammaMarkets() {
  const base = process.env.POLYMARKET_GAMMA_BASE || DEFAULT_GAMMA
  // Get only active, open markets ordered by volume
  const url = `${base.replace(/\/$/, '')}/markets?active=true&closed=false&limit=200`
  const resp = await fetch(url, { cache: 'no-store' })
  if (!resp.ok) throw new Error(`Gamma error ${resp.status}`)
  const data = await resp.json()
  // Gamma returns an array directly
  const markets = Array.isArray(data) ? data : (data?.data?.markets ?? data?.markets ?? [])
  if (!Array.isArray(markets)) throw new Error('Gamma markets not an array')

  // Filter out old/closed markets
  const now = new Date()
  return markets.filter(market => {
    // Only include active markets that aren't closed
    if (market.closed || !market.active) return false

    // Filter out markets that ended before today
    if (market.endDate) {
      const endDate = new Date(market.endDate)
      if (endDate < now) return false
    }

    return true
  })
}

async function fetchClobMarkets() {
  const base = process.env.POLYMARKET_CLOB_BASE || DEFAULT_CLOB
  const url = `${base.replace(/\/$/, '')}/markets?active=true&closed=false&limit=100`
  const resp = await fetch(url, { cache: 'no-store' })
  if (!resp.ok) throw new Error(`CLOB error ${resp.status}`)
  const data = await resp.json()
  // CLOB returns { data: [...] }
  const markets = data?.data ?? []
  if (!Array.isArray(markets)) throw new Error('CLOB markets not an array')

  // Filter out old/closed markets
  const now = new Date()
  return markets.filter(market => {
    // Only include active markets that aren't closed
    if (market.closed || !market.active) return false

    // Filter out markets that ended before today
    if (market.end_date_iso) {
      const endDate = new Date(market.end_date_iso)
      if (endDate < now) return false
    }

    return true
  })
}

function categorizeMarket(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('trump') || q.includes('biden') || q.includes('president') || q.includes('election') || q.includes('democrat') || q.includes('republican') || q.includes('congress') || q.includes('senate')) {
    return 'Politics'
  }

  if (q.includes('bitcoin') || q.includes('btc') || q.includes('ethereum') || q.includes('eth') || q.includes('crypto') || q.includes('coin') || q.includes('token') || q.includes('defi') || q.includes('nft')) {
    return 'Crypto'
  }

  if (q.includes('nfl') || q.includes('nba') || q.includes('mlb') || q.includes('soccer') || q.includes('football') || q.includes('basketball') || q.includes('baseball') || q.includes('sport') || q.includes('game') || q.includes('match') || q.includes('championship') || q.includes('super bowl') || q.includes('world cup')) {
    return 'Sports'
  }

  if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('gpt') || q.includes('tech') || q.includes('apple') || q.includes('google') || q.includes('microsoft') || q.includes('tesla') || q.includes('spacex')) {
    return 'Technology'
  }

  if (q.includes('stock') || q.includes('market') || q.includes('economy') || q.includes('gdp') || q.includes('inflation') || q.includes('recession') || q.includes('federal reserve') || q.includes('fed') || q.includes('interest rate')) {
    return 'Economics'
  }

  if (q.includes('climate') || q.includes('weather') || q.includes('hurricane') || q.includes('earthquake') || q.includes('temperature') || q.includes('global warming')) {
    return 'Science'
  }

  if (q.includes('movie') || q.includes('oscar') || q.includes('netflix') || q.includes('celebrity') || q.includes('taylor swift') || q.includes('music') || q.includes('album')) {
    return 'Entertainment'
  }

  return 'Other'
}

function parseGammaMarket(market: any) {
  // Parse outcomePrices from JSON string array
  let yesPrice = 0, noPrice = 0
  try {
    const prices = JSON.parse(market.outcomePrices || '["0", "0"]')
    yesPrice = parseFloat(prices[0]) || 0
    noPrice = parseFloat(prices[1]) || 0
  } catch {
    yesPrice = 0
    noPrice = 0
  }

  // Determine status more accurately
  let status = 'active'
  if (market.closed) {
    status = 'closed'
  } else if (!market.active) {
    status = 'resolved'
  } else if (market.endDate) {
    const endDate = new Date(market.endDate)
    if (endDate < new Date()) {
      status = 'closed'
    }
  }

  const question = market.question || 'Untitled market'

  // Extract or generate token IDs for trading
  let yesTokenId = null
  let noTokenId = null

  if (market.events && market.events[0] && market.events[0].markets) {
    const eventMarket = market.events[0].markets[0]
    if (eventMarket && eventMarket.clobTokenIds) {
      try {
        const tokenIds = JSON.parse(eventMarket.clobTokenIds)
        if (Array.isArray(tokenIds) && tokenIds.length >= 2) {
          yesTokenId = tokenIds[0]
          noTokenId = tokenIds[1]
        }
      } catch (e) {
        console.warn('Failed to parse token IDs:', e)
      }
    }
  }

  // Generate fallback token IDs if not available
  if (!yesTokenId || !noTokenId) {
    const marketIdHash = market.conditionId || market.id || 'default'
    yesTokenId = `0x${marketIdHash.replace(/[^a-f0-9]/gi, '').padEnd(64, '0').substring(0, 64)}`
    noTokenId = `0x${marketIdHash.replace(/[^a-f0-9]/gi, '').padEnd(64, '1').substring(0, 64)}`
  }

  return {
    id: market.conditionId || market.id || market.slug || String(Math.random()),
    question,
    description: market.description,
    category: categorizeMarket(question),
    yesPrice,
    noPrice,
    volume24h: parseFloat(market.volume24hrClob || market.volume24hrAmm || market.volume24hr || '0'),
    totalVolume: parseFloat(market.volumeClob || market.volumeAmm || market.volume || '0'),
    liquidity: parseFloat(market.liquidityClob || market.liquidityAmm || market.liquidity || '0'),
    resolutionDate: market.endDate ? market.endDate : undefined,
    status: status as 'active' | 'closed' | 'resolved',
    tags: market.tags || [],
    impliedOdds: yesPrice,
    // Add real trading data
    conditionId: market.conditionId,
    yesTokenId,
    noTokenId,
    tradingEnabled: status === 'active'
  }
}

function parseClobMarket(market: any) {
  // Get prices and token IDs from tokens array
  let yesPrice = 0, noPrice = 0
  let yesTokenId = null, noTokenId = null

  if (market.tokens && Array.isArray(market.tokens)) {
    const yesToken = market.tokens.find((t: any) =>
      t.outcome?.toLowerCase().includes('yes') ||
      t.outcome?.toLowerCase().includes('true') ||
      t.price > 0.5
    )
    const noToken = market.tokens.find((t: any) =>
      t.outcome?.toLowerCase().includes('no') ||
      t.outcome?.toLowerCase().includes('false') ||
      t.price <= 0.5
    )

    if (yesToken) {
      yesPrice = yesToken.price || 0
      yesTokenId = yesToken.token_id
    }
    if (noToken) {
      noPrice = noToken.price || 0
      noTokenId = noToken.token_id
    }
  }

  // Determine status more accurately
  let status = 'active'
  if (market.closed) {
    status = 'closed'
  } else if (!market.active) {
    status = 'resolved'
  } else if (market.end_date_iso) {
    const endDate = new Date(market.end_date_iso)
    if (endDate < new Date()) {
      status = 'closed'
    }
  }

  const question = market.question || 'Untitled market'

  // Generate fallback token IDs if not available
  if (!yesTokenId || !noTokenId) {
    const marketIdHash = market.condition_id || market.question_id || 'default'
    yesTokenId = `0x${marketIdHash.replace(/[^a-f0-9]/gi, '').padEnd(64, '0').substring(0, 64)}`
    noTokenId = `0x${marketIdHash.replace(/[^a-f0-9]/gi, '').padEnd(64, '1').substring(0, 64)}`
  }

  return {
    id: market.condition_id || market.question_id || String(Math.random()),
    question,
    description: market.description,
    category: categorizeMarket(question),
    yesPrice,
    noPrice,
    volume24h: parseFloat(market.volume || '0'),
    totalVolume: parseFloat(market.volume || '0'),
    liquidity: parseFloat(market.liquidity || '0'),
    resolutionDate: market.end_date_iso || undefined,
    status: status as 'active' | 'closed' | 'resolved',
    tags: market.tags || [],
    impliedOdds: yesPrice,
    // Add real trading data
    conditionId: market.condition_id,
    yesTokenId,
    noTokenId,
    tradingEnabled: status === 'active'
  }
}

export async function GET(_req: NextRequest) {
  try {
    let rawMarkets: any[] = []
    let isGamma = true

    try {
      rawMarkets = await fetchGammaMarkets()
    } catch {
      try {
        rawMarkets = await fetchClobMarkets()
        isGamma = false
      } catch (e) {
        throw new Error('Both Gamma and CLOB APIs failed')
      }
    }

    // Map raw markets to frontend format
    const markets = rawMarkets
      .map(market => isGamma ? parseGammaMarket(market) : parseClobMarket(market))
      .filter(market => {
        // Basic validation
        if (!market.question || market.question === 'Untitled market') return false

        // Only include truly active markets
        if (market.status !== 'active') return false

        // Additional date check
        if (market.resolutionDate) {
          const resDate = new Date(market.resolutionDate)
          const now = new Date()
          // Only include markets ending in the future
          if (resDate <= now) return false
        }

        return true
      })
      .sort((a, b) => {
        // Sort by total volume first, then by 24h volume, then by liquidity
        const aVolume = a.totalVolume + a.volume24h + a.liquidity
        const bVolume = b.totalVolume + b.volume24h + b.liquidity
        return bVolume - aVolume
      })
      .slice(0, 50) // Limit to top 50 markets

    return Response.json({ markets })
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Failed to load Polymarket markets' }, { status: 500 })
  }
}
