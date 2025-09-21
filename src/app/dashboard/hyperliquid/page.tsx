'use client'

import { Suspense } from 'react'
import HyperliquidTerminal from '@/components/terminals/HyperliquidTerminal'

export default function HyperliquidPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30"></div>
        </div>
      }>
        <HyperliquidTerminal />
      </Suspense>
    </div>
  )
}