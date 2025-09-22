'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { QuickTrade } from '@/components/trading/QuickTrade'

interface Market {
  symbol: string
  marketType: 'perp' | 'spot'
  baseAsset: string
  quoteAsset: string
  markPrice: number
  lastPrice: number
  priceChange24h: number
  priceChangePercent24h: number
  volume24h: number
  openInterest?: number
  fundingRate?: number
  status: string
}

export default function HyperliquidMarketPage() {
  const params = useParams<{ symbol: string }>()
  const symbol = decodeURIComponent(params?.symbol || '')

  const [market, setMarket] = useState<Market | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!symbol) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/markets/hyperliquid', { cache: 'no-store' })
        const data = await res.json()
        const m = (data.markets || []).find((x: any) => (x.symbol || '').toUpperCase() === symbol.toUpperCase())
        setMarket(m || null)
      } catch (e: any) {
        setError(e?.message || 'Failed to load market')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [symbol])

  if (loading) return <div className="p-8 text-white/70">Loading market...</div>
  if (!market) return <div className="p-8 text-white/70">Market not found.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{market.symbol}</h1>
          <div className="text-white/60 text-sm mt-1">{market.baseAsset} / {market.quoteAsset} • {market.marketType.toUpperCase()}</div>
        </div>
        <Link href="/dashboard/hyperliquid" className="text-white/70 hover:text-white/90 underline">All Hyperliquid</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-2">Mark Price</div>
          <div className="text-white text-2xl font-semibold">${(market.markPrice || 0).toFixed(2)}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-2">24h Change</div>
          <div className={`text-2xl font-semibold ${market.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {market.priceChange24h >= 0 ? '+' : ''}{(market.priceChangePercent24h || 0).toFixed(2)}%
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-2">Volume (24h)</div>
          <div className="text-white text-2xl font-semibold">${(market.volume24h || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-2">Funding Rate</div>
          <div className="text-white text-2xl font-semibold">{market.fundingRate != null ? `${(market.fundingRate * 100).toFixed(4)}%` : '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickTrade platform="hyperliquid" market={{ id: market.symbol, symbol: market.symbol, markPrice: market.markPrice, type: 'hyperliquid' }} />

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-white/80 font-medium mb-2">Market details</div>
          <div className="text-white/70 text-sm">Symbol: {market.symbol}</div>
          <div className="text-white/70 text-sm">Type: {market.marketType}</div>
          <div className="text-white/70 text-sm">Status: {market.status}</div>
        </div>
      </div>
    </div>
  )
}

