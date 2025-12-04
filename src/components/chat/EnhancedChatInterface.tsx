'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Zap,
  Database,
  Sparkles,
  CheckCircle,
  Loader2,
  MessageSquare,
  TrendingUp,
  BarChart3,
  DollarSign,
  Activity,
  ExternalLink,
  ArrowRight,
  Target,
  PieChart,
  AlertTriangle,
  ChevronRight,
  Clock,
  TrendingDown
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MarketChart, MarketOverview, Sparkline } from '@/components/charts/MarketChart'
import { QuickActions, ContextualActions, ActionGenerator } from '@/components/actions/QuickActions'

// Enhanced interfaces for dashboard integration
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  messageType?: 'text' | 'market_data' | 'analysis' | 'action'
  marketData?: MarketDataDisplay[]
  actionButtons?: ActionButton[]
  confidence?: number
  processingTime?: number
}

interface MarketDataDisplay {
  platform: 'polymarket' | 'hyperliquid'
  type: 'market' | 'opportunity' | 'analysis'
  title: string
  subtitle?: string
  data: {
    symbol?: string
    question?: string
    price?: number
    change?: number
    volume?: number
    confidence?: number
    trend?: string
    url?: string
  }
  quickActions?: ActionButton[]
}

interface ActionButton {
  label: string
  type: 'link' | 'trade' | 'analyze' | 'navigate'
  href?: string
  data?: any
  icon?: any
}

interface EnhancedChatInterfaceProps {
  userId?: string
  sessionType?: 'dashboard' | 'trading' | 'analysis'
  className?: string
  initialQuery?: string
}

