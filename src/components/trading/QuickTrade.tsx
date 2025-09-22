'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWalletManager } from '@/hooks/useWalletManager'
import { TradeButton } from './TradeButton'
import { toast } from 'sonner'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRightLeft,
  Loader2,
} from 'lucide-react'

interface QuickTradeProps {
  market: {
    id: string
    symbol?: string
    question?: string
    yesPrice?: number
    noPrice?: number
    markPrice?: number
    type?: 'polymarket' | 'hyperliquid'
  }
  platform: 'polymarket' | 'hyperliquid'
  onTradeComplete?: (result: any) => void
}

const PRESET_AMOUNTS = [10, 25, 50, 100]

export function QuickTrade({ market, platform, onTradeComplete }: QuickTradeProps) {
  const { address, isConnected, balance, canTrade, connect, isLoading } = useWalletManager()

  const [selectedSide, setSelectedSide] = useState<'YES' | 'NO' | 'LONG' | 'SHORT'>(
    platform === 'polymarket' ? 'YES' : 'LONG'
  )
  const [selectedAmount, setSelectedAmount] = useState<number>(25)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [isCustom, setIsCustom] = useState(false)
  const [isTrading, setIsTrading] = useState(false)
  const [tradeResult, setTradeResult] = useState<any>(null)

  const getTradeAmount = () => {
    return isCustom ? parseFloat(customAmount) || 0 : selectedAmount
  }

  const getMaxAmount = () => {
    return Math.min(parseFloat(balance.usdc), 1000)
  }

  const handleQuickTrade = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    if (!canTrade) {
      toast.error('Please switch to the correct network')
      return
    }

    const amount = getTradeAmount()
    if (amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (amount > parseFloat(balance.usdc)) {
      toast.error(`Insufficient balance. Available: $${balance.usdc}`)
      return
    }

    setIsTrading(true)

    try {
      const response = await fetch('/api/trading/quick-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          marketId: market.id,
          side: selectedSide,
          amount,
          walletAddress: address,
          orderType: 'market',
        }),
      })

      if (!response.ok) {
        throw new Error('Trade failed')
      }

      const result = await response.json()
      setTradeResult(result)

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <div>
            <div className="font-medium">Trade Successful!</div>
            <div className="text-sm opacity-90">
              Bought {result.shares} shares for ${result.totalCost.toFixed(2)}
            </div>
          </div>
        </div>
      )

      if (onTradeComplete) {
        onTradeComplete(result)
      }

      // Reset form
      setSelectedAmount(25)
      setCustomAmount('')
      setIsCustom(false)
    } catch (error: any) {
      console.error('Trade error:', error)
      toast.error(error.message || 'Trade failed')
    } finally {
      setIsTrading(false)
    }
  }

  const getPriceDisplay = () => {
    if (platform === 'polymarket') {
      const price = selectedSide === 'YES' ? market.yesPrice : market.noPrice
      return price ? `$${price.toFixed(3)}` : 'N/A'
    } else {
      return market.markPrice ? `$${market.markPrice.toFixed(2)}` : 'N/A'
    }
  }

  const getEstimatedShares = () => {
    const amount = getTradeAmount()
    if (!amount) return 0

    if (platform === 'polymarket') {
      const price = selectedSide === 'YES' ? market.yesPrice : market.noPrice
      return price ? amount / price : 0
    } else {
      return market.markPrice ? amount / market.markPrice : 0
    }
  }

  if (!market) return null

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Quick Trade
        </h3>
        <div className="text-sm text-white/60">
          Balance: ${parseFloat(balance.usdc).toFixed(2)}
        </div>
      </div>

      {/* Side Selection */}
      <div className="grid grid-cols-2 gap-3">
        {platform === 'polymarket' ? (
          <>
            <button
              onClick={() => setSelectedSide('YES')}
              className={`p-3 rounded-xl border transition-all ${
                selectedSide === 'YES'
                  ? 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
              }`}
            >
              <TrendingUp className="h-5 w-5 mx-auto mb-1" />
              <div className="font-medium">YES</div>
              <div className="text-xs opacity-80">{market.yesPrice ? `$${market.yesPrice.toFixed(3)}` : 'N/A'}</div>
            </button>
            <button
              onClick={() => setSelectedSide('NO')}
              className={`p-3 rounded-xl border transition-all ${
                selectedSide === 'NO'
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
              }`}
            >
              <TrendingDown className="h-5 w-5 mx-auto mb-1" />
              <div className="font-medium">NO</div>
              <div className="text-xs opacity-80">{market.noPrice ? `$${market.noPrice.toFixed(3)}` : 'N/A'}</div>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedSide('LONG')}
              className={`p-3 rounded-xl border transition-all ${
                selectedSide === 'LONG'
                  ? 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
              }`}
            >
              <TrendingUp className="h-5 w-5 mx-auto mb-1" />
              <div className="font-medium">LONG</div>
            </button>
            <button
              onClick={() => setSelectedSide('SHORT')}
              className={`p-3 rounded-xl border transition-all ${
                selectedSide === 'SHORT'
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
              }`}
            >
              <TrendingDown className="h-5 w-5 mx-auto mb-1" />
              <div className="font-medium">SHORT</div>
            </button>
          </>
        )}
      </div>

      {/* Amount Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80">Select Amount</label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount)
                setIsCustom(false)
                setCustomAmount('')
              }}
              disabled={amount > parseFloat(balance.usdc)}
              className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                !isCustom && selectedAmount === amount
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : amount > parseFloat(balance.usdc)
                  ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value)
              setIsCustom(true)
            }}
            onFocus={() => setIsCustom(true)}
            min="0"
            max={getMaxAmount()}
            step="0.01"
            className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      {/* Trade Summary */}
      <div className="bg-white/10 rounded-xl p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Trade Amount:</span>
          <span className="text-white font-medium">${getTradeAmount().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Current Price:</span>
          <span className="text-white">{getPriceDisplay()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Est. Shares:</span>
          <span className="text-white font-medium">{getEstimatedShares().toFixed(2)}</span>
        </div>
      </div>

      {/* Warnings */}
      {getTradeAmount() > parseFloat(balance.usdc) && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
          <div className="text-sm text-red-400">
            Insufficient balance. Available: ${balance.usdc}
          </div>
        </div>
      )}

      {/* Trade Button */}
      <TradeButton
        onClick={handleQuickTrade}
        isLoading={isTrading || isLoading}
        disabled={
          !canTrade ||
          getTradeAmount() <= 0 ||
          getTradeAmount() > parseFloat(balance.usdc)
        }
        side={selectedSide as any}
        amount={getTradeAmount()}
        platform={platform}
      />

      {/* Trade Result */}
      <AnimatePresence>
        {tradeResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="font-medium text-green-400">Trade Executed!</span>
            </div>
            <div className="space-y-1 text-sm text-white/80">
              <div>Order ID: {tradeResult.orderId}</div>
              <div>Shares: {tradeResult.shares}</div>
              <div>Total Cost: ${tradeResult.totalCost.toFixed(2)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}