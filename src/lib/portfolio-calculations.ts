import { PortfolioPosition } from '@/types/portfolio'

export interface PortfolioMetrics {
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  dayChange: number
  dayChangePercent: number
  winRate: number
  sharpeRatio: number
  maxDrawdown: number
  totalTrades: number
  avgHoldTime: number
  bestTrade: number
  worstTrade: number
  volatility: number
}

export interface PlatformBreakdown {
  polymarket: {
    positions: number
    value: number
    pnl: number
    winRate: number
    avgReturn: number
  }
  hyperliquid: {
    positions: number
    value: number
    pnl: number
    avgLeverage: number
    marginUsed: number
  }
}

export function calculatePortfolioMetrics(
  positions: PortfolioPosition[],
  historicalData?: any[]
): PortfolioMetrics {
  if (positions.length === 0) {
    return {
      totalValue: 0,
      totalPnL: 0,
      totalPnLPercent: 0,
      dayChange: 0,
      dayChangePercent: 0,
      winRate: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      totalTrades: 0,
      avgHoldTime: 0,
      bestTrade: 0,
      worstTrade: 0,
      volatility: 0
    }
  }

  // Basic portfolio calculations
  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0)
  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)
  const totalCost = totalValue - totalPnL
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0

  // Win rate calculation
  const profitablePositions = positions.filter(pos => pos.unrealizedPnl > 0)
  const winRate = positions.length > 0 ? (profitablePositions.length / positions.length) * 100 : 0

  // Day change estimation (simplified - would need historical data for accuracy)
  const dayChange = totalPnL * 0.1 // Assume 10% of total PnL is from today
  const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0

  // Advanced metrics (simplified calculations)
  const returns = positions.map(pos => pos.unrealizedPnlPercent / 100)
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0

  // Volatility (standard deviation of returns)
  const variance = returns.length > 0
    ? returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    : 0
  const volatility = Math.sqrt(variance) * 100

  // Sharpe ratio (simplified - assumes risk-free rate of 2%)
  const riskFreeRate = 0.02
  const sharpeRatio = volatility > 0 ? (avgReturn - riskFreeRate) / (volatility / 100) : 0

  // Max drawdown estimation
  const sortedReturns = returns.sort((a, b) => a - b)
  const maxDrawdown = sortedReturns.length > 0 ? Math.abs(sortedReturns[0]) * 100 : 0

  // Best and worst trades
  const bestTrade = positions.length > 0
    ? Math.max(...positions.map(pos => pos.unrealizedPnl))
    : 0
  const worstTrade = positions.length > 0
    ? Math.min(...positions.map(pos => pos.unrealizedPnl))
    : 0

  return {
    totalValue,
    totalPnL,
    totalPnLPercent,
    dayChange,
    dayChangePercent,
    winRate,
    sharpeRatio,
    maxDrawdown,
    totalTrades: positions.length,
    avgHoldTime: 0, // Would need historical data
    bestTrade,
    worstTrade,
    volatility
  }
}

export function calculatePlatformBreakdown(positions: PortfolioPosition[]): PlatformBreakdown {
  const polymarketPositions = positions.filter(pos => pos.platform === 'polymarket')
  const hyperliquidPositions = positions.filter(pos => pos.platform === 'hyperliquid')

  // Polymarket calculations
  const polymarketValue = polymarketPositions.reduce((sum, pos) => sum + pos.marketValue, 0)
  const polymarketPnL = polymarketPositions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)
  const polymarketWinning = polymarketPositions.filter(pos => pos.unrealizedPnl > 0).length
  const polymarketWinRate = polymarketPositions.length > 0
    ? (polymarketWinning / polymarketPositions.length) * 100
    : 0
  const polymarketAvgReturn = polymarketPositions.length > 0
    ? polymarketPositions.reduce((sum, pos) => sum + pos.unrealizedPnlPercent, 0) / polymarketPositions.length
    : 0

  // Hyperliquid calculations
  const hyperliquidValue = hyperliquidPositions.reduce((sum, pos) => sum + pos.marketValue, 0)
  const hyperliquidPnL = hyperliquidPositions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)

  // Estimate leverage and margin (simplified)
  const avgLeverage = hyperliquidPositions.length > 0
    ? hyperliquidPositions.reduce((sum, pos) => {
        // Estimate leverage based on position size vs value
        const estimatedLeverage = pos.marketValue > 0 ? pos.size / (pos.marketValue / pos.currentPrice) : 1
        return sum + Math.min(estimatedLeverage, 50) // Cap at 50x
      }, 0) / hyperliquidPositions.length
    : 0

  const marginUsed = hyperliquidPositions.reduce((sum, pos) => {
    // Estimate margin as position value / leverage
    const estimatedLeverage = Math.max(avgLeverage, 1)
    return sum + (pos.marketValue / estimatedLeverage)
  }, 0)

  return {
    polymarket: {
      positions: polymarketPositions.length,
      value: polymarketValue,
      pnl: polymarketPnL,
      winRate: polymarketWinRate,
      avgReturn: polymarketAvgReturn
    },
    hyperliquid: {
      positions: hyperliquidPositions.length,
      value: hyperliquidValue,
      pnl: hyperliquidPnL,
      avgLeverage,
      marginUsed
    }
  }
}

export function calculateRiskMetrics(positions: PortfolioPosition[]) {
  if (positions.length === 0) {
    return {
      portfolioRisk: 'Low',
      concentrationRisk: 'Low',
      leverageRisk: 'Low',
      recommendations: []
    }
  }

  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0)
  const recommendations: string[] = []

  // Concentration risk - check if any single position is >20% of portfolio
  const largestPosition = Math.max(...positions.map(pos => pos.marketValue))
  const concentrationRatio = totalValue > 0 ? (largestPosition / totalValue) * 100 : 0

  let concentrationRisk = 'Low'
  if (concentrationRatio > 40) {
    concentrationRisk = 'High'
    recommendations.push('Consider reducing concentration in largest position')
  } else if (concentrationRatio > 20) {
    concentrationRisk = 'Medium'
    recommendations.push('Monitor concentration in largest positions')
  }

  // Leverage risk - check Hyperliquid positions
  const hyperliquidPositions = positions.filter(pos => pos.platform === 'hyperliquid')
  const hasHighLeverage = hyperliquidPositions.some(pos => {
    const estimatedLeverage = pos.marketValue > 0 ? pos.size * pos.currentPrice / pos.marketValue : 1
    return estimatedLeverage > 10
  })

  let leverageRisk = 'Low'
  if (hasHighLeverage) {
    leverageRisk = 'High'
    recommendations.push('High leverage detected - monitor liquidation risk')
  } else if (hyperliquidPositions.length > 0) {
    leverageRisk = 'Medium'
  }

  // Overall portfolio risk
  const totalPnLPercent = positions.reduce((sum, pos) => sum + Math.abs(pos.unrealizedPnlPercent), 0) / positions.length
  let portfolioRisk = 'Low'

  if (totalPnLPercent > 50 || concentrationRisk === 'High' || leverageRisk === 'High') {
    portfolioRisk = 'High'
  } else if (totalPnLPercent > 20 || concentrationRisk === 'Medium' || leverageRisk === 'Medium') {
    portfolioRisk = 'Medium'
  }

  if (positions.length < 3) {
    recommendations.push('Consider diversifying across more positions')
  }

  return {
    portfolioRisk,
    concentrationRisk,
    leverageRisk,
    concentrationRatio,
    recommendations
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return formatCurrency(value)
}