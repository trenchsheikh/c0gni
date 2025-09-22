import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// Deep linking utilities for dashboard navigation
export interface NavigationContext {
  market?: string
  symbol?: string
  action?: 'trade' | 'analyze' | 'view'
  data?: Record<string, any>
}

// Generate deep links to dashboard pages
export class DashboardNavigator {
  static polymarket(params: { market?: string, action?: string }): string {
    if (params.market) {
      return `/dashboard/polymarket/${params.market}`
    }
    const url = new URL('/dashboard/polymarket', window.location.origin)
    if (params.action) url.searchParams.set('action', params.action)
    return url.pathname + url.search
  }

  static hyperliquid(params: { symbol?: string, action?: string }): string {
    if (params.symbol) {
      return `/dashboard/hyperliquid/${encodeURIComponent(params.symbol)}`
    }
    const url = new URL('/dashboard/hyperliquid', window.location.origin)
    if (params.action) url.searchParams.set('action', params.action)
    return url.pathname + url.search
  }

  static portfolio(params: { position?: string, action?: string } = {}): string {
    const url = new URL('/dashboard/portfolio', window.location.origin)
    if (params.position) url.searchParams.set('position', params.position)
    if (params.action) url.searchParams.set('action', params.action)
    return url.pathname + url.search
  }

  static bridge(params: { from?: string, to?: string, amount?: string } = {}): string {
    const url = new URL('/dashboard/bridge', window.location.origin)
    if (params.from) url.searchParams.set('from', params.from)
    if (params.to) url.searchParams.set('to', params.to)
    if (params.amount) url.searchParams.set('amount', params.amount)
    return url.pathname + url.search
  }

  static agents(params: { query?: string, context?: string } = {}): string {
    const url = new URL('/dashboard/agents', window.location.origin)
    if (params.query) url.searchParams.set('query', params.query)
    if (params.context) url.searchParams.set('context', params.context)
    return url.pathname + url.search
  }
}

// Hook to handle navigation context from URL parameters
export function useNavigationContext(): NavigationContext {
  const searchParams = useSearchParams()

  return {
    market: searchParams.get('market') || undefined,
    symbol: searchParams.get('symbol') || undefined,
    action: (searchParams.get('action') as any) || undefined,
    data: {
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      amount: searchParams.get('amount') || undefined,
      position: searchParams.get('position') || undefined,
      query: searchParams.get('query') || undefined,
      context: searchParams.get('context') || undefined
    }
  }
}

// Hook to handle automatic actions based on URL parameters
export function useAutoNavigation(
  onMarketSelect?: (marketId: string) => void,
  onSymbolSelect?: (symbol: string) => void,
  onAction?: (action: string, data: any) => void
) {
  const context = useNavigationContext()
  const router = useRouter()

  useEffect(() => {
    if (context.market && onMarketSelect) {
      onMarketSelect(context.market)
    }
  }, [context.market, onMarketSelect])

  useEffect(() => {
    if (context.symbol && onSymbolSelect) {
      onSymbolSelect(context.symbol)
    }
  }, [context.symbol, onSymbolSelect])

  useEffect(() => {
    if (context.action && onAction) {
      onAction(context.action, context.data)
    }
  }, [context.action, context.data, onAction])

  // Function to clear navigation parameters
  const clearParams = () => {
    router.replace(window.location.pathname, { scroll: false })
  }

  return { context, clearParams }
}

// Generate contextual navigation suggestions
export function generateNavigationSuggestions(content: string): Array<{
  label: string
  href: string
  description: string
  icon?: string
}> {
  const suggestions: Array<{
    label: string
    href: string
    description: string
    icon?: string
  }> = []

  const contentLower = content.toLowerCase()

  // Polymarket suggestions
  if (contentLower.includes('polymarket') || contentLower.includes('prediction') || contentLower.includes('betting')) {
    suggestions.push({
      label: 'Explore Polymarket',
      href: DashboardNavigator.polymarket({}),
      description: 'Browse active prediction markets',
      icon: 'TrendingUp'
    })
  }

  // Hyperliquid suggestions
  if (contentLower.includes('hyperliquid') || contentLower.includes('perpetual') || contentLower.includes('funding')) {
    suggestions.push({
      label: 'Open Hyperliquid Terminal',
      href: DashboardNavigator.hyperliquid({}),
      description: 'Trade perpetual contracts',
      icon: 'BarChart3'
    })
  }

  // Portfolio suggestions
  if (contentLower.includes('portfolio') || contentLower.includes('position') || contentLower.includes('pnl') || contentLower.includes('profit')) {
    suggestions.push({
      label: 'View Portfolio',
      href: DashboardNavigator.portfolio(),
      description: 'Check your positions and P&L',
      icon: 'PieChart'
    })
  }

  // Bridge suggestions
  if (contentLower.includes('bridge') || contentLower.includes('cross-chain') || contentLower.includes('ethereum') || contentLower.includes('polygon')) {
    suggestions.push({
      label: 'Cross-Chain Bridge',
      href: DashboardNavigator.bridge(),
      description: 'Transfer assets between chains',
      icon: 'ArrowRightLeft'
    })
  }

  // Specific symbol suggestions
  const symbolMatches = content.match(/\b([A-Z]{2,5}[-\/][A-Z]{2,5})\b/g) || []
  symbolMatches.forEach(symbol => {
    const cleanSymbol = symbol.replace('/', '-')
    suggestions.push({
      label: `Trade ${cleanSymbol}`,
      href: DashboardNavigator.hyperliquid({ symbol: cleanSymbol }),
      description: `Open ${cleanSymbol} trading interface`,
      icon: 'DollarSign'
    })
  })

  return suggestions.slice(0, 4) // Limit to 4 suggestions
}

