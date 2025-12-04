'use client'

import dynamic from 'next/dynamic'

// Load component immediately without blocking - show UI shell first
const HyperliquidTerminal = dynamic(
  () => import('@/components/terminals/HyperliquidTerminal'),
  {
    ssr: false,
    // No loading state - component will show its own skeleton
  }
)

export default function HyperliquidPage() {
  return (
    <div className="space-y-6">
      <HyperliquidTerminal />
    </div>
  )
}