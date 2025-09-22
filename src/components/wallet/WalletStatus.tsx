'use client'

import React from 'react'
import { useWalletManager } from '@/hooks/useWalletManager'
import { useWalletContext } from '@/contexts/WalletContext'
import { usePrivy } from '@privy-io/react-auth'

export function WalletStatus() {
  const {
    address,
    isConnected,
    embeddedAddress,
    externalAddress,
    balance
  } = useWalletManager()

  const {
    activeWallet,
    embeddedWallet,
    externalWallet,
    activeWalletInfo
  } = useWalletContext()

  const { authenticated, user } = usePrivy()

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
      <div className="font-bold mb-2">Wallet Debug Status:</div>
      <div>Authenticated: {authenticated ? '✅' : '❌'}</div>
      <div>Connected: {isConnected ? '✅' : '❌'}</div>
      <div>Active Wallet: {activeWallet}</div>
      <div>Active Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</div>
      <div>Embedded: {embeddedAddress ? `${embeddedAddress.slice(0, 6)}...` : 'None'}</div>
      <div>External: {externalAddress ? `${externalAddress.slice(0, 6)}...` : 'None'}</div>
      <div>User Email: {user?.email?.address || 'None'}</div>
      <div>User Wallet: {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...` : 'None'}</div>
      <div>USDC Balance: ${balance.usdc}</div>
    </div>
  )
}