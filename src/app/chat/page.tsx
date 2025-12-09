'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ScrollNavigation from '@/components/ScrollNavigation'
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface'

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate brief loading for effect
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
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

  return (
    <div className="h-screen bg-[#0A0A0A] overflow-hidden flex flex-col">
      <ScrollNavigation />
      <div className="flex-1 pt-24 pb-0 h-full overflow-hidden">
        <EnhancedChatInterface 
          userId="guest_user"
          sessionType="trading"
          className="h-full"
        />
      </div>
    </div>
  )
}
