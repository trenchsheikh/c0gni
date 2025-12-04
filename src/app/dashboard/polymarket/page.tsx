'use client'

// Import shell component directly - renders instantly with no async operations
import PolymarketTerminalShell from '@/components/terminals/PolymarketTerminalShell'

export default function PolymarketPage() {
  return (
    <div className="space-y-6">
      <PolymarketTerminalShell />
    </div>
  )
}