export function EnhancedChatInterface({
  userId,
  sessionType = 'dashboard',
  className = '',
  initialQuery
}: EnhancedChatInterfaceProps) {
  const router = useRouter()

  // Enhanced state management
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Streaming states
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [thinkingContent, setThinkingContent] = useState('')
  const [showThinking, setShowThinking] = useState(false)
  const [activeTools, setActiveTools] = useState<Record<string, string>>({})
  const [memoryAccess, setMemoryAccess] = useState<string[]>([])

  // UI enhancements
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const streamingMessageRef = useRef('')
  const messageAddedRef = useRef(false)

  // Utility functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage, thinkingContent, scrollToBottom])

  // Handle initial query
  useEffect(() => {
    if (initialQuery && !isLoading && messages.length === 0 && input !== initialQuery) {
      setInput(initialQuery)
      // Auto-send the initial query after a short delay
      const timer = setTimeout(async () => {
        if (!isLoading) {
          setInput(initialQuery)
          // Manually trigger send with the initial query
          const messageContent = initialQuery.trim()
          setInput('')
          setIsLoading(true)
          setIsStreaming(true)
          setStreamingMessage('')
          streamingMessageRef.current = ''
          messageAddedRef.current = false
          setThinkingContent('')
          setShowThinking(false)
          setActiveTools({})
          setMemoryAccess([])

          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: messageContent,
                sessionId: currentSessionId,
                userId: userId || 'dashboard_user',
                deepResearchMode: true,
                sessionOptions: {
                  sessionType,
                  contextWindow: 20,
                  autoSummarize: true,
                  title: 'Dashboard AI Assistant'
                }
              })
            })

            if (response.ok && response.body) {
              const reader = response.body.getReader()
              const decoder = new TextDecoder()
              let buffer = ''

              while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const jsonStr = line.slice(6)
                      const data = JSON.parse(jsonStr)
                      await handleEnhancedStreamEvent(data)
                    } catch (error) {
                      console.error('Parse error:', error)
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error('Initial query error:', error)
          } finally {
            setIsLoading(false)
            setIsStreaming(false)
            setShowThinking(false)
            setThinkingContent('')
          }
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [initialQuery, isLoading, messages.length, input])

  // Enhanced send message with dashboard context
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const messageContent = input.trim()
    setInput('')
    setIsLoading(true)
    setIsStreaming(true)
    setStreamingMessage('')
    streamingMessageRef.current = ''
    messageAddedRef.current = false
    setThinkingContent('')
    setShowThinking(false)
    setActiveTools({})
    setMemoryAccess([])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          sessionId: currentSessionId,
          userId: userId || 'dashboard_user',
          deepResearchMode: true, // Enable for market analysis
          sessionOptions: {
            sessionType,
            contextWindow: 20,
            autoSummarize: true,
            title: 'Dashboard AI Assistant'
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6)
              const data = JSON.parse(jsonStr)
              await handleEnhancedStreamEvent(data)
            } catch (error) {
              console.error('Parse error:', error, 'Line was:', line)
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        messageType: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setShowThinking(false)
      setThinkingContent('')
    }
  }

  // Enhanced stream event handler with market data parsing
  const handleEnhancedStreamEvent = async (event: any) => {
    console.log('Received enhanced stream event:', event.type, event.data)

    switch (event.type) {
      case 'session_info':
        if (event.data.sessionId) {
          setCurrentSessionId(event.data.sessionId)
        }
        break

      case 'thinking_stream':
        setShowThinking(true)
        setThinkingContent(event.data.content || '')
        break

      case 'memory_access':
        setMemoryAccess(prev => [...prev, event.data.content || ''])
        break

      case 'tool_call':
        if (event.data.tool) {
          setActiveTools(prev => ({
            ...prev,
            [event.data.tool]: 'running'
          }))
        }
        break

      case 'tool_result':
        if (event.data.metadata?.tool) {
          setActiveTools(prev => ({
            ...prev,
            [event.data.metadata.tool]: 'completed'
          }))
        }
        break

      case 'content':
        setStreamingMessage(prev => {
          const newContent = prev + (event.data.content || '')
          streamingMessageRef.current = newContent
          return newContent
        })
        break

      case 'complete':
        if (messageAddedRef.current) return
        messageAddedRef.current = true

        setTimeout(async () => {
          const finalContent = streamingMessageRef.current

          if (finalContent.trim()) {
            // Parse for market data and action buttons
            const { parsedContent, marketData, actionButtons } = await parseMarketDataFromContent(finalContent)

            const assistantMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: parsedContent,
              timestamp: new Date(),
              messageType: marketData.length > 0 ? 'market_data' : 'text',
              marketData: marketData.length > 0 ? marketData : undefined,
              actionButtons: actionButtons.length > 0 ? actionButtons : undefined,
              confidence: event.data.confidence,
              processingTime: event.data.processingTime
            }

            setMessages(prev => {
              const userMessage: Message = {
                id: (Date.now() - 1).toString(),
                role: 'user',
                content: prev[prev.length - 1]?.content || '',
                timestamp: new Date(Date.now() - (event.data.processingTime || 1000)),
                messageType: 'text'
              }
              return [...prev, userMessage, assistantMessage]
            })
          }

          setStreamingMessage('')
          streamingMessageRef.current = ''
        }, 10)
        break

      case 'error':
        console.error('Enhanced stream error:', event.data)
        break
    }
  }

  // Parse market data from AI response content
  const parseMarketDataFromContent = async (content: string): Promise<{
    parsedContent: string,
    marketData: MarketDataDisplay[],
    actionButtons: ActionButton[]
  }> => {
    const marketData: MarketDataDisplay[] = []
    const actionButtons: ActionButton[] = []
    let parsedContent = content

    // Look for JSON data blocks in the content
    const jsonRegex = /```json\n([\s\S]*?)\n```/g
    let match

    while ((match = jsonRegex.exec(content)) !== null) {
      try {
        const jsonData = JSON.parse(match[1])

        // Check if it's market data
        if (jsonData.markets && Array.isArray(jsonData.markets)) {
          // Polymarket or Hyperliquid market data
          jsonData.markets.slice(0, 3).forEach((market: any) => {
            if (market.question) {
              // Polymarket market
              marketData.push({
                platform: 'polymarket',
                type: 'market',
                title: market.question,
                subtitle: market.category,
                data: {
                  question: market.question,
                  price: market.yesPrice,
                  volume: market.volume24h,
                  confidence: market.impliedOdds,
                  url: market.dashboardUrl || `/dashboard/polymarket/${market.id}`
                },
                quickActions: [
                  {
                    label: 'Trade',
                    type: 'navigate',
                    href: market.dashboardUrl || `/dashboard/polymarket/${market.id}`,
                    icon: DollarSign
                  },
                  {
                    label: 'Analyze',
                    type: 'analyze',
                    data: market,
                    icon: BarChart3
                  }
                ]
              })
            } else if (market.symbol) {
              // Hyperliquid market
              marketData.push({
                platform: 'hyperliquid',
                type: 'market',
                title: market.symbol,
                subtitle: market.marketType?.toUpperCase(),
                data: {
                  symbol: market.symbol,
                  price: market.markPrice,
                  change: market.priceChangePercent24h,
                  volume: market.volume24h,
                  trend: market.priceChangePercent24h > 0 ? 'up' : 'down',
                  url: market.dashboardUrl || `/dashboard/hyperliquid/${encodeURIComponent(market.symbol)}`
                },
                quickActions: [
                  {
                    label: 'Trade',
                    type: 'navigate',
                    href: market.dashboardUrl || `/dashboard/hyperliquid/${encodeURIComponent(market.symbol)}`,
                    icon: TrendingUp
                  }
                ]
              })
            }
          })
        }

        // Check for opportunities
        if (jsonData.opportunities && Array.isArray(jsonData.opportunities)) {
          jsonData.opportunities.slice(0, 3).forEach((opp: any) => {
            marketData.push({
              platform: opp.platform?.toLowerCase() === 'polymarket' ? 'polymarket' : 'hyperliquid',
              type: 'opportunity',
              title: opp.market,
              subtitle: opp.type,
              data: {
                trend: opp.trend || opp.fundingRate || opp.opportunity,
                url: opp.url
              },
              quickActions: [
                {
                  label: 'View',
                  type: 'navigate',
                  href: opp.url,
                  icon: ExternalLink
                }
              ]
            })
          })
        }

        // Remove the JSON block from content
        parsedContent = parsedContent.replace(match[0], '')
      } catch (error) {
        console.error('Failed to parse JSON data:', error)
      }
    }

    // Generate contextual action buttons using ActionGenerator
    const contextualActions = ActionGenerator.general()

    // Add specific actions based on content
    if (content.toLowerCase().includes('polymarket')) {
      contextualActions.unshift({
        id: 'open-polymarket',
        label: 'Open Polymarket',
        type: 'navigate',
        href: '/dashboard/polymarket',
        icon: TrendingUp,
        variant: 'primary',
        priority: 10
      })
    }

    if (content.toLowerCase().includes('hyperliquid')) {
      contextualActions.unshift({
        id: 'open-hyperliquid',
        label: 'Open Hyperliquid',
        type: 'navigate',
        href: '/dashboard/hyperliquid',
        icon: BarChart3,
        variant: 'primary',
        priority: 10
      })
    }

    if (content.toLowerCase().includes('portfolio') || content.toLowerCase().includes('positions')) {
      contextualActions.unshift({
        id: 'view-portfolio',
        label: 'View Portfolio',
        type: 'navigate',
        href: '/dashboard/portfolio',
        icon: PieChart,
        variant: 'primary',
        priority: 10
      })
    }

    // Convert to legacy format for compatibility
    actionButtons.push(...contextualActions.slice(0, 3).map(action => ({
      label: action.label,
      type: action.type,
      href: action.href,
      data: action.data,
      icon: action.icon
    })))

    return { parsedContent: parsedContent.trim(), marketData, actionButtons }
  }

  // Handle action button clicks
  const handleActionClick = (action: ActionButton) => {
    switch (action.type) {
      case 'navigate':
      case 'link':
        if (action.href) {
          router.push(action.href)
        }
        break
      case 'trade':
        // Handle trade action
        console.log('Trade action:', action.data)
        break
      case 'analyze':
        // Handle analyze action
        console.log('Analyze action:', action.data)
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Container - ChatGPT style */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && !isStreaming && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-zinc-400 font-light">Start a conversation to begin</p>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {messages.map((message, index) => (
              <EnhancedMessageBubble
                key={message.id}
                message={message}
                index={index}
                onActionClick={handleActionClick}
              />
            ))}

            {/* Streaming message */}
            {isStreaming && (
              <StreamingMessageBubble
                content={streamingMessage}
                thinkingContent={thinkingContent}
                showThinking={showThinking}
                activeTools={activeTools}
                memoryAccess={memoryAccess}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom, ChatGPT style */}
      <div className="flex-shrink-0 border-t border-white/5 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="relative">
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl shadow-lg">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AI Assistant..."
                className="w-full bg-transparent
                           px-4 py-3 pr-12
                           text-white placeholder-zinc-500
                           focus:outline-none
                           resize-none min-h-[52px] max-h-[200px]
                           text-sm"
                disabled={isLoading}
                rows={1}
              />
              
              {/* Send button */}
              <div className="absolute right-2 bottom-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center
                             hover:bg-zinc-200 disabled:bg-white/10 disabled:text-zinc-500
                             transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Footer info */}
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Market Analysis
              </span>
              <span>•</span>
              <span>Real-time Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced message bubble component
