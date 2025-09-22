'use client'

import React from 'react'
import { useWalletManager } from '@/hooks/useWalletManager'
import { useWalletContext } from '@/contexts/WalletContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Wallet,
  ChevronDown,
  Check,
  ExternalLink,
  Copy,
  ArrowRightLeft,
  Loader2,
  DollarSign,
  Shield,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'

interface WalletSwitcherProps {
  className?: string
}

export function WalletSwitcher({ className = '' }: WalletSwitcherProps) {
  const {
    address,
    isConnected,
    isEmbedded,
    embeddedAddress,
    externalAddress,
    balance,
    isOnPolygon,
    isOnHyperliquid,
    connect,
    disconnect,
    switchWallets,
    switchToPolygon,
    switchToHyperliquid,
    showWalletSwitcher,
    isLoading,
  } = useWalletManager()

  const { activeWallet, hasEmbeddedWallet, hasExternalWallet } = useWalletContext()

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = (addr: string) => {
    if (addr) {
      navigator.clipboard.writeText(addr)
      toast.success('Address copied to clipboard')
    }
  }

  const getChainName = () => {
    if (isOnPolygon) return 'Polygon'
    if (isOnHyperliquid) return 'Hyperliquid'
    return 'Unknown'
  }

  const getChainColor = () => {
    if (isOnPolygon) return 'bg-purple-500'
    if (isOnHyperliquid) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  // Not connected state
  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isLoading}
        className={`flex items-center gap-2 ${className}`}
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Chain Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getChainColor()}`} />
            {getChainName()}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Switch Chain</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={switchToPolygon}
            disabled={isOnPolygon}
            className="flex items-center gap-2"
          >
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            Polygon
            {isOnPolygon && <Check className="h-3 w-3 ml-auto" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={switchToHyperliquid}
            disabled={isOnHyperliquid}
            className="flex items-center gap-2"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Hyperliquid
            {isOnHyperliquid && <Check className="h-3 w-3 ml-auto" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wallet Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {isEmbedded ? (
              <Shield className="h-4 w-4 text-green-500" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            <span className="font-mono text-sm">{formatAddress(address || '')}</span>
            {isEmbedded && (
              <Badge variant="secondary" className="text-xs">
                Secure
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Active Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Current Wallet Info */}
          <div className="px-2 py-3 space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Address</div>
              <div className="font-mono text-sm break-all">{address}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Balance</div>
                <div className="text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {parseFloat(balance.usdc).toFixed(2)} USDC
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Type</div>
                <div className="text-sm font-medium">
                  {isEmbedded ? 'Embedded' : 'External'}
                </div>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Wallet Options */}
          {showWalletSwitcher && (
            <>
              <DropdownMenuLabel>Available Wallets</DropdownMenuLabel>

              {hasEmbeddedWallet && (
                <DropdownMenuItem
                  onClick={() => activeWallet === 'external' && switchWallets()}
                  disabled={activeWallet === 'embedded'}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <div className="font-medium">Embedded Wallet</div>
                    <div className="text-xs text-muted-foreground">
                      {formatAddress(embeddedAddress || '')}
                    </div>
                  </div>
                  {activeWallet === 'embedded' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              )}

              {hasExternalWallet && (
                <DropdownMenuItem
                  onClick={() => activeWallet === 'embedded' && switchWallets()}
                  disabled={activeWallet === 'external'}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">External Wallet</div>
                    <div className="text-xs text-muted-foreground">
                      {formatAddress(externalAddress || '')}
                    </div>
                  </div>
                  {activeWallet === 'external' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
            </>
          )}

          {/* Actions */}
          <DropdownMenuItem
            onClick={() => copyAddress(address || '')}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Address
          </DropdownMenuItem>

          {showWalletSwitcher && (
            <DropdownMenuItem
              onClick={switchWallets}
              className="flex items-center gap-2"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Switch Wallet
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              const url = isOnPolygon
                ? `https://polygonscan.com/address/${address}`
                : `https://app.hyperliquid.xyz/address/${address}`
              window.open(url, '_blank')
            }}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View in Explorer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={disconnect}
            className="text-red-600 flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}