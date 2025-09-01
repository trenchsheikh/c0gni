'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import ScrollNavigation from '@/components/ScrollNavigation'
import MemoryMindmap from '@/components/memory/MemoryMindmap'
import type { MindmapData } from '@/app/api/memories/public/route'

interface MemoriesClientProps {
  initialData: MindmapData
}

export default function MemoriesClient({ initialData }: MemoriesClientProps) {
  const [showInfo, setShowInfo] = useState(false)
  const [memoriesData, setMemoriesData] = useState<MindmapData>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.nodes.length === 0)
  const mindmapRef = useRef<HTMLDivElement>(null)

  // Fetch data on client-side if not already loaded
  useEffect(() => {
    const fetchData = async () => {
      if (memoriesData.nodes.length === 0) {
        try {
          setIsLoading(true)
          const response = await fetch('/api/memories/public')
          if (response.ok) {
            const data = await response.json()
            setMemoriesData(data)
          }
        } catch (error) {
          console.error('Error fetching memories:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [memoriesData.nodes.length])

  // Sharing/export removed to streamline UI

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Main site navigation */}
      <ScrollNavigation />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 z-20 p-6 top-24 md:top-28"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
                <Sparkles className="w-4 h-4 text-white/70" />
              </div>
              <h1 className="text-white/90 text-sm md:text-base font-medium tracking-tight">Memory Mindmap</h1>
            </div>
          </div>

          <div />
        </div>

        {/* Info panel removed for simplicity */}
      </motion.header>

      {/* Main mindmap visualization */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-screen"
        ref={mindmapRef}
      >
{isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-full animate-pulse" />
                <div className="w-6 h-6 bg-gradient-to-r from-gray-300/20 to-white/20 rounded-full animate-pulse animation-delay-2000" />
                <div className="w-10 h-10 bg-gradient-to-r from-white/15 to-gray-400/15 rounded-full animate-pulse animation-delay-4000" />
              </div>
              
              <h2 className="text-2xl font-light text-white mb-3 tracking-tighter">
                Loading Memory Network
              </h2>
              
              <p className="text-white/70 max-w-md mx-auto leading-relaxed">
                Reconstructing the collective knowledge graph from our AI agent's memory...
              </p>
            </div>
          </div>
        ) : memoriesData.nodes.length > 0 ? (
          <MemoryMindmap data={memoriesData} className="w-full h-full pt-24 md:pt-28" compact />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-white/10 to-gray-300/10 rounded-full" />
                <div className="w-6 h-6 bg-gradient-to-r from-gray-300/10 to-white/10 rounded-full" />
                <div className="w-10 h-10 bg-gradient-to-r from-white/5 to-gray-400/5 rounded-full" />
              </div>
              
              <h2 className="text-2xl font-light text-white mb-3 tracking-tighter">
                No Memories Found
              </h2>
              
              <p className="text-white/70 max-w-md mx-auto leading-relaxed">
                The AI agent hasn't learned any memories yet. Come back after some conversations have taken place!
              </p>
              
              <Link 
                href="/chat"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200 mt-6"
              >
                <span>Start Chatting</span>
              </Link>
            </div>
          </div>
        )}
      </motion.main>

      {/* Footer and overlays removed to keep focus on graph */}
    </div>
  )
}
