'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import TradingModal from '@/components/polymarket/TradingModal'
import { QuickTrade } from '@/components/trading/QuickTrade'

interface Market {
  id: string
  question: string
  description?: string
  category: string
  yesPrice: number
  noPrice: number
  volume24h: number
  totalVolume: number
  liquidity: number
  resolutionDate?: string | Date
  status: 'active' | 'closed' | 'resolved'
  tags: string[]
  impliedOdds: number
  conditionId?: string
  yesTokenId?: string
  noTokenId?: string
  tradingEnabled?: boolean
}

export default function PolymarketMarketPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [market, setMarket] = useState<Market | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tradingOpen, setTradingOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/markets/polymarket', { cache: 'no-store' })
        const data = await res.json()
        const m = (data.markets || []).find((x: any) => x.id === id)
        setMarket(m || null)
      } catch (e: any) {
        setError(e?.message || 'Failed to load market')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="p-8 text-white/70">Loading market...</div>
  if (!market) return <div className="p-8 text-white/70">Market not found.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{market.question}</h1>
          <div className="text-white/60 text-sm mt-1">{market.category}</div>
        </div>
        <Link href="/dashboard/polymarket" className="text-white/70 hover:text-white/90 underline">All Polymarket</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-2">YES Price</div>
          <div className="text-white text-2xl font-semibold">${market.yesPrice?.toFixed(3) ?? '0.000'}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-2">NO Price</div>
          <div className="text-white text-2xl font-semibold">${market.noPrice?.toFixed(3) ?? '0.000'}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-2">24h Volume</div>
          <div className="text-white text-2xl font-semibold">${(market.volume24h || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickTrade platform="polymarket" market={{ id: market.id, question: market.question, yesPrice: market.yesPrice, noPrice: market.noPrice, type: 'polymarket' }} />

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/80 font-medium mb-2">About this market</div>
          <div className="text-white/70 text-sm whitespace-pre-line">{market.description || 'No description available.'}</div>
          <div className="text-white/60 text-xs mt-4">Resolution: {market.resolutionDate ? new Date(market.resolutionDate).toLocaleString() : 'TBD'}</div>
        </div>
      </div>

      <TradingModal market={market as any} isOpen={tradingOpen} onClose={() => setTradingOpen(false)} />
    </div>
  )
}

