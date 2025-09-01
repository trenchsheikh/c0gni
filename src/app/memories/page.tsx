import React, { Suspense } from 'react'
import { Metadata } from 'next'
import MemoriesClient from './client'
import type { MindmapData } from '@/app/api/memories/public/route'

export const metadata: Metadata = {
  title: 'Memory Mindmap | c0gni - AI Knowledge Visualization',
  description: 'Explore our AI agent\'s collective memory through an interactive mindmap. Visualize blockchain knowledge, trading insights, and DeFi protocols in a beautiful network graph.',
  openGraph: {
    title: 'Memory Mindmap | c0gni',
    description: 'Interactive visualization of AI agent memory - blockchain knowledge, trading strategies, and DeFi insights.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memory Mindmap | c0gni',
    description: 'Explore AI agent memory through an interactive mindmap visualization.',
  }
}

async function fetchMemoriesData(): Promise<MindmapData> {
  try {
    // For server-side rendering, use direct database access instead of fetch
    // to avoid issues with localhost URLs during build
    if (typeof window === 'undefined') {
      // Server-side: return empty data, let client-side handle the fetch
      return {
        nodes: [],
        connections: [],
        categories: {},
        types: {},
        totalMemories: 0
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    const response = await fetch(`${baseUrl}/api/memories/public`, {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch memories: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching memories data:', error)
    // Return empty data structure if fetch fails
    return {
      nodes: [],
      connections: [],
      categories: {},
      types: {},
      totalMemories: 0
    }
  }
}

// Loading component that matches your design
function MemoriesLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      {/* Background animated orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-gray-400/5 to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-t from-gray-300/5 to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 text-center">
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

        {/* Loading progress bars */}
        <div className="mt-8 space-y-3 max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>Fetching memories</span>
            <span>●●●</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1">
            <div className="bg-gradient-to-r from-white/30 to-white/50 h-1 rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function MemoriesPage() {
  const memoriesData = await fetchMemoriesData()

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Suspense fallback={<MemoriesLoading />}>
        <MemoriesClient initialData={memoriesData} />
      </Suspense>
    </div>
  )
}