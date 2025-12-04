'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';

// Lazy load the actual terminal component at module level
const PolymarketTerminal = lazy(() => import('@/components/terminals/PolymarketTerminal'));

// Shell component that renders instantly - minimal hooks, no blocking operations
export default function PolymarketTerminalShell() {
  const [shouldLoad, setShouldLoad] = useState(false);

  // Load the actual component after first paint - use microtask
  useEffect(() => {
    Promise.resolve().then(() => {
      setShouldLoad(true);
    });
  }, []);

  // Render shell immediately - this renders synchronously
  if (!shouldLoad) {
    return (
      <div className="space-y-6">
        {/* Header - Always visible immediately */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Polymarket Terminal</h1>
            <p className="text-white/60">Trade prediction markets with real-time data</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-10 bg-white/10 rounded-2xl animate-pulse"></div>
            <div className="w-24 h-10 bg-white/10 rounded-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
          {['Markets', 'Positions', 'Orders', 'Bridge'].map((tab) => (
            <button
              key={tab}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 bg-white/15 text-white"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area - Skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-white/10 rounded-2xl animate-pulse"></div>
              <div className="w-32 h-12 bg-white/10 rounded-2xl animate-pulse"></div>
            </div>

            {/* Markets Grid Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-20 bg-white/10 rounded-xl"></div>
                    <div className="h-20 bg-white/10 rounded-xl"></div>
                  </div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-white/10 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Load actual component after shell is visible
  return (
    <Suspense fallback={null}>
      <PolymarketTerminal />
    </Suspense>
  );
}

