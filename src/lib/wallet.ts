import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useWalletClient, useAccount, useSwitchChain } from 'wagmi'
import { polygon } from 'viem/chains'

// Custom chain configuration for Hyperliquid
export const hyperliquid = {
  id: 999,
  name: 'Hyperliquid',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HYPERLIQUID_RPC_URL || 'https://rpc.hyperliquid.xyz/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperliquid Explorer',
      url: 'https://app.hyperliquid.xyz',
    },
  },
} as const

// Wallet connection status
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface WalletState {
  status: WalletStatus
  address?: string
  chainId?: number
  balance?: string
  isEmbedded?: boolean
}

// Custom hook for wallet management
export function useWallet() {
  const { ready, authenticated, user, login, logout, connectWallet, createWallet } = usePrivy()
  const { wallets } = useWallets()
  const { address, chainId, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()

  // Get the primary wallet
  const primaryWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const externalWallet = wallets.find(wallet => wallet.walletClientType !== 'privy')

  // Wallet state
  const walletState: WalletState = {
    status: !ready ? 'connecting' :
      authenticated && isConnected ? 'connected' :
        authenticated && !isConnected ? 'error' :
          'disconnected',
    address: address,
    chainId: chainId,
    isEmbedded: !!embeddedWallet,
  }

  // Connect wallet functions
  const connectEmbeddedWallet = async () => {
    try {
      if (!authenticated) {
        await login()
      }

      if (!embeddedWallet && user) {
        await createWallet()
      }
    } catch (error) {
      console.error('Failed to connect embedded wallet:', error)
      throw error
    }
  }

  const connectExternalWallet = async () => {
    try {
      await connectWallet()
    } catch (error) {
      console.error('Failed to connect external wallet:', error)
      throw error
    }
  }

  const disconnect = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      throw error
    }
  }

  // Chain switching
  const switchToPolygon = async () => {
    try {
      await switchChain({ chainId: polygon.id })
    } catch (error) {
      console.error('Failed to switch to Polygon:', error)
      throw error
    }
  }

  const switchToHyperliquid = async () => {
    try {
      await switchChain({ chainId: hyperliquid.id })
    } catch (error) {
      console.error('Failed to switch to Hyperliquid:', error)
      throw error
    }
  }

  // Sign transaction
  const signTransaction = async (transaction: any) => {
    if (!walletClient) {
      throw new Error('Wallet client not available')
    }

    try {
      return await walletClient.sendTransaction(transaction)
    } catch (error) {
      console.error('Failed to sign transaction:', error)
      throw error
    }
  }

  // Sign message
  const signMessage = async (message: string) => {
    if (!walletClient) {
      throw new Error('Wallet client not available')
    }

    try {
      return await walletClient.signMessage({ message })
    } catch (error) {
      console.error('Failed to sign message:', error)
      throw error
    }
  }

  // Get wallet info
  const getWalletInfo = () => {
    return {
      primary: primaryWallet,
      embedded: embeddedWallet,
      external: externalWallet,
      all: wallets,
      user: user,
    }
  }

  // Check if on correct chain for platform
  const isOnPolygon = chainId === polygon.id
  const isOnHyperliquid = chainId === hyperliquid.id

  return {
    // State
    ...walletState,
    ready,
    authenticated,
    isConnected,
    isOnPolygon,
    isOnHyperliquid,

    // Connection functions
    connectEmbeddedWallet,
    connectExternalWallet,
    disconnect,

    // Chain functions
    switchToPolygon,
    switchToHyperliquid,

    // Transaction functions
    signTransaction,
    signMessage,

    // Wallet info
    getWalletInfo,
    walletClient,
  }
}

// Utility functions for wallet operations
export const walletUtils = {
  // Format address for display
  formatAddress: (address: string, length = 4) => {
    if (!address) return ''
    return `${address.slice(0, length + 2)}...${address.slice(-length)}`
  },

  // Format balance for display
  formatBalance: (balance: string | number, decimals = 4) => {
    const num = typeof balance === 'string' ? parseFloat(balance) : balance
    return num.toFixed(decimals)
  },

  // Validate Ethereum address
  isValidAddress: (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  },

  // Get chain name
  getChainName: (chainId: number) => {
    switch (chainId) {
      case polygon.id: return 'Polymarket'
      case hyperliquid.id: return 'Hyperliquid'
      default: return 'Unknown'
    }
  },

  // Get explorer URL
  getExplorerUrl: (chainId: number, address: string, type: 'address' | 'tx' = 'address') => {
    switch (chainId) {
      case polygon.id:
        return `https://polygonscan.com/${type}/${address}`
      case hyperliquid.id:
        return `https://app.hyperliquid.xyz/${type}/${address}`
      default:
        return '#'
    }
  },
}