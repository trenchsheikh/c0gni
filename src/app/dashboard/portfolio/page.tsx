'use client'

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  PieChart,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Percent,
  Activity,
  Eye
} from "lucide-react";
import { WalletConnect } from "@/components/wallet/WalletConnect";

// Mock portfolio data
const portfolioSummary = {
  totalValue: 12847.50,
  totalPnL: 2340.25,
  totalPnLPercent: 22.3,
  polymarketValue: 4650.25,
  hyperliquidValue: 8197.25,
  dayChange: 435.80,
  dayChangePercent: 3.5
};

const polymarketPositions = [
  {
    market: "2024 US Presidential Election",
    side: "YES",
    shares: 125,
    avgPrice: 0.67,
    currentPrice: 0.72,
    value: 90.00,
    pnl: 6.25,
    pnlPercent: 7.5,
    category: "Politics"
  },
  {
    market: "Bitcoin above $100k by EOY",
    side: "NO",
    shares: 200,
    avgPrice: 0.35,
    currentPrice: 0.28,
    value: 56.00,
    pnl: -14.00,
    pnlPercent: -20.0,
    category: "Crypto"
  },
  {
    market: "AI Breakthrough in 2024",
    side: "YES",
    shares: 75,
    avgPrice: 0.55,
    currentPrice: 0.61,
    value: 45.75,
    pnl: 4.50,
    pnlPercent: 10.9,
    category: "Technology"
  }
];

const hyperliquidPositions = [
  {
    symbol: "ETH-PERP",
    side: "Long",
    size: 2.5,
    entryPrice: 2420.50,
    markPrice: 2485.30,
    notional: 6213.25,
    pnl: 161.00,
    pnlPercent: 2.65,
    leverage: 3.2,
    margin: 1942.00
  },
  {
    symbol: "BTC-PERP",
    side: "Short",
    size: 0.08,
    entryPrice: 68500.00,
    markPrice: 67820.00,
    notional: 5425.60,
    pnl: 54.40,
    pnlPercent: 1.01,
    leverage: 2.8,
    margin: 1937.71
  },
  {
    symbol: "SOL-PERP",
    side: "Long",
    size: 25,
    entryPrice: 95.20,
    markPrice: 92.80,
    notional: 2320.00,
    pnl: -60.00,
    pnlPercent: -2.52,
    leverage: 4.1,
    margin: 565.85
  }
];

