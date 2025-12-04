'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useWalletContext } from '@/contexts/WalletContext';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { disconnect, isReady } = useWalletContext();
  const hasDisconnected = useRef(false);

  // Disconnect wallet on dashboard entry - only once per mount
  useEffect(() => {
    if (isReady && !hasDisconnected.current) {
      hasDisconnected.current = true;
      // Disconnect wallets and clear any stored preferences
      disconnect().catch(() => {
        // Silently handle errors - wallet might already be disconnected
      });
      // Clear localStorage preferences
      localStorage.removeItem('preferredWallet');
    }
  }, [isReady, disconnect]);

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex">
      <DashboardSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <motion.main
        initial={false}
        animate={{
          marginLeft: isCollapsed ? "80px" : "280px"
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-h-screen"
      >
        <div className="p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

// Named export for backwards compatibility
export { DashboardLayoutWrapper };