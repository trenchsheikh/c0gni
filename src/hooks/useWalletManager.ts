import { useCallback, useEffect, useState } from 'react'
import { useWalletContext } from '@/contexts/WalletContext'
import { usePrivy } from '@privy-io/react-auth'
import { useSwitchChain, useAccount } from 'wagmi'
import { polygon } from 'viem/chains'
import { toast } from 'sonner'
import { hyperliquid } from '@/lib/wallet'

interface UseWalletManagerReturn {
  // Current wallet state
  address: string | null
  isConnected: boolean
  isEmbedded: boolean
  chainId: number | null

  // Both wallets
  embeddedAddress: string | null
  externalAddress: string | null

  // Balances
  balance: {
    native: string
    usdc: string
  }

  // Chain states
  isOnPolymarket: boolean
  isOnHyperliquid: boolean

  // Actions
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchWallets: () => void
  switchToPolymarket: () => Promise<void>
  switchToHyperliquid: () => Promise<void>

  // UI States
  showWalletSwitcher: boolean
  canTrade: boolean
  isLoading: boolean
}

export function useWalletManager(): UseWalletManagerReturn {
  const {
    activeWalletInfo,
    embeddedWallet,
    externalWallet,
    activeWallet,
    switchWallet,
    connectEmbedded,
    connectExternal,
    disconnect: disconnectWallets,
    canSwitchWallets,
    isConnecting,
    isReady,
  } = useWalletContext()

  const { authenticated, user } = usePrivy()
  const { switchChain } = useSwitchChain()
  const { isConnected: wagmiConnected, chainId: wagmiChainId } = useAccount()

  const [balance, setBalance] = useState({ native: '0', usdc: '0' })
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // Fetch balances - deferred and non-blocking, only for current chain
  useEffect(() => {
    if (!activeWalletInfo?.address) {
      setBalance({ native: '0', usdc: '0' })
      return
    }

    let intervalId: NodeJS.Timeout | null = null
    let isCancelled = false

    // Defer balance fetching to avoid blocking initial render
    const timer = setTimeout(() => {
      if (isCancelled) return

      const fetchBalances = async () => {
        if (isCancelled) return
        setIsLoadingBalance(true)
        try {
          // Only fetch for current chain to avoid slow multi-chain queries
          const chainId = activeWalletInfo?.chainId || 137 // Default to Polygon
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
          
          const response = await fetch(`/api/wallet/balance?address=${activeWalletInfo.address}&chainId=${chainId}`, {
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          
          if (isCancelled) return
          
          if (response.ok) {
            const data = await response.json()
            // Extract balance from chain-specific response
            const chainData = data.chains?.[0] || data
            const usdcToken = chainData.tokens?.find((t: any) => t.symbol === 'USDC')
            
            if (!isCancelled) {
              setBalance({
                native: chainData.native?.balance || '0',
                usdc: usdcToken?.balance || '0',
              })
            }
          }
        } catch (error: any) {
          // Silently fail - don't log timeout/abort errors
          if (!isCancelled && error.name !== 'AbortError' && error.name !== 'TimeoutError') {
            console.error('Failed to fetch balance:', error)
          }
          // Set default values on error
          if (!isCancelled) {
            setBalance({ native: '0', usdc: '0' })
          }
        } finally {
          if (!isCancelled) {
            setIsLoadingBalance(false)
          }
        }
      }

      fetchBalances()
      // Refresh every 60 seconds (less frequent to reduce load)
      intervalId = setInterval(fetchBalances, 60000)
    }, 1000) // Wait 1 second after mount before fetching

    return () => {
      isCancelled = true
      clearTimeout(timer)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [activeWalletInfo?.address, activeWalletInfo?.chainId])

  // Connect wallet - always default to embedded (no persistence)
  const connect = useCallback(async () => {
    // Always default to embedded wallet - no persistence of preferences
    await connectEmbedded()
  }, [connectEmbedded])

  // Switch between wallets
  const switchWallets = useCallback(() => {
    if (!canSwitchWallets) {
      toast.error('Both wallet types need to be connected to switch')
      return
    }

    const newType = activeWallet === 'embedded' ? 'external' : 'embedded'
    switchWallet(newType)
  }, [activeWallet, canSwitchWallets, switchWallet])

  // Chain switching
  const switchToPolymarket = useCallback(async () => {
    try {
      await switchChain({ chainId: polygon.id })
      toast.success('Switched to Polymarket')
    } catch (error) {
      console.error('Failed to switch to Polymarket:', error)
      toast.error('Failed to switch to Polymarket')
      throw error
    }
  }, [switchChain])

  const switchToHyperliquid = useCallback(async () => {
    try {
      await switchChain({ chainId: hyperliquid.id })
      toast.success('Switched to Hyperliquid')
    } catch (error: any) {
      console.error('Failed to switch to Hyperliquid:', error)
      // Try adding the chain if switch fails
      try {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${hyperliquid.id.toString(16)}`,
              chainName: hyperliquid.name,
              nativeCurrency: hyperliquid.nativeCurrency,
              rpcUrls: hyperliquid.rpcUrls.default.http,
              blockExplorerUrls: [hyperliquid.blockExplorers.default.url],
            }],
          })
          toast.success('Added and switched to Hyperliquid')
        } else {
          toast.error('Failed to switch network: Wallet not supported')
        }
      } catch (addError) {
        console.error('Failed to add Hyperliquid chain:', addError)
        toast.error('Failed to switch to Hyperliquid')
      }
    }
  }, [switchChain])

  // Computed values - fallback to user wallet from Privy if no wallet info
  const address = activeWalletInfo?.address || embeddedWallet?.address || externalWallet?.address || user?.wallet?.address || null

  // Use Wagmi chain ID directly if we're using an external wallet for immediate updates
  const chainId = (activeWallet === 'external' && wagmiConnected && wagmiChainId)
    ? wagmiChainId
    : (activeWalletInfo?.chainId || null)

  // Fix: Don't require 'authenticated' for isConnected if we have a valid address from activeWalletInfo
  // This handles cases where Wagmi is connected but Privy auth state might be lagging or different
  const isConnected = !!address && (activeWalletInfo?.isConnected || authenticated)

  const isEmbedded = activeWallet === 'embedded'
  const isOnPolymarket = chainId === polygon.id
  const isOnHyperliquid = chainId === hyperliquid.id
  const showWalletSwitcher = canSwitchWallets
  const canTrade = isConnected && (isOnPolymarket || isOnHyperliquid)
  const isLoading = isConnecting || !isReady || isLoadingBalance

  return {
    // Current wallet state
    address,
    isConnected,
    isEmbedded,
    chainId,

    // Both wallets
    embeddedAddress: embeddedWallet?.address || null,
    externalAddress: externalWallet?.address || null,

    // Balances
    balance,

    // Chain states
    isOnPolymarket,
    isOnHyperliquid,

    // Actions
    connect,
    disconnect: disconnectWallets,
    switchWallets,
    switchToPolymarket,
    switchToHyperliquid,

    // UI States
    showWalletSwitcher,
    canTrade,
    isLoading,
  }
}