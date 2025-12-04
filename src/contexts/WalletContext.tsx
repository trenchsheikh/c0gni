'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, startTransition } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useAccount, useWalletClient, useDisconnect } from 'wagmi'
import { polygon } from 'viem/chains'
import { toast } from 'sonner'

export type WalletType = 'embedded' | 'external'

interface WalletInfo {
  address: string
  type: WalletType
  chainId: number
  balance?: {
    native: string
    usdc?: string
  }
  isConnected: boolean
}

interface WalletContextType {
  // Active wallet
  activeWallet: WalletType
  activeWalletInfo: WalletInfo | null

  // Both wallets
  embeddedWallet: WalletInfo | null
  externalWallet: WalletInfo | null

  // Connection states
  isConnecting: boolean
  isReady: boolean

  // Actions
  switchWallet: (type: WalletType) => void
  connectEmbedded: () => Promise<void>
  connectExternal: () => Promise<void>
  disconnect: () => Promise<void>
  refreshBalances: () => Promise<void>

  // Utilities
  hasEmbeddedWallet: boolean
  hasExternalWallet: boolean
  canSwitchWallets: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout, connectWallet, createWallet } = usePrivy()
  const { wallets } = useWallets()
  const { address: wagmiAddress, isConnected: wagmiConnected, chainId: wagmiChainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { disconnect: wagmiDisconnect } = useDisconnect()

  const [activeWallet, setActiveWallet] = useState<WalletType>('embedded')
  const [isConnecting, setIsConnecting] = useState(false)
  const [embeddedInfo, setEmbeddedInfo] = useState<WalletInfo | null>(null)
  const [externalInfo, setExternalInfo] = useState<WalletInfo | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Get wallet instances from Privy
  const privyEmbedded = wallets.find(w => w.walletClientType === 'privy')
  const privyExternal = wallets.find(w => w.walletClientType !== 'privy')

  // Debug logging
  useEffect(() => {
    console.log('WalletContext Debug:', {
      ready,
      authenticated,
      userAddress: user?.wallet?.address,
      wagmiAddress,
      wagmiConnected,
      wagmiChainId,
      walletsCount: wallets.length,
      wallets: wallets.map(w => ({ type: w.walletClientType, address: w.address })),
      embeddedInfo,
      externalInfo,
      activeWallet
    })
  }, [ready, authenticated, user, wagmiAddress, wagmiConnected, wagmiChainId, wallets, embeddedInfo, externalInfo, activeWallet])

  // Mark as mounted after first render
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load saved wallet preference - only after mount
  useEffect(() => {
    if (!isMounted) return
    const saved = localStorage.getItem('preferredWallet')
    if (saved === 'external' || saved === 'embedded') {
      startTransition(() => {
        setActiveWallet(saved)
      })
    }
  }, [isMounted])

  // Update embedded wallet info - deferred after mount
  useEffect(() => {
    if (!isMounted) return
    startTransition(() => {
      if (authenticated && privyEmbedded?.address) {
        setEmbeddedInfo({
          address: privyEmbedded.address,
          type: 'embedded',
          chainId: Number(privyEmbedded.chainId) || polygon.id,
          isConnected: true,
        })
      } else if (authenticated && user?.wallet?.address) {
        // Check if user has an embedded wallet from email login
        setEmbeddedInfo({
          address: user.wallet.address,
          type: 'embedded',
          chainId: polygon.id,
          isConnected: true,
        })
      } else {
        setEmbeddedInfo(null)
      }
    })
  }, [isMounted, privyEmbedded, authenticated, user])

  // Update external wallet info - deferred after mount
  useEffect(() => {
    if (!isMounted) return
    startTransition(() => {
      if (privyExternal?.address || (wagmiAddress && wagmiConnected)) {
        const address = privyExternal?.address || wagmiAddress
        if (address) {
          // Prefer Wagmi chainId if available and we are using the external wallet
          // This ensures immediate UI updates when switching chains
          const currentChainId = wagmiChainId || Number(privyExternal?.chainId) || polygon.id

          setExternalInfo({
            address,
            type: 'external',
            chainId: currentChainId,
            isConnected: true,
          })
        }
      } else {
        setExternalInfo(null)
      }
    })
  }, [isMounted, privyExternal, wagmiAddress, wagmiConnected, wagmiChainId])

  // Connect embedded wallet
  const connectEmbedded = useCallback(async () => {
    setIsConnecting(true)
    try {
      if (!authenticated) {
        await login()
      }

      // Create embedded wallet if it doesn't exist
      if (!privyEmbedded && user) {
        await createWallet()
        toast.success('Embedded wallet created successfully')
      }

      setActiveWallet('embedded')
      localStorage.setItem('preferredWallet', 'embedded')
    } catch (error) {
      console.error('Failed to connect embedded wallet:', error)
      toast.error('Failed to connect embedded wallet')
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [authenticated, login, privyEmbedded, user, createWallet])

  // Connect external wallet
  const connectExternal = useCallback(async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
      setActiveWallet('external')
      localStorage.setItem('preferredWallet', 'external')
      toast.success('External wallet connected successfully')
    } catch (error) {
      console.error('Failed to connect external wallet:', error)
      toast.error('Failed to connect external wallet')
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [connectWallet])

  // Switch between wallets
  const switchWallet = useCallback((type: WalletType) => {
    if (type === 'embedded' && !embeddedInfo) {
      toast.error('No embedded wallet available')
      return
    }
    if (type === 'external' && !externalInfo) {
      toast.error('No external wallet connected')
      return
    }

    setActiveWallet(type)
    localStorage.setItem('preferredWallet', type)
    toast.success(`Switched to ${type} wallet`)
  }, [embeddedInfo, externalInfo])

  // Disconnect all wallets
  const disconnect = useCallback(async () => {
    try {
      await logout()
      wagmiDisconnect()
      setEmbeddedInfo(null)
      setExternalInfo(null)
      localStorage.removeItem('preferredWallet')
      toast.success('Disconnected successfully')
    } catch (error) {
      console.error('Failed to disconnect:', error)
      toast.error('Failed to disconnect')
      throw error
    }
  }, [logout, wagmiDisconnect])

  // Refresh balances for both wallets
  const refreshBalances = useCallback(async () => {
    // This will be implemented with actual balance fetching
    // For now, it's a placeholder
    console.log('Refreshing balances...')
  }, [])

  // Get active wallet info with fallback logic
  let activeWalletInfo = activeWallet === 'embedded' ? embeddedInfo : externalInfo

  // Fallback: if no wallet info but user is authenticated with a wallet
  if (!activeWalletInfo && authenticated && user?.wallet?.address) {
    activeWalletInfo = {
      address: user.wallet.address,
      type: 'embedded' as WalletType,
      chainId: polygon.id,
      isConnected: true
    }
  }

  // Fallback: if using wagmi and it has an address
  if (!activeWalletInfo && wagmiAddress && wagmiConnected) {
    activeWalletInfo = {
      address: wagmiAddress,
      type: 'external' as WalletType,
      chainId: wagmiChainId || polygon.id,
      isConnected: true
    }
  }

  // Utility flags
  const hasEmbeddedWallet = !!embeddedInfo || (authenticated && !!user?.wallet?.address)
  const hasExternalWallet = !!externalInfo || (wagmiConnected && !!wagmiAddress)
  const canSwitchWallets = hasEmbeddedWallet && hasExternalWallet

  const value: WalletContextType = {
    activeWallet,
    activeWalletInfo,
    embeddedWallet: embeddedInfo,
    externalWallet: externalInfo,
    isConnecting,
    isReady: ready,
    switchWallet,
    connectEmbedded,
    connectExternal,
    disconnect,
    refreshBalances,
    hasEmbeddedWallet,
    hasExternalWallet,
    canSwitchWallets,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider')
  }
  return context
}