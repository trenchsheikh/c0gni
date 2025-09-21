'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  ExternalLink,
  Target,
  PieChart,
  ArrowRightLeft,
  Clock,
  Activity,
  ChevronRight,
  Zap,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardNavigator } from '@/lib/dashboard-navigation'

// Action button types
export interface ActionButton {
  id: string
  label: string
  description?: string
  type: 'navigate' | 'trade' | 'analyze' | 'external'
  href?: string
  data?: any
  icon?: any
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  priority?: number
  requiresAuth?: boolean
}

interface QuickActionsProps {
  actions: ActionButton[]
  onActionClick?: (action: ActionButton) => void
  maxActions?: number
  className?: string
}

export function QuickActions({
  actions,
  onActionClick,
  maxActions = 6,
  className = ''
}: QuickActionsProps) {
  const router = useRouter()

  const handleActionClick = (action: ActionButton) => {
    // Call custom handler if provided
    if (onActionClick) {
      onActionClick(action)
    }

    // Handle built-in action types
    switch (action.type) {
      case 'navigate':
        if (action.href) {
          router.push(action.href)
        }
        break
      case 'external':
        if (action.href) {
          window.open(action.href, '_blank', 'noopener,noreferrer')
        }
        break
      case 'trade':
        // Handle trade actions
        console.log('Trade action:', action.data)
        if (action.href) {
          router.push(action.href)
        }
        break
      case 'analyze':
        // Handle analyze actions
        console.log('Analyze action:', action.data)
        break
    }
  }

  const getVariantStyles = (variant: string = 'secondary') => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
      case 'danger':
        return 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
      default:
        return 'bg-white/10 text-white/80 border-white/20 hover:bg-white/15'
    }
  }

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      TrendingUp, BarChart3, DollarSign, ExternalLink, Target, PieChart,
      ArrowRightLeft, Clock, Activity, Zap, Eye, AlertTriangle
    }
    return icons[iconName] || Activity
  }

  const displayActions = actions
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, maxActions)

  if (displayActions.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-white/60 text-sm font-medium">Quick Actions</h4>
      <div className="grid gap-2">
        {displayActions.map((action, index) => {
          const Icon = action.icon || getIcon(action.type)

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleActionClick(action)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 group ${getVariantStyles(action.variant)}`}
            >
              <div className="flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{action.label}</div>
                {action.description && (
                  <div className="text-xs opacity-80 mt-0.5">
                    {action.description}
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Market-specific action generators
export class ActionGenerator {
  static polymarket(markets: any[]): ActionButton[] {
    const actions: ActionButton[] = []

    // High volume markets
    const highVolumeMarkets = markets
      .filter(m => m.volume24h > 10000)
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 3)

    highVolumeMarkets.forEach(market => {
      actions.push({
        id: `trade-poly-${market.id}`,
        label: `Trade: ${market.question.substring(0, 25)}...`,
        description: `$${market.volume24h.toLocaleString()} volume`,
        type: 'navigate',
        href: DashboardNavigator.polymarket({ market: market.id, action: 'trade' }),
        icon: DollarSign,
        variant: 'primary',
        priority: 10,
        data: market
      })
    })

    // Category exploration
    const categories = [...new Set(markets.map(m => m.category))].slice(0, 3)
    categories.forEach(category => {
      actions.push({
        id: `explore-${category.toLowerCase()}`,
        label: `Explore ${category}`,
        description: 'Browse category markets',
        type: 'navigate',
        href: DashboardNavigator.polymarket({ action: 'category' }),
        icon: TrendingUp,
        variant: 'secondary',
        priority: 5
      })
    })

    return actions
  }

  static hyperliquid(markets: any[]): ActionButton[] {
    const actions: ActionButton[] = []

    // High volatility markets
    const volatileMarkets = markets
      .filter(m => Math.abs(m.priceChangePercent24h) > 5)
      .sort((a, b) => Math.abs(b.priceChangePercent24h) - Math.abs(a.priceChangePercent24h))
      .slice(0, 3)

    volatileMarkets.forEach(market => {
      actions.push({
        id: `trade-hyper-${market.symbol}`,
        label: `Trade ${market.symbol}`,
        description: `${market.priceChangePercent24h > 0 ? '+' : ''}${market.priceChangePercent24h.toFixed(2)}% (24h)`,
        type: 'navigate',
        href: DashboardNavigator.hyperliquid({ symbol: market.symbol, action: 'trade' }),
        icon: BarChart3,
        variant: market.priceChangePercent24h > 0 ? 'success' : 'danger',
        priority: 10,
        data: market
      })
    })

    // Funding rate opportunities
    const fundingOpportunities = markets
      .filter(m => m.fundingRate && Math.abs(m.fundingRate) > 0.0001)
      .sort((a, b) => Math.abs(b.fundingRate) - Math.abs(a.fundingRate))
      .slice(0, 2)

    fundingOpportunities.forEach(market => {
      actions.push({
        id: `funding-${market.symbol}`,
        label: `${market.symbol} Funding`,
        description: `${(market.fundingRate * 100).toFixed(4)}% rate`,
        type: 'navigate',
        href: DashboardNavigator.hyperliquid({ symbol: market.symbol, action: 'funding' }),
        icon: Clock,
        variant: 'warning',
        priority: 8,
        data: market
      })
    })

    return actions
  }

  static opportunities(opportunities: any[]): ActionButton[] {
    return opportunities.slice(0, 4).map(opp => ({
      id: `opp-${opp.type}-${Math.random()}`,
      label: `${opp.type}: ${opp.market}`,
      description: opp.opportunity,
      type: 'navigate',
      href: opp.url,
      icon: Target,
      variant: 'primary',
      priority: 9,
      data: opp
    }))
  }

  static general(): ActionButton[] {
    return [
      {
        id: 'view-portfolio',
        label: 'View Portfolio',
        description: 'Check positions and P&L',
        type: 'navigate',
        href: DashboardNavigator.portfolio(),
        icon: PieChart,
        variant: 'secondary',
        priority: 6
      },
      {
        id: 'cross-chain-bridge',
        label: 'Bridge Assets',
        description: 'Transfer between chains',
        type: 'navigate',
        href: DashboardNavigator.bridge(),
        icon: ArrowRightLeft,
        variant: 'secondary',
        priority: 4
      },
      {
        id: 'market-analysis',
        label: 'Market Analysis',
        description: 'Get AI insights',
        type: 'analyze',
        icon: Eye,
        variant: 'secondary',
        priority: 3
      }
    ]
  }
}

// Context-aware action button component
interface ContextualActionsProps {
  marketData?: {
    polymarkets?: any[]
    hyperliquidMarkets?: any[]
    opportunities?: any[]
  }
  context?: string
  maxActions?: number
  className?: string
  onActionClick?: (action: ActionButton) => void
}

export function ContextualActions({
  marketData,
  context,
  maxActions = 8,
  className = '',
  onActionClick
}: ContextualActionsProps) {
  const allActions: ActionButton[] = []

  // Generate actions based on available data
  if (marketData?.polymarkets?.length) {
    allActions.push(...ActionGenerator.polymarket(marketData.polymarkets))
  }

  if (marketData?.hyperliquidMarkets?.length) {
    allActions.push(...ActionGenerator.hyperliquid(marketData.hyperliquidMarkets))
  }

  if (marketData?.opportunities?.length) {
    allActions.push(...ActionGenerator.opportunities(marketData.opportunities))
  }

  // Add general actions
  allActions.push(...ActionGenerator.general())

  // Filter based on context
  const contextualActions = context
    ? allActions.filter(action =>
        action.label.toLowerCase().includes(context.toLowerCase()) ||
        action.description?.toLowerCase().includes(context.toLowerCase())
      )
    : allActions

  return (
    <QuickActions
      actions={contextualActions}
      maxActions={maxActions}
      className={className}
      onActionClick={onActionClick}
    />
  )
}

// Floating action button for quick access
interface FloatingActionButtonProps {
  action: ActionButton
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

export function FloatingActionButton({
  action,
  position = 'bottom-right',
  className = ''
}: FloatingActionButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (action.href) {
      router.push(action.href)
    }
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const Icon = action.icon || Activity

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`fixed ${positionClasses[position]} z-50 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 ${className}`}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  )
}