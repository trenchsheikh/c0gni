import React from 'react'
import {
  getRoutes,
  getQuote,
  executeRoute,
  getChains,
  getTokens,
  getStatus
} from '@lifi/sdk'
import type {
  Route,
  RouteRequest,
  QuoteRequest,
  Chain,
  Token,
  LiFiStep
} from '@lifi/types'
import { useWallet } from './wallet'
import { parseUnits, formatUnits, type Address } from 'viem'
import { polygon } from 'viem/chains'
import { hyperliquid } from './wallet'
import { SUPPORTED_CHAINS, USDC_ADDRESSES, type SupportedChainId, initializeLiFi } from './lifi-config'

// Cross-chain operation types
export interface CrossChainTransferParams {
  fromChain: number
  toChain: number
  fromToken: string
  toToken: string
  amount: string
  fromAddress: Address
  toAddress: Address
  slippage?: number // percentage (e.g., 0.5 for 0.5%)
}

export interface BridgeQuote {
  route: Route
  fromAmount: string
  toAmount: string
  estimatedGas: string
  estimatedTime: number // in seconds
  priceImpact: number
  fees: {
    gas: string
    protocol: string
    lifi: string
  }
  steps: LiFiStep[]
}

// Token definitions for supported chains
const SUPPORTED_TOKENS = {
  // Polygon tokens
  [polygon.id]: {
    USDC: {
      address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin',
    },
    MATIC: {
      address: '0x0000000000000000000000000000000000001010',
      symbol: 'MATIC',
      decimals: 18,
      name: 'Matic Token',
    },
  },
  // Hyperliquid tokens
  [hyperliquid.id]: {
    USDC: {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Placeholder
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin',
    },
  },
}

export function useLiFiService() {
  const {
    address,
    chainId,
    isOnPolygon,
    isOnHyperliquid,
    signTransaction,
    switchToPolygon,
    switchToHyperliquid,
    walletClient,
  } = useWallet()

  // Initialize LiFi SDK
  React.useEffect(() => {
    initializeLiFi()
  }, [])

  // Get supported tokens for a chain
  const getSupportedTokens = (chainId: number) => {
    return SUPPORTED_TOKENS[chainId] || {}
  }

  // Get all supported chains
  const getSupportedChains = async (): Promise<Chain[]> => {
    try {
      const chains = await getChains()
      // Filter to only chains we support in our app
      const supportedChainIds = Object.keys(SUPPORTED_CHAINS).map(Number)
      return chains.filter(chain => supportedChainIds.includes(chain.id))
    } catch (error) {
      console.error('Failed to get supported chains:', error)
      return []
    }
  }

  // Get bridge quote
  const getBridgeQuote = async (params: CrossChainTransferParams): Promise<BridgeQuote> => {
    try {
      const routeRequest: RouteRequest = {
        fromChainId: params.fromChain,
        toChainId: params.toChain,
        fromTokenAddress: params.fromToken,
        toTokenAddress: params.toToken,
        fromAmount: parseUnits(params.amount, getSupportedTokens(params.fromChain).USDC?.decimals || 6).toString(),
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        options: {
          slippage: params.slippage || 0.5,
          allowSwitchChain: true,
          integrator: 'cognilabs-trading-app',
        },
      }

      const result = await getRoutes(routeRequest)

      if (!result.routes || result.routes.length === 0) {
        throw new Error('No routes found for this cross-chain transfer')
      }

      const bestRoute = result.routes[0]

      return {
        route: bestRoute,
        fromAmount: formatUnits(BigInt(bestRoute.fromAmount), getSupportedTokens(params.fromChain).USDC?.decimals || 6),
        toAmount: formatUnits(BigInt(bestRoute.toAmount), getSupportedTokens(params.toChain).USDC?.decimals || 6),
        estimatedGas: formatUnits(BigInt(bestRoute.gasCosts?.[0]?.estimate || '0'), 18),
        estimatedTime: bestRoute.steps.reduce((total, step) => total + (step.estimate?.executionDuration || 0), 0),
        priceImpact: bestRoute.steps.reduce((total, step) => total + (step.estimate?.priceImpact || 0), 0),
        fees: {
          gas: formatUnits(BigInt(bestRoute.gasCosts?.[0]?.estimate || '0'), 18),
          protocol: formatUnits(BigInt(bestRoute.fees?.reduce((total, fee) => total + BigInt(fee.amount), 0n) || '0'), 6),
          lifi: '0', // LiFi doesn't charge additional fees for basic bridging
        },
      }
    } catch (error) {
      console.error('Failed to get bridge quote:', error)
      throw error
    }
  }

  // Execute cross-chain transfer
  const executeCrossChainTransfer = async (quote: BridgeQuote): Promise<string> => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      // Ensure we're on the correct source chain
      if (chainId !== quote.route.fromChainId) {
        if (quote.route.fromChainId === polygon.id) {
          await switchToPolygon()
        } else if (quote.route.fromChainId === hyperliquid.id) {
          await switchToHyperliquid()
        }
      }

      // Execute the route using LiFi
      const execution = await executeRoute(walletClient, quote.route)

      return execution.txHash || ''
    } catch (error) {
      console.error('Failed to execute cross-chain transfer:', error)
      throw error
    }
  }

  // Get transfer status
  const getTransferStatus = async (txHash: string, bridge: string = 'lifi') => {
    try {
      const status = await getStatus({
        txHash,
        bridge,
      })

      return {
        status: status.status,
        txHash: status.txHash,
        sending: status.sending,
        receiving: status.receiving,
        gasUsed: status.gasUsed,
        explorerLinks: status.explorerLinks,
      }
    } catch (error) {
      console.error('Failed to get transfer status:', error)
      throw error
    }
  }

  // Helper: Transfer USDC from Polygon to Hyperliquid
  const transferUSDCToHyperliquid = async (amount: string, slippage?: number): Promise<BridgeQuote> => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    const polygonUSDC = SUPPORTED_TOKENS[polygon.id].USDC
    const hyperliquidUSDC = SUPPORTED_TOKENS[hyperliquid.id].USDC

    return getBridgeQuote({
      fromChain: polygon.id,
      toChain: hyperliquid.id,
      fromToken: polygonUSDC.address,
      toToken: hyperliquidUSDC.address,
      amount,
      fromAddress: address,
      toAddress: address,
      slippage,
    })
  }

  // Helper: Transfer USDC from Hyperliquid to Polygon
  const transferUSDCToPolygon = async (amount: string, slippage?: number): Promise<BridgeQuote> => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    const hyperliquidUSDC = SUPPORTED_TOKENS[hyperliquid.id].USDC
    const polygonUSDC = SUPPORTED_TOKENS[polygon.id].USDC

    return getBridgeQuote({
      fromChain: hyperliquid.id,
      toChain: polygon.id,
      fromToken: hyperliquidUSDC.address,
      toToken: polygonUSDC.address,
      amount,
      fromAddress: address,
      toAddress: address,
      slippage,
    })
  }

  // Check if cross-chain transfer is needed
  const needsCrossChainTransfer = (targetPlatform: 'polymarket' | 'hyperliquid'): boolean => {
    if (targetPlatform === 'polymarket' && !isOnPolygon) return true
    if (targetPlatform === 'hyperliquid' && !isOnHyperliquid) return true
    return false
  }

  // Get optimal transfer route for trading
  const getOptimalTransferRoute = async (
    targetPlatform: 'polymarket' | 'hyperliquid',
    requiredAmount: string
  ) => {
    if (!needsCrossChainTransfer(targetPlatform)) {
      return null // No transfer needed
    }

    try {
      if (targetPlatform === 'polymarket') {
        return await transferUSDCToPolygon(requiredAmount)
      } else {
        return await transferUSDCToHyperliquid(requiredAmount)
      }
    } catch (error) {
      console.error('Failed to get optimal transfer route:', error)
      throw error
    }
  }

  return {
    // Core functions
    getBridgeQuote,
    executeCrossChainTransfer,
    getTransferStatus,

    // Helper functions
    transferUSDCToHyperliquid,
    transferUSDCToPolygon,
    getOptimalTransferRoute,

    // Utility functions
    getSupportedTokens,
    getSupportedChains,
    needsCrossChainTransfer,

    // State
    isOnPolygon,
    isOnHyperliquid,
    address,
    chainId,
  }
}

