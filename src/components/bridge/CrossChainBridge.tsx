'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLiFiService, type BridgeQuote } from '@/lib/lifi-service'
import { useWalletTransactions } from '@/lib/wallet-transactions'
import { useWallet } from '@/lib/wallet'
import {
  ArrowRightLeft,
  ArrowRight,
  Loader2,
  Clock,
  TrendingDown,
  Zap,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

interface CrossChainBridgeProps {
  className?: string
  onTransferComplete?: (txHash: string) => void
}

export function CrossChainBridge({ className = '', onTransferComplete }: CrossChainBridgeProps) {
  const [amount, setAmount] = useState('')
  const [direction, setDirection] = useState<'to-hyperliquid' | 'to-polygon'>('to-hyperliquid')
  const [quote, setQuote] = useState<BridgeQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const {
    getBridgeQuote,
    executeCrossChainTransfer,
    transferUSDCToHyperliquid,
    transferUSDCToPolygon,
    getTransferStatus,
    isOnPolygon,
    isOnHyperliquid,
  } = useLiFiService()

  const { checkUSDCBalance } = useWalletTransactions()
  const { address, isConnected } = useWallet()

  const [balance, setBalance] = useState<string>('0')

  // Load USDC balance
  useEffect(() => {
    const loadBalance = async () => {
      if (isConnected && address) {
        try {
          const usdcBalance = await checkUSDCBalance()
          setBalance(usdcBalance)
        } catch (error) {
          console.error('Failed to load balance:', error)
        }
      }
    }

    loadBalance()
  }, [isConnected, address, checkUSDCBalance])

  // Get quote when amount changes
  useEffect(() => {
    const getQuote = async () => {
      if (!amount || parseFloat(amount) <= 0 || !isConnected) {
        setQuote(null)
        return
      }

      setIsLoading(true)
      try {
        let quoteResult: BridgeQuote
        if (direction === 'to-hyperliquid') {
          quoteResult = await transferUSDCToHyperliquid(amount)
        } else {
          quoteResult = await transferUSDCToPolygon(amount)
        }
        setQuote(quoteResult)
      } catch (error) {
        console.error('Failed to get quote:', error)
        toast.error('Failed to get bridge quote')
        setQuote(null)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(getQuote, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [amount, direction, isConnected, transferUSDCToHyperliquid, transferUSDCToPolygon])

  const handleSwapDirection = () => {
    setDirection(prev => prev === 'to-hyperliquid' ? 'to-polygon' : 'to-hyperliquid')
    setQuote(null)
  }

  const handleMaxClick = () => {
    if (balance && parseFloat(balance) > 0) {
      // Reserve some for gas fees
      const maxAmount = Math.max(0, parseFloat(balance) - 0.1).toString()
      setAmount(maxAmount)
    }
  }

  const handleExecuteTransfer = async () => {
    if (!quote || !isConnected) return

    setIsExecuting(true)
    try {
      const hash = await executeCrossChainTransfer(quote)
      setTxHash(hash)
      toast.success('Cross-chain transfer initiated!')

      // Monitor transfer status
      monitorTransfer(hash)

      if (onTransferComplete) {
        onTransferComplete(hash)
      }
    } catch (error) {
      console.error('Failed to execute transfer:', error)
      toast.error('Failed to execute transfer')
    } finally {
      setIsExecuting(false)
    }
  }

  const monitorTransfer = async (hash: string) => {
    try {
      const status = await getTransferStatus(hash)
      console.log('Transfer status:', status)

      if (status.status === 'DONE') {
        toast.success('Transfer completed successfully!')
      } else if (status.status === 'FAILED') {
        toast.error('Transfer failed')
      }
    } catch (error) {
      console.error('Failed to monitor transfer:', error)
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  const formatFee = (fee: string) => {
    const feeNum = parseFloat(fee)
    if (feeNum < 0.01) return '< $0.01'
    return `$${feeNum.toFixed(2)}`
  }

  const fromChain = direction === 'to-hyperliquid' ? 'Polygon' : 'Hyperliquid'
  const toChain = direction === 'to-hyperliquid' ? 'Hyperliquid' : 'Polygon'
  const fromColor = direction === 'to-hyperliquid' ? 'bg-purple-500' : 'bg-blue-500'
  const toColor = direction === 'to-hyperliquid' ? 'bg-blue-500' : 'bg-purple-500'

  const canExecute = quote &&
                    amount &&
                    parseFloat(amount) > 0 &&
                    parseFloat(amount) <= parseFloat(balance) &&
                    isConnected &&
                    !isExecuting

  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-white">Cross-Chain Bridge</h3>
        <Badge variant="outline" className="bg-white/10 text-white border-white/20">
          USDC Transfer
        </Badge>
      </div>

      {/* Chain Direction */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          {/* From Chain */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${fromColor}`} />
              <span className="text-white/60 text-sm">From</span>
            </div>
            <div className="text-white font-medium">{fromChain}</div>
            <div className="text-white/40 text-xs mt-1">
              Balance: {parseFloat(balance).toFixed(2)} USDC
            </div>
          </div>

          {/* Swap Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapDirection}
            className="mx-4 p-2 bg-white/10 border-white/20 hover:bg-white/15"
            disabled={isLoading || isExecuting}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>

          {/* To Chain */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${toColor}`} />
              <span className="text-white/60 text-sm">To</span>
            </div>
            <div className="text-white font-medium">{toChain}</div>
            <div className="text-white/40 text-xs mt-1">
              {quote ? `≈ ${parseFloat(quote.toAmount).toFixed(2)} USDC` : 'Enter amount'}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/60 text-sm">Amount (USDC)</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaxClick}
            className="text-xs text-white/60 hover:text-white"
          >
            MAX
          </Button>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">
            USDC
          </div>
        </div>
      </div>

      {/* Quote Information */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-white/60" />
          <span className="ml-2 text-white/60">Getting quote...</span>
        </div>
      )}

      {quote && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white/60 mb-1">You'll receive</div>
              <div className="text-white font-medium">{parseFloat(quote.toAmount).toFixed(4)} USDC</div>
            </div>
            <div>
              <div className="text-white/60 mb-1">Estimated time</div>
              <div className="text-white font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(quote.estimatedTime)}
              </div>
            </div>
            <div>
              <div className="text-white/60 mb-1">Gas fee</div>
              <div className="text-white font-medium">{formatFee(quote.fees.gas)}</div>
            </div>
            <div>
              <div className="text-white/60 mb-1">Bridge fee</div>
              <div className="text-white font-medium">{formatFee(quote.fees.protocol)}</div>
            </div>
          </div>

          {quote.priceImpact > 0.01 && (
            <div className="mt-3 flex items-center gap-2 text-yellow-400 text-xs">
              <AlertTriangle className="w-3 h-3" />
              Price impact: {(quote.priceImpact * 100).toFixed(2)}%
            </div>
          )}
        </motion.div>
      )}

      {/* Execute Button */}
      <Button
        onClick={handleExecuteTransfer}
        disabled={!canExecute}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Executing Transfer...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Bridge {amount || '0'} USDC
          </>
        )}
      </Button>

      {/* Transaction Hash */}
      {txHash && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Transfer initiated</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://layerzeroscan.com/tx/${txHash}`, '_blank')}
              className="text-green-400 hover:text-green-300"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-xs text-green-400/80 mt-1 font-mono">
            {txHash.slice(0, 20)}...{txHash.slice(-20)}
          </div>
        </motion.div>
      )}

      {/* Connection Warning */}
      {!isConnected && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Please connect your wallet to use the bridge
          </div>
        </div>
      )}
    </div>
  )
}