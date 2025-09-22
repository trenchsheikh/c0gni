'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Zap, TrendingUp, TrendingDown } from 'lucide-react'

interface TradeButtonProps {
  onClick: () => void | Promise<void>
  isLoading?: boolean
  disabled?: boolean
  side: 'YES' | 'NO' | 'LONG' | 'SHORT'
  amount?: number
  platform: 'polymarket' | 'hyperliquid'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TradeButton({
  onClick,
  isLoading = false,
  disabled = false,
  side,
  amount,
  platform,
  size = 'md',
  className = '',
}: TradeButtonProps) {
  const isBullish = side === 'YES' || side === 'LONG'

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'lg':
        return 'px-6 py-4 text-lg'
      default:
        return 'px-4 py-3'
    }
  }

  const getColorClasses = () => {
    if (disabled) {
      return 'bg-white/10 border-white/20 text-white/40 cursor-not-allowed'
    }

    if (isBullish) {
      return 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30 hover:border-green-500/50'
    } else {
      return 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 hover:border-red-500/50'
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Processing...'

    let action = 'Trade'
    if (platform === 'polymarket') {
      action = isBullish ? 'Buy YES' : 'Buy NO'
    } else {
      action = isBullish ? 'Go Long' : 'Go Short'
    }

    if (amount) {
      return `${action} $${amount.toFixed(2)}`
    }

    return action
  }

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }

    if (isBullish) {
      return <TrendingUp className="h-4 w-4" />
    } else {
      return <TrendingDown className="h-4 w-4" />
    }
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative flex items-center justify-center gap-2
        font-medium rounded-xl border transition-all duration-200
        ${getSizeClasses()} ${getColorClasses()} ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {/* Background animation */}
      {!disabled && (
        <motion.div
          className={`absolute inset-0 rounded-xl opacity-20 ${
            isBullish ? 'bg-green-400' : 'bg-red-400'
          }`}
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Button content */}
      <div className="relative flex items-center gap-2">
        {getIcon()}
        <span>{getButtonText()}</span>
        {!isLoading && !disabled && (
          <Zap className="h-3 w-3 opacity-60" />
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-xl" />
      )}
    </motion.button>
  )
}