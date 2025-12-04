'use client'

import { Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, DollarSign, Clock, Target } from "lucide-react";
import { CrossChainBridge } from '@/components/bridge/CrossChainBridge';
import { WalletConnect } from '@/components/wallet/WalletConnect';

const bridgeStats = [
  {
    title: "Total Bridged",
    value: "$24,680.50",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Avg Bridge Time",
    value: "3.2 min",
    icon: Clock,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Success Rate",
    value: "99.8%",
    icon: Target,
    color: "from-purple-500 to-pink-500"
  }
];

const recentBridges = [
  { amount: "$1,200", from: "Polygon", to: "Hyperliquid", time: "1 hour ago", status: "completed" },
  { amount: "$850", from: "Hyperliquid", to: "Polygon", time: "3 hours ago", status: "completed" },
  { amount: "$2,400", from: "Polygon", to: "Hyperliquid", time: "1 day ago", status: "completed" },
];

export default function BridgePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-light text-white mb-2">Cross-Chain Bridge</h1>
          <p className="text-white/60">Transfer USDC seamlessly between Polygon and Hyperliquid</p>
        </div>
        <WalletConnect showChainSwitcher={true} />
      </motion.div>

      {/* Bridge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bridgeStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{stat.title}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Bridge Interface */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Bridge Component */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30"></div>
            </div>
          }>
            <CrossChainBridge />
          </Suspense>
        </motion.div>

        {/* Recent Bridges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Recent Bridges</h3>
          <div className="space-y-4">
            {recentBridges.map((bridge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="p-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{bridge.amount}</p>
                  <span className="text-green-400 text-xs">✓ {bridge.status}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>{bridge.from}</span>
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>{bridge.to}</span>
                </div>
                <p className="text-white/40 text-xs mt-1">{bridge.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bridge Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">About Cross-Chain Transfers</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-white font-medium mb-3">How it works</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>• Powered by LiFi protocol for secure transfers</li>
              <li>• Automatic route optimization for best rates</li>
              <li>• Real-time gas estimation and slippage protection</li>
              <li>• End-to-end transaction monitoring</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Supported Networks</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-white/60 text-sm">Polygon - For Polymarket trading</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-white/60 text-sm">Hyperliquid - For perpetual trading</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}