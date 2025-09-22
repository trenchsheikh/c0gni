import { NextRequest, NextResponse } from 'next/server'
import { calculatePortfolioMetrics, calculatePlatformBreakdown, calculateRiskMetrics } from '@/lib/portfolio-calculations'

interface PortfolioPosition {
  platform: 'polymarket' | 'hyperliquid'
  marketId: string
  symbol?: string
  question?: string
  side: string
  size: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  category?: string
}

interface PortfolioSummary {
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  polymarketValue: number
  hyperliquidValue: number
  dayChange: number
  dayChangePercent: number
  activePositions: number
  winRate: number
}

// Fetch Polymarket positions for a wallet
async function fetchPolymarketPositions(address: string): Promise<PortfolioPosition[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/markets/polymarket/positions?address=${address}`, {
      cache: 'no-store'
    })

    if (!res.ok) return []

    const data = await res.json()
    const positions = data.positions || []

    return positions.map((pos: any) => ({
      platform: 'polymarket' as const,
      marketId: pos.marketId || pos.id,
      question: pos.question,
      side: pos.side,
      size: pos.shares || 0,
      avgPrice: pos.avgPrice || 0,
      currentPrice: pos.currentPrice || 0,
      marketValue: pos.marketValue || 0,
      unrealizedPnl: pos.unrealizedPnl || 0,
      unrealizedPnlPercent: pos.unrealizedPnlPercent || 0,
      category: pos.category
    }))
  } catch (error) {
    console.error('Failed to fetch Polymarket positions:', error)
    return []
  }
}

// Fetch Hyperliquid positions for a wallet
async function fetchHyperliquidPositions(address: string): Promise<PortfolioPosition[]> {
  try {
    // In a real implementation, this would call Hyperliquid's user API
    // For now, we'll return empty array since Hyperliquid requires specific API integration
    const res = await fetch(`${process.env.HYPERLIQUID_INFO_URL || 'https://api.hyperliquid.xyz/info'}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: 'clearinghouseState',
        user: address
      }),
      cache: 'no-store'
    })

    if (!res.ok) return []

    const data = await res.json()
    const positions = data.assetPositions || []

    return positions
      .filter((pos: any) => parseFloat(pos.position?.szi || '0') !== 0)
      .map((pos: any) => {
        const size = parseFloat(pos.position?.szi || '0')
        const entryPx = parseFloat(pos.position?.entryPx || '0')
        const unrealizedPnl = parseFloat(pos.position?.unrealizedPnl || '0')
        const leverage = parseFloat(pos.leverage?.value || '1')

        return {
          platform: 'hyperliquid' as const,
          marketId: pos.position?.coin || 'Unknown',
          symbol: `${pos.position?.coin}-USD`,
          side: size > 0 ? 'LONG' : 'SHORT',
          size: Math.abs(size),
          avgPrice: entryPx,
          currentPrice: entryPx + (unrealizedPnl / Math.abs(size)), // Approximate current price
          marketValue: Math.abs(size) * entryPx,
          unrealizedPnl,
          unrealizedPnlPercent: entryPx > 0 ? (unrealizedPnl / (Math.abs(size) * entryPx)) * 100 : 0
        }
      })
  } catch (error) {
    console.error('Failed to fetch Hyperliquid positions:', error)
    return []
  }
}

// Calculate portfolio summary from positions using advanced calculations
function calculatePortfolioSummary(positions: PortfolioPosition[]): PortfolioSummary {
  const metrics = calculatePortfolioMetrics(positions)
  const breakdown = calculatePlatformBreakdown(positions)

  return {
    totalValue: metrics.totalValue,
    totalPnL: metrics.totalPnL,
    totalPnLPercent: metrics.totalPnLPercent,
    polymarketValue: breakdown.polymarket.value,
    hyperliquidValue: breakdown.hyperliquid.value,
    dayChange: metrics.dayChange,
    dayChangePercent: metrics.dayChangePercent,
    activePositions: metrics.totalTrades,
    winRate: metrics.winRate
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Validate address format (basic check)
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Fetch positions from both platforms in parallel
    const [polymarketPositions, hyperliquidPositions] = await Promise.all([
      fetchPolymarketPositions(address),
      fetchHyperliquidPositions(address)
    ])

    const allPositions = [...polymarketPositions, ...hyperliquidPositions]
    const summary = calculatePortfolioSummary(allPositions)
    const metrics = calculatePortfolioMetrics(allPositions)
    const breakdown = calculatePlatformBreakdown(allPositions)
    const riskMetrics = calculateRiskMetrics(allPositions)

    return NextResponse.json({
      success: true,
      address,
      summary,
      positions: allPositions,
      metrics: {
        ...metrics,
        performance: {
          sharpeRatio: metrics.sharpeRatio,
          maxDrawdown: metrics.maxDrawdown,
          volatility: metrics.volatility,
          bestTrade: metrics.bestTrade,
          worstTrade: metrics.worstTrade
        }
      },
      breakdown,
      risk: riskMetrics,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Portfolio API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}