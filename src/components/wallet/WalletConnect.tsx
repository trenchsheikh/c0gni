'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useWalletManager } from '@/hooks/useWalletManager'
import { walletUtils } from '@/lib/wallet'
import { ChevronDown, Loader2, Wallet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface WalletConnectProps {
  className?: string
  showChainSwitcher?: boolean
  showBalance?: boolean
}

export function WalletConnect({
  className = '',
  showChainSwitcher = true,
  showBalance = false
}: WalletConnectProps) {
  const [isSwitching, setIsSwitching] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const {
    chainId,
    isLoading,
    isConnected,
    isOnPolymarket,
    isOnHyperliquid,
    switchToPolymarket,
    switchToHyperliquid,
    connect,
  } = useWalletManager()

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
      toast.success('Successfully connected wallet')
    } catch (error) {
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSwitchChain = async (targetChain: 'polymarket' | 'hyperliquid') => {
    setIsSwitching(true)
    try {
      if (targetChain === 'polymarket') {
        await switchToPolymarket()
        toast.success('Successfully switched to Polymarket')
      } else {
        await switchToHyperliquid()
        toast.success('Successfully switched to Hyperliquid')
      }
    } catch (error) {
      toast.error(`Failed to switch to ${targetChain}`)
    } finally {
      setIsSwitching(false)
    }
  }

  // Loading state
  if (isLoading && !isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        <span className="text-sm text-zinc-500">Loading...</span>
      </div>
    )
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white transition-colors"
          disabled={isConnecting}
          onClick={handleConnect}
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          Connect Wallet
        </Button>
      </div>
    )
  }

  // Connected state
  const currentChain = walletUtils.getChainName(chainId || 0)

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Chain Badge / Switcher */}
      {showChainSwitcher && chainId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              disabled={isSwitching}
            >
              {isSwitching ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className={`h-2 w-2 rounded-full ${isOnPolymarket ? 'bg-purple-500' :
                    isOnHyperliquid ? 'bg-blue-500' :
                      'bg-zinc-500'
                  }`} />
              )}
              {currentChain}
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white">
            <DropdownMenuLabel className="text-zinc-400">Switch Network</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => handleSwitchChain('polymarket')}
              disabled={isOnPolymarket}
              className="focus:bg-white/10 focus:text-white cursor-pointer"
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
              Polymarket
              {isOnPolymarket && <Badge variant="secondary" className="ml-auto bg-white/10 text-white hover:bg-white/20">Current</Badge>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSwitchChain('hyperliquid')}
              disabled={isOnHyperliquid}
              className="focus:bg-white/10 focus:text-white cursor-pointer"
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
              Hyperliquid
              {isOnHyperliquid && <Badge variant="secondary" className="ml-auto bg-white/10 text-white hover:bg-white/20">Current</Badge>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}