// Extract market IDs from content
export function extractMarketReferences(content: string): {
  polymarketIds: string[]
  hyperliquidSymbols: string[]
  opportunities: Array<{ type: string, data: any }>
} {
  const polymarketIds: string[] = []
  const hyperliquidSymbols: string[] = []
  const opportunities: Array<{ type: string, data: any }> = []

  // Extract JSON blocks that might contain market data
  const jsonRegex = /```json\n([\s\S]*?)\n```/g
  let match

  while ((match = jsonRegex.exec(content)) !== null) {
    try {
      const data = JSON.parse(match[1])

      // Extract Polymarket IDs
      if (data.markets) {
        data.markets.forEach((market: any) => {
          if (market.id && market.question) {
            polymarketIds.push(market.id)
          }
          if (market.symbol && (market.marketType || market.baseAsset)) {
            hyperliquidSymbols.push(market.symbol)
          }
        })
      }

      // Extract opportunities
      if (data.opportunities) {
        opportunities.push(...data.opportunities.map((opp: any) => ({
          type: 'opportunity',
          data: opp
        })))
      }
    } catch (error) {
      // Ignore invalid JSON
    }
  }

  // Also extract from regular text patterns
  const symbolPattern = /\b([A-Z]{2,5}[-\/]USD|BTC[-\/]USD|ETH[-\/]USD)\b/g
  const symbols = (content.match(symbolPattern) || []).map(s => s.replace('/', '-'))
  hyperliquidSymbols.push(...symbols)

  return {
    polymarketIds: [...new Set(polymarketIds)],
    hyperliquidSymbols: [...new Set(hyperliquidSymbols)],
    opportunities
  }
}

// Create quick action buttons based on content analysis
export function generateQuickActions(content: string): Array<{
  label: string
  action: string
  href?: string
  data?: any
  icon?: string
  priority: number
}> {
  const actions: Array<{
    label: string
    action: string
    href?: string
    data?: any
    icon?: string
    priority: number
  }> = []

  const { polymarketIds, hyperliquidSymbols, opportunities } = extractMarketReferences(content)

  // High priority actions based on specific market data
  polymarketIds.forEach(id => {
    actions.push({
      label: 'Trade This Market',
      action: 'navigate',
      href: DashboardNavigator.polymarket({ market: id, action: 'trade' }),
      data: { marketId: id },
      icon: 'DollarSign',
      priority: 10
    })
  })

  hyperliquidSymbols.forEach(symbol => {
    actions.push({
      label: `Trade ${symbol}`,
      action: 'navigate',
      href: DashboardNavigator.hyperliquid({ symbol, action: 'trade' }),
      data: { symbol },
      icon: 'TrendingUp',
      priority: 10
    })
  })

  // Medium priority actions for opportunities
  opportunities.forEach(opp => {
    if (opp.data.url) {
      actions.push({
        label: 'View Opportunity',
        action: 'navigate',
        href: opp.data.url,
        data: opp.data,
        icon: 'Target',
        priority: 8
      })
    }
  })

  // Lower priority general actions
  const contentLower = content.toLowerCase()

  if (contentLower.includes('funding')) {
    actions.push({
      label: 'Check Funding Rates',
      action: 'navigate',
      href: DashboardNavigator.hyperliquid({ action: 'funding' }),
      icon: 'Clock',
      priority: 6
    })
  }

  if (contentLower.includes('portfolio') || contentLower.includes('position')) {
    actions.push({
      label: 'View Portfolio',
      action: 'navigate',
      href: DashboardNavigator.portfolio(),
      icon: 'PieChart',
      priority: 7
    })
  }

  // Sort by priority and limit results
  return actions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6)
}
