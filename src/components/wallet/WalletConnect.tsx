'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useWallet, walletUtils } from '@/lib/wallet'
import { Wallet, ChevronDown, Copy, ExternalLink, Loader2 } from 'lucide-react'
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
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const {
    status,
    address,
    chainId,
    isEmbedded,
    ready,
    authenticated,
    isConnected,
    isOnPolygon,
    isOnHyperliquid,
    connectEmbeddedWallet,
    connectExternalWallet,
    disconnect,
    switchToPolygon,
    switchToHyperliquid,
    getWalletInfo,
  } = useWallet()

  const handleConnectEmbedded = async () => {
    setIsConnecting(true)
    try {
      await connectEmbeddedWallet()
      toast.success('Successfully connected to embedded wallet')
    } catch (error) {
      toast.error('Failed to connect embedded wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnectExternal = async () => {
    setIsConnecting(true)
    try {
      await connectExternalWallet()
      toast.success('Successfully connected external wallet')
    } catch (error) {
      toast.error('Failed to connect external wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast.success('Successfully disconnected wallet')
    } catch (error) {
      toast.error('Failed to disconnect wallet')
    }
  }

  const handleSwitchChain = async (targetChain: 'polygon' | 'hyperliquid') => {
    setIsSwitching(true)
    try {
      if (targetChain === 'polygon') {
        await switchToPolygon()
        toast.success('Successfully switched to Polygon')
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

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Wallet address copied to clipboard')
    }
  }

  const openExplorer = () => {
    if (address && chainId) {
      const url = walletUtils.getExplorerUrl(chainId, address)
      window.open(url, '_blank')
    }
  }

  // Loading state
  if (!ready) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  // Not connected state
  if (status === 'disconnected') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              Connect Wallet
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Choose Wallet Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleConnectEmbedded}>
              <Wallet className="mr-2 h-4 w-4" />
              Embedded Wallet
              <Badge variant="secondary" className="ml-auto">
                Recommended
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleConnectExternal}>
              <ExternalLink className="mr-2 h-4 w-4" />
              External Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Connected state
  const currentChain = walletUtils.getChainName(chainId || 0)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Chain Badge */}
      {showChainSwitcher && chainId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={isSwitching}
            >
              {isSwitching ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className={`h-2 w-2 rounded-full ${
                  isOnPolygon ? 'bg-purple-500' :
                  isOnHyperliquid ? 'bg-blue-500' :
                  'bg-gray-500'
                }`} />
              )}
              {currentChain}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleSwitchChain('polygon')}
              disabled={isOnPolygon}
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
              Polygon
              {isOnPolygon && <Badge variant="secondary" className="ml-auto">Current</Badge>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSwitchChain('hyperliquid')}
              disabled={isOnHyperliquid}
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
              Hyperliquid
              {isOnHyperliquid && <Badge variant="secondary" className="ml-auto">Current</Badge>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Wallet Address */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="font-mono">
              {walletUtils.formatAddress(address || '')}
            </span>
            {isEmbedded && (
              <Badge variant="outline" className="ml-1">
                Embedded
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Wallet Details</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground mb-1">Address</div>
            <div className="font-mono text-sm break-all">{address}</div>
          </div>

          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground mb-1">Network</div>
            <div className="text-sm">{currentChain}</div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View in Explorer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
            <Wallet className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}