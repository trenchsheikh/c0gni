'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { http } from 'viem'
import { polygon } from 'viem/chains'
import { createConfig } from 'wagmi'
import { Toaster } from '@/components/ui/sonner'
import { WalletProvider } from '@/contexts/WalletContext'

// Custom chain configuration for Hyperliquid
const hyperliquid = {
  id: 998, // Hyperliquid Mainnet chain ID
  name: 'Hyperliquid',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HYPERLIQUID_RPC_URL || 'https://api.hyperliquid.xyz/info'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperliquid Explorer',
      url: 'https://app.hyperliquid.xyz',
    },
  },
} as const

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [polygon, hyperliquid],
  transports: {
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
    [hyperliquid.id]: http(process.env.NEXT_PUBLIC_HYPERLIQUID_RPC_URL),
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // Appearance settings
        appearance: {
          theme: 'dark',
          accentColor: '#00D2FF',
          logo: '/c0gni-c-white.svg',
          walletList: ['metamask', 'coinbase_wallet', 'rainbow', 'uniswap', 'phantom'],
        },

        // Authentication settings
        loginMethods: ['email', 'wallet', 'google', 'discord'],

        // Embedded wallet settings
        embeddedWallets: {
          createOnLogin: 'all-users',
          requireUserPasswordOnCreate: true,
          noPromptOnSignature: false,
        },

        // Supported chains
        supportedChains: [polygon, hyperliquid],

        // Default chain for new wallets
        defaultChain: polygon,

        // Additional settings
        mfa: {
          noPromptOnMfaRequired: false,
        },

        // Legal settings
        legal: {
          termsAndConditionsUrl: 'https://cognilabs.com/terms',
          privacyPolicyUrl: 'https://cognilabs.com/privacy',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}