function EnhancedMessageBubble({
  message,
  index,
  onActionClick
}: {
  message: Message;
  index: number;
  onActionClick: (action: ActionButton) => void;
}) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05
      }}
      className={`flex gap-4 group ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 mt-1">
          <Image src="/c0gni-c-white.svg" alt="c0gni" width={16} height={16} className="w-4 h-4" />
        </div>
      )}

      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`max-w-[85%] ${isUser ? 'ml-auto' : ''}`}>
          {isUser ? (
            <div className="bg-zinc-800/50 rounded-2xl px-4 py-3">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="prose prose-invert prose-sm max-w-none
                              prose-headings:text-white prose-headings:font-medium
                              prose-p:text-zinc-300 prose-p:leading-relaxed
                              prose-strong:text-white
                              prose-code:text-zinc-300 prose-code:bg-zinc-800/50
                              prose-code:px-1.5 prose-code:py-0.5
                              prose-code:rounded prose-code:text-xs
                              prose-pre:bg-zinc-900/50 prose-pre:border
                              prose-pre:border-white/5 prose-pre:rounded-lg
                              prose-ul:text-zinc-300 prose-ol:text-zinc-300
                              prose-li:text-zinc-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Market Data Display */}
          {message.marketData && message.marketData.length > 0 && (
            <div className="mt-4 space-y-3">
              {message.marketData.map((data, idx) => (
                <MarketDataCard
                  key={idx}
                  data={data}
                  onActionClick={onActionClick}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {message.actionButtons && message.actionButtons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.actionButtons.map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onActionClick(action)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 hover:text-white transition-all duration-200"
                >
                  {action.icon && <action.icon className="w-3.5 h-3.5" />}
                  {action.label}
                  <ChevronRight className="w-3 h-3" />
                </motion.button>
              ))}
            </div>
          )}

          {/* Metadata - only show on hover for cleaner look */}
          <div className="mt-2 text-xs text-zinc-500 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {message.confidence && (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {Math.round(message.confidence * 100)}%
              </span>
            )}
            {message.processingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {(message.processingTime / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Market data card component
function MarketDataCard({
  data,
  onActionClick
}: {
  data: MarketDataDisplay;
  onActionClick: (action: ActionButton) => void;
}) {
  const platformColor = data.platform === 'polymarket' ? 'blue' : 'purple'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              platformColor === 'blue'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {data.platform.toUpperCase()}
            </span>
            <span className="text-white/60 text-xs">{data.type}</span>
          </div>
          <h4 className="text-white font-medium text-sm mb-1">{data.title}</h4>
          {data.subtitle && (
            <p className="text-white/60 text-xs">{data.subtitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {data.data.price && (
          <div>
            <div className="text-white/60 text-xs">Price</div>
            <div className="text-white font-medium">
              ${typeof data.data.price === 'number' ? data.data.price.toFixed(2) : data.data.price}
            </div>
          </div>
        )}
        {data.data.change !== undefined && (
          <div>
            <div className="text-white/60 text-xs">24h Change</div>
            <div className={`font-medium ${
              data.data.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {data.data.change >= 0 ? '+' : ''}{data.data.change.toFixed(2)}%
            </div>
          </div>
        )}
        {data.data.volume && (
          <div>
            <div className="text-white/60 text-xs">Volume</div>
            <div className="text-white font-medium">
              ${data.data.volume.toLocaleString()}
            </div>
          </div>
        )}
        {data.data.confidence && (
          <div>
            <div className="text-white/60 text-xs">Confidence</div>
            <div className="text-white font-medium">
              {(data.data.confidence * 100).toFixed(1)}%
            </div>
          </div>
        )}
        {data.data.trend && (
          <div className="col-span-2">
            <div className="text-white/60 text-xs">Trend</div>
            <div className="flex items-center gap-2">
              <div className="text-white font-medium text-sm">{data.data.trend}</div>
              {/* Add mini sparkline if we have historical data */}
              <Sparkline
                data={[0.5, 0.7, 0.6, 0.8, 0.9, 0.8, 1.0]}
                color={data.data.change && data.data.change >= 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'}
                width={40}
                height={16}
              />
            </div>
          </div>
        )}
      </div>

      {data.quickActions && data.quickActions.length > 0 && (
        <div className="flex gap-2">
          {data.quickActions.map((action, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onActionClick(action)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-xs text-white/80 transition-all duration-300"
            >
              {action.icon && <action.icon className="w-3 h-3" />}
              {action.label}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Streaming message component (same as before but enhanced)
function StreamingMessageBubble({
  content,
  thinkingContent,
  showThinking,
  activeTools,
  memoryAccess
}: {
  content: string
  thinkingContent: string
  showThinking: boolean
  activeTools: Record<string, string>
  memoryAccess: string[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 group"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 mt-1">
        <Image src="/c0gni-c-white.svg" alt="c0gni" width={16} height={16} className="w-4 h-4" />
      </div>

      <div className="flex-1">
        <div className="space-y-3">
          {/* Memory access indicators */}
          <AnimatePresence>
            {memoryAccess.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10
                                backdrop-blur-sm border border-white/10
                                rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/60 font-medium">
                      Accessing market data and knowledge base
                    </span>
                  </div>

                  <div className="space-y-2">
                    {memoryAccess.slice(-3).map((memory, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-xs text-white/50"
                      >
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                        <span>{memory}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tool usage indicators */}
          <AnimatePresence>
            {Object.entries(activeTools).map(([tool, status]) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-3"
              >
                <div className="bg-gradient-to-r from-white/[0.06] to-transparent
                                border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        {status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white/80">{tool}</span>
                        <span className="text-xs text-white/40">
                          {status === 'running' ? 'Analyzing market data...' : 'Complete'}
                        </span>
                      </div>

                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-white/20 to-white/10"
                          initial={{ width: '0%' }}
                          animate={{ width: status === 'completed' ? '100%' : '60%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking indicator */}
          {showThinking && thinkingContent && (
            <div className="mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-white/40 animate-pulse" />
                <span className="text-xs text-white/40 font-mono">Processing market analysis...</span>
              </div>
              <div className="text-sm text-white/60 font-mono">
                {thinkingContent}
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="prose prose-invert prose-sm max-w-none
                          prose-headings:text-white prose-headings:font-medium
                          prose-p:text-zinc-300 prose-p:leading-relaxed
                          prose-strong:text-white
                          prose-code:text-zinc-300 prose-code:bg-zinc-800/50
                          prose-code:px-1.5 prose-code:py-0.5
                          prose-code:rounded prose-code:text-xs
                          prose-pre:bg-zinc-900/50 prose-pre:border
                          prose-pre:border-white/5 prose-pre:rounded-lg
                          prose-ul:text-zinc-300 prose-ol:text-zinc-300
                          prose-li:text-zinc-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
            {content && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-zinc-400 ml-1"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
