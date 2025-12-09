'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { http } from 'viem'
import { polygon } from 'viem/chains'
import { createConfig } from 'wagmi'
import { Toaster } from '@/components/ui/sonner'
import { WalletProvider } from '@/contexts/WalletContext'
import { hyperliquid } from '@/lib/wallet'

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [polygon, hyperliquid],
  transports: {
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
    [hyperliquid.id]: http(process.env.NEXT_PUBLIC_HYPERLIQUID_RPC_URL || 'https://rpc.hyperliquid.xyz/evm'),
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optimize caching for better performance
        staleTime: 30 * 1000, // 30 seconds default stale time
        gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time (formerly cacheTime)
        refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
        refetchOnMount: true, // Refetch on mount to ensure fresh data
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      },
    },
  }))

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // Appearance settings
        appearance: {
          theme: 'dark', // Keep Privy dark for now or make dynamic later
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WagmiProvider config={wagmiConfig}>
            <WalletProvider>
              {children}
            <Toaster />
            </WalletProvider>
          </WagmiProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}