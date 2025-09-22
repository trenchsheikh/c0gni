import { NextRequest, NextResponse } from 'next/server'

interface TradingActivity {
  id: string
  type: 'trade' | 'prediction' | 'bridge' | 'agent'
  action: string
  platform: string
  marketId?: string
  symbol?: string
  question?: string
  amount: string
  side?: string
  price?: number
  shares?: number
  fees?: number
  txHash?: string
  timestamp: string
  status: 'success' | 'pending' | 'failed' | 'completed'
}

// Fetch trading history from blockchain/transaction logs
async function fetchTradingHistory(address: string, limit: number = 20): Promise<TradingActivity[]> {
  const activities: TradingActivity[] = []

  try {
    // Fetch Polymarket trading history
    const polymarketHistory = await fetchPolymarketHistory(address, limit / 2)
    activities.push(...polymarketHistory)

    // Fetch Hyperliquid trading history
    const hyperliquidHistory = await fetchHyperliquidHistory(address, limit / 2)
    activities.push(...hyperliquidHistory)

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return activities.slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch trading history:', error)
    return []
  }
}

async function fetchPolymarketHistory(address: string, limit: number): Promise<TradingActivity[]> {
  try {
    // In a real implementation, this would query:
    // 1. Polymarket's trade history API
    // 2. Polygon blockchain for relevant transactions
    // 3. Event logs from Polymarket contracts

    // For now, we'll attempt to get recent orders from our existing API
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/markets/polymarket/trade?address=${address}`, {
      cache: 'no-store'
    })

    if (!res.ok) return []

    const data = await res.json()
    const orders = data.orders || []

    return orders.slice(0, limit).map((order: any) => ({
      id: order.id || `poly-${Date.now()}-${Math.random()}`,
      type: 'prediction' as const,
      action: `${order.action || 'Placed'} ${order.side} position`,
      platform: 'Polymarket',
      marketId: order.marketId,
      question: order.question || 'Unknown market',
      amount: `$${order.size * order.price}`,
      side: order.side,
      price: order.price,
      shares: order.size,
      fees: order.fees,
      txHash: order.txHash,
      timestamp: order.timestamp || new Date().toISOString(),
      status: order.status === 'filled' ? 'success' as const :
              order.status === 'cancelled' ? 'failed' as const : 'pending' as const
    }))
  } catch (error) {
    console.error('Failed to fetch Polymarket history:', error)
    return []
  }
}

async function fetchHyperliquidHistory(address: string, limit: number): Promise<TradingActivity[]> {
  try {
    // Query Hyperliquid's user fills API
    const res = await fetch(`${process.env.HYPERLIQUID_INFO_URL || 'https://api.hyperliquid.xyz/info'}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: 'userFills',
        user: address
      }),
      cache: 'no-store'
    })

    if (!res.ok) return []

    const fills = await res.json()

    if (!Array.isArray(fills)) return []

    return fills.slice(0, limit).map((fill: any) => {
      const side = fill.dir === 'Open Long' || fill.dir === 'Close Short' ? 'LONG' : 'SHORT'
      const action = fill.dir.includes('Open') ? 'Opened' : 'Closed'

      return {
        id: `hyper-${fill.time}-${fill.oid}`,
        type: 'trade' as const,
        action: `${action} ${side.toLowerCase()} position on ${fill.coin}`,
        platform: 'Hyperliquid',
        symbol: `${fill.coin}-USD`,
        amount: `$${(parseFloat(fill.sz) * parseFloat(fill.px)).toFixed(2)}`,
        side,
        price: parseFloat(fill.px),
        shares: parseFloat(fill.sz),
        fees: parseFloat(fill.fee || '0'),
        txHash: fill.hash,
        timestamp: new Date(fill.time).toISOString(),
        status: 'success' as const
      }
    })
  } catch (error) {
    console.error('Failed to fetch Hyperliquid history:', error)
    return []
  }
}

// Fetch bridge transactions (placeholder for LiFi/other bridge providers)
async function fetchBridgeHistory(address: string): Promise<TradingActivity[]> {
  try {
    // This would integrate with bridge APIs or scan for bridge transactions
    // For now, return empty array
    return []
  } catch (error) {
    console.error('Failed to fetch bridge history:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const limitParam = searchParams.get('limit')
    const typeFilter = searchParams.get('type')

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 20
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    let activities = await fetchTradingHistory(address, limit)

    // Apply type filter if specified
    if (typeFilter && ['trade', 'prediction', 'bridge', 'agent'].includes(typeFilter)) {
      activities = activities.filter(activity => activity.type === typeFilter)
    }

    // Calculate summary statistics
    const summary = {
      totalActivities: activities.length,
      successfulTrades: activities.filter(a => a.status === 'success').length,
      totalVolume: activities.reduce((sum, a) => {
        const amount = parseFloat(a.amount.replace('$', '').replace(',', ''))
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0),
      platforms: [...new Set(activities.map(a => a.platform))],
      lastActivity: activities.length > 0 ? activities[0].timestamp : null
    }

    return NextResponse.json({
      success: true,
      address,
      activities,
      summary,
      pagination: {
        limit,
        returned: activities.length,
        hasMore: activities.length === limit
      },
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Trading history API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading history' },
      { status: 500 }
    )
  }
}