const PortfolioMetrics = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      {
        title: "Total Portfolio",
        value: `$${portfolioSummary.totalValue.toLocaleString()}`,
        change: `+$${portfolioSummary.totalPnL.toFixed(2)}`,
        percent: `+${portfolioSummary.totalPnLPercent}%`,
        icon: DollarSign,
        trend: "up" as const
      },
      {
        title: "24h Change",
        value: `+$${portfolioSummary.dayChange.toFixed(2)}`,
        change: `+${portfolioSummary.dayChangePercent}%`,
        percent: "vs yesterday",
        icon: TrendingUp,
        trend: "up" as const
      },
      {
        title: "Polymarket",
        value: `$${portfolioSummary.polymarketValue.toLocaleString()}`,
        change: `${((portfolioSummary.polymarketValue / portfolioSummary.totalValue) * 100).toFixed(1)}%`,
        percent: "of portfolio",
        icon: Target,
        trend: "neutral" as const
      },
      {
        title: "Hyperliquid",
        value: `$${portfolioSummary.hyperliquidValue.toLocaleString()}`,
        change: `${((portfolioSummary.hyperliquidValue / portfolioSummary.totalValue) * 100).toFixed(1)}%`,
        percent: "of portfolio",
        icon: BarChart3,
        trend: "neutral" as const
      }
    ].map((metric, index) => (
      <motion.div
        key={metric.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${
            metric.trend === 'up' ? 'bg-green-500/20' :
            metric.trend === 'down' ? 'bg-red-500/20' :
            'bg-blue-500/20'
          }`}>
            <metric.icon className={`w-6 h-6 ${
              metric.trend === 'up' ? 'text-green-400' :
              metric.trend === 'down' ? 'text-red-400' :
              'text-blue-400'
            }`} />
          </div>
          <div className={`text-sm ${
            metric.trend === 'up' ? 'text-green-400' :
            metric.trend === 'down' ? 'text-red-400' :
            'text-white/60'
          }`}>
            {metric.change}
          </div>
        </div>
        <h3 className="text-white/60 text-sm font-medium">{metric.title}</h3>
        <p className="text-white text-2xl font-bold mt-1">{metric.value}</p>
        <p className="text-white/50 text-sm mt-1">{metric.percent}</p>
      </motion.div>
    ))}
  </div>
);

const PolymarketTable = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-medium text-white">Polymarket Positions</h3>
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <Target className="w-4 h-4" />
        {polymarketPositions.length} active positions
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-white/60 text-sm font-medium py-3">Market</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Side</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Shares</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Avg Price</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Current</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Value</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">P&L</th>
          </tr>
        </thead>
        <tbody>
          {polymarketPositions.map((position, index) => (
            <motion.tr
              key={position.market}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-4">
                <div>
                  <p className="text-white text-sm font-medium">{position.market}</p>
                  <p className="text-white/60 text-xs">{position.category}</p>
                </div>
              </td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  position.side === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {position.side}
                </span>
              </td>
              <td className="py-4 text-white text-sm">{position.shares}</td>
              <td className="py-4 text-white text-sm">${position.avgPrice.toFixed(2)}</td>
              <td className="py-4 text-white text-sm">${position.currentPrice.toFixed(2)}</td>
              <td className="py-4 text-white text-sm">${position.value.toFixed(2)}</td>
              <td className="py-4">
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                  </p>
                  <p className={`text-xs ${
                    position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%
                  </p>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const HyperliquidTable = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-medium text-white">Hyperliquid Positions</h3>
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <BarChart3 className="w-4 h-4" />
        {hyperliquidPositions.length} active positions
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-white/60 text-sm font-medium py-3">Symbol</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Side</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Size</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Entry</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Mark</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Notional</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">P&L</th>
            <th className="text-left text-white/60 text-sm font-medium py-3">Leverage</th>
          </tr>
        </thead>
        <tbody>
          {hyperliquidPositions.map((position, index) => (
            <motion.tr
              key={position.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-4">
                <span className="text-white text-sm font-medium">{position.symbol}</span>
              </td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  position.side === 'Long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {position.side}
                </span>
              </td>
              <td className="py-4 text-white text-sm">{position.size}</td>
              <td className="py-4 text-white text-sm">${position.entryPrice.toLocaleString()}</td>
              <td className="py-4 text-white text-sm">${position.markPrice.toLocaleString()}</td>
              <td className="py-4 text-white text-sm">${position.notional.toLocaleString()}</td>
              <td className="py-4">
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                  </p>
                  <p className={`text-xs ${
                    position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                  </p>
                </div>
              </td>
              <td className="py-4 text-white text-sm">{position.leverage.toFixed(1)}x</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default function PortfolioPage() {
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
          <h1 className="text-4xl font-light text-white mb-2">Portfolio Analysis</h1>
          <p className="text-white/60">Comprehensive view of your trading positions and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect showChainSwitcher={true} />
          <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/15 transition-colors">
            <Activity className="w-4 h-4 inline mr-2" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Portfolio Metrics */}
      <PortfolioMetrics />

      {/* Portfolio Allocation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Portfolio Allocation</h3>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* This would be replaced with an actual chart library */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                <div className="w-24 h-24 bg-[#0A0A0A] rounded-full flex items-center justify-center">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-purple-500" />
                <span className="text-white">Polymarket</span>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">${portfolioSummary.polymarketValue.toLocaleString()}</p>
                <p className="text-white/60 text-sm">
                  {((portfolioSummary.polymarketValue / portfolioSummary.totalValue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-white">Hyperliquid</span>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">${portfolioSummary.hyperliquidValue.toLocaleString()}</p>
                <p className="text-white/60 text-sm">
                  {((portfolioSummary.hyperliquidValue / portfolioSummary.totalValue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Position Tables */}
      <div className="space-y-8">
        <PolymarketTable />
        <HyperliquidTable />
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Performance Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-4 bg-green-500/20 rounded-xl mb-3">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto" />
            </div>
            <p className="text-green-400 text-2xl font-bold">73.5%</p>
            <p className="text-white/60 text-sm">Win Rate</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-blue-500/20 rounded-xl mb-3">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto" />
            </div>
            <p className="text-white text-2xl font-bold">28 days</p>
            <p className="text-white/60 text-sm">Avg Hold Time</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-purple-500/20 rounded-xl mb-3">
              <Percent className="w-8 h-8 text-purple-400 mx-auto" />
            </div>
            <p className="text-white text-2xl font-bold">2.8%</p>
            <p className="text-white/60 text-sm">Daily Return</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}