// Hook for managing bridge quotes with auto-refresh
export function useBridgeQuote(params: CrossChainTransferParams | null, options?: {
  enabled?: boolean
  refreshInterval?: number
}) {
  const [quote, setQuote] = React.useState<BridgeQuote | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const { getBridgeQuote } = useLiFiService()

  React.useEffect(() => {
    if (!params || !options?.enabled) {
      setQuote(null)
      return
    }

    const fetchQuote = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getBridgeQuote(params)
        setQuote(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get quote')
        setQuote(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuote()

    // Auto-refresh if interval is set
    if (options?.refreshInterval) {
      const interval = setInterval(fetchQuote, options.refreshInterval)
      return () => clearInterval(interval)
    }
  }, [params, options?.enabled, options?.refreshInterval, getBridgeQuote])

  return { quote, isLoading, error, refetch: () => {
    if (params && options?.enabled) {
      // Trigger a manual refetch
    }
  }}
}

// Hook for tracking transfer status
export function useTransferStatus(txHash: string | null) {
  const [status, setStatus] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const { getTransferStatus } = useLiFiService()

  React.useEffect(() => {
    if (!txHash) {
      setStatus(null)
      return
    }

    const fetchStatus = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getTransferStatus(txHash)
        setStatus(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get status')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchStatus, 10000)
    return () => clearInterval(interval)
  }, [txHash, getTransferStatus])

  return { status, isLoading, error }
}

// Hook for managing cross-chain transfer workflow
export function useCrossChainTransfer() {
  const [isExecuting, setIsExecuting] = React.useState(false)
  const [txHash, setTxHash] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const { executeCrossChainTransfer } = useLiFiService()

  const execute = React.useCallback(async (quote: BridgeQuote) => {
    setIsExecuting(true)
    setError(null)
    setTxHash(null)

    try {
      const hash = await executeCrossChainTransfer(quote)
      setTxHash(hash)
      return hash
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transfer failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsExecuting(false)
    }
  }, [executeCrossChainTransfer])

  const reset = React.useCallback(() => {
    setIsExecuting(false)
    setTxHash(null)
    setError(null)
  }, [])

  return {
    execute,
    reset,
    isExecuting,
    txHash,
    error,
  }
}