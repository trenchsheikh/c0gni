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
  History,
  Settings,
  Download,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  Clock,
  TrendingUp,
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  MoreHorizontal,
  Archive,
  Trash2,
  Edit3,
  BarChart3
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'

// Enhanced interfaces for session-based chat
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  messageType?: 'text' | 'voice' | 'image' | 'code' | 'system'
  isEdited?: boolean
  isBookmarked?: boolean
  confidence?: number
  processingTime?: number
  extractedTopics?: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
  reactions?: MessageReaction[]
  metadata?: any
}

interface MessageReaction {
  id: string
  reaction: string
  isHelpful?: boolean
  accuracy?: number
  relevance?: number
  timestamp: Date
}

interface ChatSession {
  id: string
  title?: string
  messageCount: number
  lastActivity: Date
  mainTopics: string[]
  summary?: string
  isActive: boolean
  isPinned: boolean
}

interface SessionAnalytics {
  totalMessages: number
  avgResponseTime: number
  topicDistribution: Record<string, number>
  sentimentAnalysis: Record<string, number>
  reactionStats: any
}

interface StreamEvent {
  type: string
  data: any
}

interface ChatInterfaceProps {
  userId?: string // Optional user ID for personalized sessions
  initialSessionId?: string // Start with specific session
  sessionType?: 'private' | 'shared' | 'temporary'
  className?: string
}

