export interface PortfolioPosition {
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

export interface PortfolioSummary {
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

export interface TradingActivity {
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

export interface WalletBalance {
  chainId: number
  chainName: string
  native: {
    symbol: string
    balance: string
    raw: string
  }
  tokens: TokenBalance[]
  totalUsdValue?: number
}

export interface TokenBalance {
  symbol: string
  balance: string
  address: string
  decimals: number
  raw: string
}