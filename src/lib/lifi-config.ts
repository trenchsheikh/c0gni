import { createConfig } from '@lifi/sdk'
import type { SDKConfig } from '@lifi/sdk'

// LiFi SDK Configuration
export const lifiConfig: SDKConfig = {
  integrator: 'cognilabs-trading-app',
  apiUrl: 'https://li.quest/v1',
  preloadChains: true,
  disableVersionCheck: false,
  routeOptions: {
    slippage: 0.03, // 3% default slippage
    order: 'RECOMMENDED',
    allowBridges: [], // Allow all bridges by default
    allowExchanges: [], // Allow all exchanges by default
  },
}

// Initialize LiFi SDK configuration
export function initializeLiFi() {
  try {
    createConfig(lifiConfig)
    console.log('LiFi SDK initialized successfully')
  } catch (error) {
    console.error('Failed to initialize LiFi SDK:', error)
  }
}

// Supported chain configurations for our app
export const SUPPORTED_CHAINS = {
  // Ethereum Mainnet
  1: {
    name: 'Ethereum',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
  },
  // Polygon
  137: {
    name: 'Polygon',
    nativeCurrency: 'MATIC',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
  },
  // Arbitrum
  42161: {
    name: 'Arbitrum',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://arbitrum-one-rpc.publicnode.com',
  },
  // Optimism
  10: {
    name: 'Optimism',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://optimism-rpc.publicnode.com',
  },
  // Base
  8453: {
    name: 'Base',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://base-rpc.publicnode.com',
  },
} as const

// USDC contract addresses on supported chains
export const USDC_ADDRESSES = {
  1: '0xA0b86a33E6417fD208B2FAD82d63B78Fc13D4A5B', // Ethereum
  137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // Polygon (USDC.e)
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // Optimism
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base
} as const

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS