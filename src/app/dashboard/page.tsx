'use client'

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  ArrowRightLeft,
  DollarSign,
  PieChart,
  Activity,
  Clock,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react";
import Link from "next/link";
import { WalletConnect } from "@/components/wallet/WalletConnect";

// Mock data for trading dashboard
const portfolioStats = [
  {
    title: "Total Portfolio Value",
    value: "$12,847.50",
    change: "+$2,340.25",
    changePercent: "+22.3%",
    icon: DollarSign,
    trend: "up" as const
  },
  {
    title: "Active Positions",
    value: "18",
    change: "+5",
    changePercent: "+38.5%",
    icon: Target,
    trend: "up" as const
  },
  {
    title: "24h P&L",
    value: "+$435.80",
    change: "+$67.20",
    changePercent: "+18.2%",
    icon: TrendingUp,
    trend: "up" as const
  },
  {
    title: "Win Rate",
    value: "73.5%",
    change: "+2.1%",
    changePercent: "+2.9%",
    icon: CheckCircle,
    trend: "up" as const
  }
];

const platformStats = [
  {
    platform: "Polymarket",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    metrics: {
      totalVolume: "$8,243.50",
      activeMarkets: 12,
      winRate: "68.3%",
      totalProfit: "+$1,840.25"
    },
    status: "Active"
  },
  {
    platform: "Hyperliquid",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500",
    metrics: {
      totalVolume: "$15,680.30",
      activePositions: 6,
      pnl24h: "+$595.55",
      leverage: "3.2x avg"
    },
    status: "Active"
  }
];

const recentActivity = [
  {
    type: "trade",
    action: "Opened long position on ETH-PERP",
    platform: "Hyperliquid",
    amount: "$2,500",
    time: "2 min ago",
    status: "success" as const
  },
  {
    type: "prediction",
    action: "Bet YES on US Election outcome",
    platform: "Polymarket",
    amount: "$850",
    time: "15 min ago",
    status: "success" as const
  },
  {
    type: "bridge",
    action: "Bridged USDC to Polygon",
    platform: "LiFi",
    amount: "$1,200",
    time: "1 hour ago",
    status: "completed" as const
  },
  {
    type: "agent",
    action: "AI agent executed momentum trade",
    platform: "Hyperliquid",
    amount: "$720",
    time: "2 hours ago",
    status: "success" as const
  }
];

const StatCard = ({ stat, index }: { stat: typeof portfolioStats[0], index: number }) => {
  const IconComponent = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${
          stat.trend === 'up' ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-rose-500/20'
        }`}>
          <IconComponent className={`w-6 h-6 ${
            stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {stat.trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{stat.changePercent}</span>
        </div>
      </div>

      <div>
        <h3 className="text-white/60 text-sm font-medium">{stat.title}</h3>
        <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
        <p className="text-white/50 text-sm mt-1">{stat.change} today</p>
      </div>
    </motion.div>
  );
};

const PlatformCard = ({ platform, index }: { platform: typeof platformStats[0], index: number }) => {
  const IconComponent = platform.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${platform.color}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">{platform.platform}</h3>
            <span className="text-green-400 text-sm">● {platform.status}</span>
          </div>
        </div>
        <Link
          href={`/dashboard/${platform.platform.toLowerCase()}`}
          className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/15 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 inline mr-2" />
          View Terminal
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(platform.metrics).map(([key, value], metricIndex) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + metricIndex * 0.1 }}
            className="text-center"
          >
            <p className="text-white/60 text-xs uppercase tracking-wide">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-white text-lg font-semibold mt-1">{value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function TradingDashboard() {
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
          <h1 className="text-4xl font-light text-white mb-2">Trading Dashboard</h1>
          <p className="text-white/60">Monitor your prediction markets and perpetual trading performance</p>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect showChainSwitcher={true} />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard/portfolio"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              View Full Portfolio
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Platform Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-light text-white mb-6">Platform Overview</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {platformStats.map((platform, index) => (
            <PlatformCard key={platform.platform} platform={platform} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Recent Trading Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                    activity.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {activity.type === 'trade' ? <BarChart3 className="w-4 h-4" /> :
                     activity.type === 'prediction' ? <TrendingUp className="w-4 h-4" /> :
                     activity.type === 'bridge' ? <ArrowRightLeft className="w-4 h-4" /> :
                     <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{activity.action}</p>
                    <p className="text-white/60 text-xs">{activity.platform} • {activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{activity.amount}</p>
                  <p className={`text-xs ${
                    activity.status === 'success' ? 'text-green-400' :
                    activity.status === 'completed' ? 'text-blue-400' :
                    'text-yellow-400'
                  }`}>
                    {activity.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {[
              { label: "Polymarket Terminal", href: "/dashboard/polymarket", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
              { label: "Hyperliquid Terminal", href: "/dashboard/hyperliquid", icon: BarChart3, color: "from-blue-500 to-cyan-500" },
              { label: "Cross-Chain Bridge", href: "/dashboard/bridge", icon: ArrowRightLeft, color: "from-green-500 to-emerald-500" },
              { label: "Portfolio Analysis", href: "/dashboard/portfolio", icon: PieChart, color: "from-orange-500 to-red-500" }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 text-white group`}
                >
                  <action.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{action.label}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Agents Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">AI Trading Agents</h3>
          <Link
            href="/agents"
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            View All Agents →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Polymarket Predictor</p>
                <p className="text-white/60 text-sm">Active • 12 predictions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-medium">+$342.80</p>
              <p className="text-white/60 text-sm">24h profit</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Hyperliquid Trader</p>
                <p className="text-white/60 text-sm">Active • 6 positions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-medium">+$187.45</p>
              <p className="text-white/60 text-sm">24h profit</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}