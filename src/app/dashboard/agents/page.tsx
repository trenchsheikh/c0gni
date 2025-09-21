'use client'

import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface'
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  Clock,
  PieChart,
  Zap,
  Activity
} from 'lucide-react'

// Default query suggestions for the AI assistant
const defaultQueries = [
  {
    id: 'polymarket-trending',
    title: 'Trending Polymarket',
    query: 'Show me the top 5 trending Polymarket prediction markets by volume',
    description: 'Get the hottest prediction markets',
    icon: TrendingUp,
    category: 'Polymarket'
  },
  {
    id: 'hyperliquid-funding',
    title: 'Funding Opportunities',
    query: 'What are the best Hyperliquid funding rate opportunities right now?',
    description: 'Find profitable funding rates',
    icon: Clock,
    category: 'Hyperliquid'
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    query: 'Analyze current market opportunities across Polymarket and Hyperliquid',
    description: 'Cross-platform opportunity scan',
    icon: Target,
    category: 'Analysis'
  },
  {
    id: 'btc-analysis',
    title: 'Bitcoin Analysis',
    query: 'Give me a comprehensive analysis of Bitcoin across all available markets',
    description: 'BTC market overview',
    icon: BarChart3,
    category: 'Crypto'
  },
  {
    id: 'high-volume',
    title: 'High Volume Markets',
    query: 'Find high volume trading opportunities with good liquidity',
    description: 'Volume-based opportunities',
    icon: Activity,
    category: 'Trading'
  },
  {
    id: 'portfolio-insights',
    title: 'Portfolio Analysis',
    query: 'Analyze my portfolio performance and suggest optimizations',
    description: 'Personal portfolio insights',
    icon: PieChart,
    category: 'Portfolio'
  }
]

interface DefaultQueryCardProps {
  query: typeof defaultQueries[0]
  onSelect: (queryText: string) => void
  index: number
}

function DefaultQueryCard({ query, onSelect, index }: DefaultQueryCardProps) {
  const Icon = query.icon

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Polymarket': return 'border-blue-500/30 bg-blue-500/10'
      case 'Hyperliquid': return 'border-purple-500/30 bg-purple-500/10'
      case 'Analysis': return 'border-green-500/30 bg-green-500/10'
      case 'Crypto': return 'border-yellow-500/30 bg-yellow-500/10'
      case 'Trading': return 'border-orange-500/30 bg-orange-500/10'
      case 'Portfolio': return 'border-pink-500/30 bg-pink-500/10'
      default: return 'border-white/20 bg-white/5'
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(query.query)}
      className={`w-full p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:border-opacity-50 text-left group ${getCategoryColor(query.category)}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
          <Icon className="w-5 h-5 text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white group-hover:text-white transition-colors">
              {query.title}
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium text-white/60 bg-white/10 rounded-full">
              {query.category}
            </span>
          </div>
          <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
            {query.description}
          </p>
        </div>
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Zap className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </motion.button>
  )
}

export default function AgentsPage() {
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null)

  const handleQuerySelect = (queryText: string) => {
    setSelectedQuery(queryText)
    // The query will be automatically sent to the chat interface
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-light text-white mb-4">
          AI Trading Assistant
        </h1>
        <p className="text-white/60 text-lg">
          Get intelligent insights on markets, trading opportunities, and portfolio management
        </p>
      </div>

      {/* Default Query Suggestions */}
      {!selectedQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-white mb-2">
              Quick Start Queries
            </h2>
            <p className="text-white/60">
              Try these pre-built queries to explore market data and opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultQueries.map((query, index) => (
              <DefaultQueryCard
                key={query.id}
                query={query}
                onSelect={handleQuerySelect}
                index={index}
              />
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <DollarSign className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">
                Or ask anything about markets, trading, or your portfolio
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Interface */}
      <Suspense fallback={
        <div className="min-h-[600px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white/30"></div>
        </div>
      }>
        <EnhancedChatInterface
          userId="dashboard_user"
          sessionType="dashboard"
          className="min-h-[600px]"
          initialQuery={selectedQuery || undefined}
        />
      </Suspense>
    </div>
  )
}