import { useCallback, useEffect, useState } from 'react'
import { useWalletContext } from '@/contexts/WalletContext'
import { usePrivy } from '@privy-io/react-auth'
import { useSwitchChain } from 'wagmi'
import { polygon } from 'viem/chains'
import { toast } from 'sonner'

// Custom chain configuration for Hyperliquid
const hyperliquid = {
  id: 998,
  name: 'Hyperliquid',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
} as const

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
  isOnPolygon: boolean
  isOnHyperliquid: boolean

  // Actions
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchWallets: () => void
  switchToPolygon: () => Promise<void>
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

  const [balance, setBalance] = useState({ native: '0', usdc: '0' })
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // Fetch balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!activeWalletInfo?.address) {
        setBalance({ native: '0', usdc: '0' })
        return
      }

      setIsLoadingBalance(true)
      try {
        const response = await fetch(`/api/wallet/balance?address=${activeWalletInfo.address}`)
        if (response.ok) {
          const data = await response.json()
          setBalance({
            native: data.native || '0',
            usdc: data.usdc || '0',
          })
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      } finally {
        setIsLoadingBalance(false)
      }
    }

    fetchBalances()
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalances, 30000)
    return () => clearInterval(interval)
  }, [activeWalletInfo?.address])

  // Connect wallet (smart selection)
  const connect = useCallback(async () => {
    // If user has previously connected an external wallet, prefer that
    const preferredWallet = localStorage.getItem('preferredWallet')

    if (preferredWallet === 'external') {
      await connectExternal()
    } else {
      // Default to embedded for new users
      await connectEmbedded()
    }
  }, [connectEmbedded, connectExternal])

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
  const switchToPolygon = useCallback(async () => {
    try {
      await switchChain({ chainId: polygon.id })
      toast.success('Switched to Polygon')
    } catch (error) {
      console.error('Failed to switch to Polygon:', error)
      toast.error('Failed to switch to Polygon')
      throw error
    }
  }, [switchChain])

  const switchToHyperliquid = useCallback(async () => {
    try {
      await switchChain({ chainId: hyperliquid.id })
      toast.success('Switched to Hyperliquid')
    } catch (error) {
      console.error('Failed to switch to Hyperliquid:', error)
      toast.error('Failed to switch to Hyperliquid')
      throw error
    }
  }, [switchChain])

  // Computed values - fallback to user wallet from Privy if no wallet info
  const address = activeWalletInfo?.address || embeddedWallet?.address || externalWallet?.address || user?.wallet?.address || null
  const chainId = activeWalletInfo?.chainId || null
  const isConnected = authenticated && !!address
  const isEmbedded = activeWallet === 'embedded'
  const isOnPolygon = chainId === polygon.id
  const isOnHyperliquid = chainId === hyperliquid.id
  const showWalletSwitcher = canSwitchWallets
  const canTrade = isConnected && (isOnPolygon || isOnHyperliquid)
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
    isOnPolygon,
    isOnHyperliquid,

    // Actions
    connect,
    disconnect: disconnectWallets,
    switchWallets,
    switchToPolygon,
    switchToHyperliquid,

    // UI States
    showWalletSwitcher,
    canTrade,
    isLoading,
  }
}