'use client'

import { Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface'
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  Clock,
  PieChart,
  Zap,
  Activity,
  Sparkles
} from 'lucide-react'
import { Card } from '@/components/dashboard/Card'

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
      default: return 'border-white/5 bg-white/5'
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
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white group-hover:text-white transition-colors">
              {query.title}
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium text-zinc-400 bg-white/5 rounded-full">
              {query.category}
            </span>
          </div>
          <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
            {query.description}
          </p>
        </div>
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Zap className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </motion.button>
  )
}

export default function AgentsPage() {
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null)
  const [hasStartedChat, setHasStartedChat] = useState(false)

  const handleQuerySelect = (queryText: string) => {
    setSelectedQuery(queryText)
    setHasStartedChat(true)
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0A0A0A] overflow-hidden" style={{ marginLeft: 0 }}>
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl z-20">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-light text-white tracking-tight">AI Trading Assistant</h1>
                <p className="text-xs text-zinc-400 font-light">Intelligent market insights and analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full height chat */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!hasStartedChat ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center justify-center p-8 overflow-y-auto"
            >
              <div className="max-w-4xl w-full space-y-8">
                {/* Welcome Section */}
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-light text-white tracking-tight"
                  >
                    How can I help you today?
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-zinc-400 font-light"
                  >
                    Ask about markets, trading opportunities, or portfolio analysis
                  </motion.p>
                </div>

                {/* Quick Start Queries */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
                    Quick Start
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {defaultQueries.map((query, index) => (
                      <DefaultQueryCard
                        key={query.id}
                        query={query}
                        onSelect={handleQuerySelect}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <Suspense fallback={
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30"></div>
                </div>
              }>
                <EnhancedChatInterface
                  userId="dashboard_user"
                  sessionType="dashboard"
                  className="flex-1 h-full"
                  initialQuery={selectedQuery || undefined}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