export default function ChatInterface({ 
  userId, 
  initialSessionId, 
  sessionType = 'shared',
  className = ''
}: ChatInterfaceProps) {
  // Enhanced state management
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [showSessionSidebar, setShowSessionSidebar] = useState(false)
  const [sessionAnalytics, setSessionAnalytics] = useState<SessionAnalytics | null>(null)
  
  // AI interaction settings
  const [deepResearchMode, setDeepResearchMode] = useState(false)
  const [contextWindow, setContextWindow] = useState(20)
  const [autoSummarize, setAutoSummarize] = useState(true)
  
  // Streaming states
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [thinkingContent, setThinkingContent] = useState('')
  const [showThinking, setShowThinking] = useState(false)
  const [activeTools, setActiveTools] = useState<Record<string, string>>({})
  const [memoryAccess, setMemoryAccess] = useState<string[]>([])
  const [firstTokenTime, setFirstTokenTime] = useState<number | null>(null)
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null)
  
  // UI/UX enhancements
  const [darkMode, setDarkMode] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const streamingMessageRef = useRef('')
  const messageAddedRef = useRef(false)
  const recognition = useRef<any>(null)

  // Utility functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Initialize session and load chat history
  const initializeSession = useCallback(async () => {
    try {
      if (initialSessionId) {
        // Load existing session
        const response = await fetch(`/api/chat/${initialSessionId}`)
        if (response.ok) {
          const sessionData = await response.json()
          setCurrentSession(sessionData.session)
          setMessages(sessionData.messages || [])
          setSessionAnalytics(sessionData.analytics)
        }
      } else {
        // Create new session
        setCurrentSession({
          id: 'temp_' + Date.now(),
          messageCount: 0,
          lastActivity: new Date(),
          mainTopics: [],
          isActive: true,
          isPinned: false
        })
      }

      // Load user sessions if userId provided
      if (userId) {
        const response = await fetch(`/api/chat?userId=${userId}&limit=10`)
        if (response.ok) {
          const data = await response.json()
          setSessions(data.sessions || [])
        }
      }
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
  }, [initialSessionId, userId])

  // Load session messages
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/${sessionId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setSessionAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Failed to load session messages:', error)
    }
  }, [])

  // Initialize voice recognition
  const initializeVoiceRecognition = useCallback(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = true
      recognition.current.lang = 'en-US'

      recognition.current.onstart = () => {
        setIsListening(true)
      }

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')

        setInput(transcript)
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
    }
  }, [])

  // Effects
  useEffect(() => {
    initializeSession()
    initializeVoiceRecognition()
  }, [initializeSession, initializeVoiceRecognition])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage, thinkingContent, scrollToBottom])

  // Enhanced send message with session support
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
    setFirstTokenTime(null)
    setProcessingStartTime(Date.now())

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          sessionId: currentSession?.id,
          userId,
          deepResearchMode,
          sessionOptions: {
            sessionType,
            contextWindow,
            autoSummarize,
            title: currentSession?.title
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
              const data = JSON.parse(jsonStr) as StreamEvent
              await handleEnhancedStreamEvent(data)
            } catch (error) {
              console.error('Parse error:', error, 'Line was:', line)
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Add error message to current session
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        messageType: 'system'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setShowThinking(false)
      setThinkingContent('')
      setProcessingStartTime(null)
    }
  }

  // Voice input functions
  const startVoiceInput = useCallback(() => {
    if (recognition.current && voiceEnabled) {
      recognition.current.start()
    }
  }, [voiceEnabled])

  const stopVoiceInput = useCallback(() => {
    if (recognition.current && isListening) {
      recognition.current.stop()
    }
  }, [isListening])

  // Text-to-speech for AI responses
  const speakMessage = useCallback((text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }, [voiceEnabled])

  // Message actions
  const toggleMessageBookmark = useCallback(async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/bookmark`, {
        method: 'POST'
      })
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isBookmarked: !msg.isBookmarked }
          : msg
      ))
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }, [])

  const addMessageReaction = useCallback(async (messageId: string, reaction: string, feedback?: { isHelpful?: boolean; accuracy?: number; relevance?: number }) => {
    try {
      await fetch(`/api/messages/${messageId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reaction,
          ...feedback
        })
      })

      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const newReaction: MessageReaction = {
            id: Date.now().toString(),
            reaction,
            ...feedback,
            timestamp: new Date()
          }
          return {
            ...msg,
            reactions: [...(msg.reactions || []), newReaction]
          }
        }
        return msg
      }))

      setSelectedMessageForReaction(null)
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
  }, [])

  // Session management functions
  const createNewSession = useCallback(async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '', // Empty message to just create session
          userId,
          sessionOptions: {
            sessionType,
            contextWindow,
            autoSummarize
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentSession(data.session)
        setMessages([])
        setSessionAnalytics(null)
      }
    } catch (error) {
      console.error('Failed to create new session:', error)
    }
  }, [userId, sessionType, contextWindow, autoSummarize])

  const switchToSession = useCallback(async (sessionId: string) => {
    await loadSessionMessages(sessionId)
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
    }
    setShowSessionSidebar(false)
  }, [loadSessionMessages, sessions])

  const exportConversation = useCallback(async () => {
    if (!currentSession) return

    try {
      const response = await fetch(`/api/chat/${currentSession.id}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `conversation-${currentSession.id}-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export conversation:', error)
    }
  }, [currentSession])

  // Enhanced stream event handler with session support
  const handleEnhancedStreamEvent = async (event: StreamEvent) => {
    console.log('Received enhanced stream event:', event.type, event.data)
    
    switch (event.type) {
      case 'session_info':
        if (event.data.sessionId && event.data.isNewSession) {
          // Update current session with new session data
          setCurrentSession(prev => ({
            ...prev!,
            id: event.data.sessionId,
            messageCount: event.data.messageCount || 0,
            mainTopics: event.data.mainTopics || []
          }))
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

      case 'first_token':
        if (!firstTokenTime && processingStartTime) {
          setFirstTokenTime(event.data.timestamp - processingStartTime)
        }
        break

      case 'content':
        console.log('Content chunk received:', event.data.content)
        setStreamingMessage(prev => {
          const newContent = prev + (event.data.content || '')
          streamingMessageRef.current = newContent
          return newContent
        })
        break

      case 'complete':
        console.log('Enhanced complete event received')
        
        if (messageAddedRef.current) {
          console.log('Already processed complete event, ignoring duplicate')
          return
        }
        
        messageAddedRef.current = true
        
        // Process completion with enhanced data
        setTimeout(async () => {
          const finalContent = streamingMessageRef.current
          console.log('Processing enhanced completion:', finalContent.substring(0, 100) + '...')
          
          if (finalContent.trim()) {
            const assistantMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant', 
              content: finalContent,
              timestamp: new Date(),
              messageType: 'text',
              confidence: event.data.confidence,
              processingTime: event.data.processingTime,
              extractedTopics: await extractTopicsFromContent(finalContent),
              metadata: {
                toolsUsed: event.data.toolsUsed,
                sessionId: event.data.sessionId
              }
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

            // Update session data
            if (currentSession) {
              setCurrentSession(prev => ({
                ...prev!,
                messageCount: event.data.messageCount || prev!.messageCount + 2,
                lastActivity: new Date()
              }))
            }

            // Update analytics
            if (event.data.analytics) {
              setSessionAnalytics(event.data.analytics)
            }

            // Auto-speak if voice enabled
            if (voiceEnabled) {
              speakMessage(finalContent)
            }

            console.log('Enhanced message processing complete')
          } else {
            console.error('No content available after enhanced processing!')
          }
          
          // Clear streaming state
          setStreamingMessage('')
          streamingMessageRef.current = ''
        }, 10)
        break

      case 'error':
        console.error('Enhanced stream error:', event.data)
        break
    }
  }

  // Extract topics from content (client-side implementation)
  const extractTopicsFromContent = async (content: string): Promise<string[]> => {
    const lowerContent = content.toLowerCase()
    const cryptoKeywords = {
      'trading': ['trading', 'trade', 'buy', 'sell', 'position', 'profit', 'loss'],
      'defi': ['defi', 'yield', 'farming', 'liquidity', 'pool', 'staking', 'lending'],
      'analysis': ['analysis', 'technical', 'chart', 'trend', 'support', 'resistance'],
      'tokens': ['bitcoin', 'btc', 'ethereum', 'eth', 'token', 'coin', 'price'],
      'blockchain': ['blockchain', 'network', 'gas', 'transaction', 'smart contract'],
      'market': ['market', 'volume', 'cap', 'pump', 'dump', 'bullish', 'bearish']
    }

    const foundTopics: string[] = []
    
    for (const [topic, keywords] of Object.entries(cryptoKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        foundTopics.push(topic)
      }
    }

    return foundTopics.slice(0, 3)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-full">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Main Chat Container */}
      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto h-full">
        {/* Messages Container */}
        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                index={index}
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

        {/* Input Area */}
        <div className="p-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about blockchain, markets, or trading..."
                className="w-full bg-white/5 backdrop-blur-sm 
                           border border-white/10 rounded-2xl
                           px-6 py-4 pr-20
                           text-white placeholder-white/40
                           focus:bg-white/[0.08] focus:border-white/20
                           focus:outline-none focus:ring-2 focus:ring-white/10
                           transition-all duration-300
                           resize-none min-h-[60px] max-h-[200px]"
                disabled={isLoading}
              />
              
              {/* Action buttons */}
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 
                             hover:from-white/15 hover:to-white/10
                             disabled:from-white/5 disabled:to-white/5
                             border border-white/10 rounded-xl
                             flex items-center gap-2
                             transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white/80" />
                  )}
                  <span className="text-sm font-medium text-white/80">Send</span>
                </motion.button>
              </div>
            </div>
            
            {/* Features row */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setDeepResearchMode(!deepResearchMode)}
                  className={`text-xs flex items-center gap-1 transition-colors ${
                    deepResearchMode 
                      ? 'text-white/80 hover:text-white'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  Deep Research Mode
                </button>
                <span className="text-xs text-white/40">
                  Stateless • No History Saved
                </span>
              </div>
              <span className="text-xs text-white/40">
                {input.length}/4000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Message bubble component
function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1 
      }}
      className={`flex gap-4 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
          <Image src="/c0gni-c-white.svg" alt="c0gni" width={20} height={20} className="w-5 h-5" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
        <div className={`p-4 sm:p-5 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.05] border border-white/10'
            : 'bg-white/[0.03] backdrop-blur-sm border border-white/[0.08]'
        }`}>
          {isUser ? (
            <p className="text-white/90">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none 
                            prose-headings:text-white/90 
                            prose-p:text-white/80 
                            prose-code:bg-white/10 
                            prose-code:px-2 
                            prose-code:py-1 
                            prose-code:rounded
                            prose-pre:bg-white/5
                            prose-pre:border
                            prose-pre:border-white/10">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-white/40">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  )
}

// Streaming message component
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4"
    >
      <div className="relative w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
        <Image src="/c0gni-c-white.svg" alt="c0gni" width={20} height={20} className="w-5 h-5" />
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      
      <div className="flex-1">
        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4 sm:p-5">
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
                      Accessing shared crypto knowledge
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
                          {status === 'running' ? 'Executing...' : 'Complete'}
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
                <span className="text-xs text-white/40 font-mono">Processing thoughts...</span>
              </div>
              <div className="text-sm text-white/60 font-mono">
                {thinkingContent}
              </div>
            </div>
          )}
          
          {/* Main content */}
          <div className="prose prose-invert prose-sm max-w-none 
                          prose-headings:text-white/90 
                          prose-p:text-white/80 
                          prose-code:bg-white/10 
                          prose-code:px-2 
                          prose-code:py-1 
                          prose-code:rounded
                          prose-pre:bg-white/5
                          prose-pre:border
                          prose-pre:border-white/10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
            {content && (
              <motion.span
                className="inline-block w-2 h-4 bg-white/60 ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}