import { NextRequest } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Position {
  marketId: string
  question: string
  side: 'YES' | 'NO'
  shares: number
  avgPrice: number
  currentPrice: number
  unrealizedPnl: number
  marketValue: number
  totalInvested: number
}

// Simulate getting current market prices for positions
const getCurrentMarketPrices = async (marketIds: string[]) => {
  // In production, this would fetch real prices from Polymarket API
  const prices: Record<string, { yes: number; no: number }> = {}

  for (const marketId of marketIds) {
    // Simulate market prices with some randomness
    const yesPrice = 0.3 + Math.random() * 0.4 // 0.3 to 0.7
    prices[marketId] = {
      yes: yesPrice,
      no: 1 - yesPrice
    }
  }

  return prices
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateUser(req)
    if (!authUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findFirst({
      where: { id: authUser.userId }
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all filled orders for the user
    const orders = await prisma.polymarketOrder.findMany({
      where: {
        userId: user.id,
        status: { in: ['filled', 'partially_filled'] }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group orders by market and side to calculate positions
    const positionMap = new Map<string, {
      marketId: string
      side: 'YES' | 'NO'
      totalShares: number
      totalCost: number
      orders: typeof orders
    }>()

    for (const order of orders) {
      const key = `${order.marketId}-${order.side}`
      const existing = positionMap.get(key)

      const sharesDelta = order.action === 'buy' ? order.filledSize : -order.filledSize
      const costDelta = order.action === 'buy'
        ? order.filledSize * (order.avgFillPrice || order.price)
        : -(order.filledSize * (order.avgFillPrice || order.price))

      if (existing) {
        existing.totalShares += sharesDelta
        existing.totalCost += costDelta
        existing.orders.push(order)
      } else {
        positionMap.set(key, {
          marketId: order.marketId,
          side: order.side as 'YES' | 'NO',
          totalShares: sharesDelta,
          totalCost: costDelta,
          orders: [order]
        })
      }
    }

    // Filter out positions with zero or negative shares
    const activePositions = Array.from(positionMap.values()).filter(p => p.totalShares > 0)

    if (activePositions.length === 0) {
      return Response.json({ positions: [] })
    }

    // Get current market prices
    const marketIds = [...new Set(activePositions.map(p => p.marketId))]
    const currentPrices = await getCurrentMarketPrices(marketIds)

    // Get market information for display
    const marketQuestions = new Map<string, string>()
    try {
      // Try to fetch market data for questions
      const marketsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/markets/polymarket`)
      if (marketsRes.ok) {
        const { markets } = await marketsRes.json()
        for (const market of markets) {
          marketQuestions.set(market.id, market.question)
        }
      }
    } catch (e) {
      // If market fetch fails, use market ID as question
      console.warn('Failed to fetch market questions:', e)
    }

    // Calculate position details
    const positions: Position[] = activePositions.map(pos => {
      const avgPrice = pos.totalShares > 0 ? pos.totalCost / pos.totalShares : 0
      const currentPrice = currentPrices[pos.marketId]?.[pos.side.toLowerCase() as 'yes' | 'no'] || avgPrice
      const marketValue = pos.totalShares * currentPrice
      const unrealizedPnl = marketValue - pos.totalCost

      return {
        marketId: pos.marketId,
        question: marketQuestions.get(pos.marketId) || `Market ${pos.marketId}`,
        side: pos.side,
        shares: pos.totalShares,
        avgPrice,
        currentPrice,
        unrealizedPnl,
        marketValue,
        totalInvested: pos.totalCost
      }
    })

    // Sort by market value descending
    positions.sort((a, b) => b.marketValue - a.marketValue)

    // Calculate portfolio summary
    const summary = {
      totalValue: positions.reduce((sum, pos) => sum + pos.marketValue, 0),
      totalInvested: positions.reduce((sum, pos) => sum + pos.totalInvested, 0),
      totalUnrealizedPnl: positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0),
      positionCount: positions.length,
      topPerformer: positions.length > 0 ? positions.reduce((best, pos) =>
        pos.unrealizedPnl > best.unrealizedPnl ? pos : best
      ) : null,
      bottomPerformer: positions.length > 0 ? positions.reduce((worst, pos) =>
        pos.unrealizedPnl < worst.unrealizedPnl ? pos : worst
      ) : null
    }

    return Response.json({
      positions,
      summary
    })

  } catch (error: any) {
    console.error('Get positions error:', error)
    return Response.json({
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}