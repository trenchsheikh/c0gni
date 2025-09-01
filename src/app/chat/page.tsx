'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ScrollNavigation from '@/components/ScrollNavigation'
import ChatInterface from '@/components/chat/ChatInterface'

// Mock auth - replace with your actual auth system
const mockUser = {
  id: 'user_123',
  email: 'demo@c0gni.com',
  username: 'demo_user'
}

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<typeof mockUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate auth check - replace with real authentication
    setTimeout(() => {
      setUser(mockUser)
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] flex items-center justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white/80 mb-2">Initializing c0gni AI</h2>
          <p className="text-white/60">Loading your blockchain intelligence assistant...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] flex items-center justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md mx-auto p-8"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V21H5V3H13V9H21Z"/>
              </svg>
            </div>
            
            <h1 className="text-2xl font-semibold text-white/90 mb-4">Authentication Required</h1>
            <p className="text-white/70 mb-8">Please sign in to access your c0gni AI assistant and blockchain intelligence features.</p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-gradient-to-r from-white/10 to-white/5 
                         hover:from-white/15 hover:to-white/10
                         border border-white/10 rounded-xl
                         text-white/90 font-medium
                         transition-all duration-300"
            >
              Sign In to Continue
            </motion.button>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-white/50">
                New to c0gni? <span className="text-white/70 hover:text-white cursor-pointer">Create an account</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] overflow-hidden">
      <ScrollNavigation />
      <div className="h-full pt-24">
        <ChatInterface 
          userId={user.id}
          onChatCreated={(chatId) => {
            console.log('New chat created:', chatId)
            // Handle chat creation (e.g., update URL, save to state)
          }}
        />
      </div>
    </div>
  )
}