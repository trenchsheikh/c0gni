import { NextRequest, NextResponse } from 'next/server'
import { setPolymarketMarkets } from '@/lib/redis'

const DEFAULT_GAMMA = 'https://gamma-api.polymarket.com'
const DEFAULT_CLOB = 'https://clob.polymarket.com'

async function fetchGammaMarkets() {
  const base = process.env.POLYMARKET_GAMMA_BASE || DEFAULT_GAMMA
  const url = `${base.replace(/\/$/, '')}/markets?active=true&closed=false&limit=500`
  const resp = await fetch(url, { cache: 'no-store' })
  if (!resp.ok) throw new Error(`Gamma error ${resp.status}`)
  const data = await resp.json()
  return Array.isArray(data) ? data : (data?.data?.markets ?? data?.markets ?? [])
}

async function fetchClobMarkets() {
  const base = process.env.POLYMARKET_CLOB_BASE || DEFAULT_CLOB
  const url = `${base.replace(/\/$/, '')}/markets?active=true&closed=false&limit=500`
  const resp = await fetch(url, { cache: 'no-store' })
  if (!resp.ok) throw new Error(`CLOB error ${resp.status}`)
  const data = await resp.json()
  return data?.data ?? []
}

function categorizeMarket(question: string): string {
  const q = (question || '').toLowerCase()
  if (q.includes('trump') || q.includes('biden') || q.includes('president') || q.includes('election')) return 'Politics'
  if (q.includes('bitcoin') || q.includes('btc') || q.includes('ethereum') || q.includes('eth') || q.includes('crypto')) return 'Crypto'
  if (q.includes('nfl') || q.includes('nba') || q.includes('sport')) return 'Sports'
  if (q.includes('ai') || q.includes('gpt') || q.includes('tech')) return 'Technology'
  if (q.includes('stock') || q.includes('market') || q.includes('economy')) return 'Economics'
  if (q.includes('climate') || q.includes('weather')) return 'Science'
  if (q.includes('movie') || q.includes('oscar') || q.includes('music')) return 'Entertainment'
  return 'Other'
}

function parseGammaMarket(market: any) {
  let yesPrice = 0, noPrice = 0
  try {
    const prices = JSON.parse(market.outcomePrices || '["0","0"]')
    yesPrice = parseFloat(prices[0]) || 0
    noPrice = parseFloat(prices[1]) || 0
  } catch {}

  let status = 'active'
  if (market.closed) status = 'closed'
  else if (!market.active) status = 'resolved'
  else if (market.endDate && new Date(market.endDate) < new Date()) status = 'closed'

  const question = market.question || 'Untitled market'

  let yesTokenId = null, noTokenId = null
  if (market.events && market.events[0]?.markets?.[0]?.clobTokenIds) {
    try {
      const tokenIds = JSON.parse(market.events[0].markets[0].clobTokenIds)
      if (Array.isArray(tokenIds) && tokenIds.length >= 2) {
        yesTokenId = tokenIds[0]
        noTokenId = tokenIds[1]
      }
    } catch {}
  }

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
    conditionId: market.conditionId,
    yesTokenId,
    noTokenId,
    tradingEnabled: status === 'active'
  }
}

function parseClobMarket(market: any) {
  let yesPrice = 0, noPrice = 0
  let yesTokenId = null, noTokenId = null

  if (Array.isArray(market.tokens)) {
    const yesToken = market.tokens.find((t: any) => t.outcome?.toLowerCase().includes('yes') || t.price > 0.5)
    const noToken = market.tokens.find((t: any) => t.outcome?.toLowerCase().includes('no') || t.price <= 0.5)
    if (yesToken) { yesPrice = yesToken.price || 0; yesTokenId = yesToken.token_id }
    if (noToken) { noPrice = noToken.price || 0; noTokenId = noToken.token_id }
  }

  let status = 'active'
  if (market.closed) status = 'closed'
  else if (!market.active) status = 'resolved'
  else if (market.end_date_iso && new Date(market.end_date_iso) < new Date()) status = 'closed'

  const question = market.question || 'Untitled market'

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
    conditionId: market.condition_id,
    yesTokenId,
    noTokenId,
    tradingEnabled: status === 'active'
  }
}

export async function GET(_req: NextRequest) {
  try {
    let raw: any[] = []
    let isGamma = true
    try { raw = await fetchGammaMarkets() } catch { try { raw = await fetchClobMarkets(); isGamma = false } catch (e) { throw e } }

    const now = new Date()
    const markets = raw
      .map(m => isGamma ? parseGammaMarket(m) : parseClobMarket(m))
      .filter(m => m.status === 'active' && (!m.resolutionDate || new Date(m.resolutionDate) > now))
      .sort((a, b) => (b.totalVolume + b.volume24h + b.liquidity) - (a.totalVolume + a.volume24h + a.liquidity))
      .slice(0, 50)
    await setPolymarketMarkets(markets)
    return NextResponse.json({ success: true, count: markets.length, timestamp: new Date().toISOString() })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'sync failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) { return GET(req) }
