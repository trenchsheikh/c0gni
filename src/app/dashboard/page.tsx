'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { useWalletManager } from '@/hooks/useWalletManager';
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
  Eye,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { WalletConnect } from "@/components/wallet/WalletConnect";

// Real-time portfolio stats interface
interface PortfolioStat {
  title: string;
  value: string;
  change: string;
  changePercent: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'neutral';
}

interface TradingActivity {
  id: string;
  type: 'trade' | 'prediction' | 'bridge' | 'agent';
  action: string;
  platform: string;
  amount: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed' | 'completed';
}

interface PlatformStat {
  platform: string;
  icon: React.ComponentType<any>;
  color: string;
  metrics: Record<string, string>;
  status: string;
}



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
  const { isConnected, address } = useWalletManager();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real portfolio data
  const { data: portfolioData, isLoading: portfolioLoading, error: portfolioError, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio', address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/portfolio?address=${address}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      return res.json();
    },
    enabled: !!address && isConnected,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });

  // Fetch real trading history
  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['trading-history', address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/trading/history?address=${address}&limit=10`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch trading history');
      return res.json();
    },
    enabled: !!address && isConnected,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchPortfolio(), refetchHistory()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Generate portfolio stats from real data
  const portfolioStats: PortfolioStat[] = React.useMemo(() => {
    if (!portfolioData?.summary) {
      return [
        {
          title: "Total Portfolio Value",
          value: "$0.00",
          change: "$0.00",
          changePercent: "0.00%",
          icon: DollarSign,
          trend: "neutral" as const
        },
        {
          title: "Active Positions",
          value: "0",
          change: "0",
          changePercent: "0.00%",
          icon: Target,
          trend: "neutral" as const
        },
        {
          title: "24h P&L",
          value: "$0.00",
          change: "$0.00",
          changePercent: "0.00%",
          icon: TrendingUp,
          trend: "neutral" as const
        },
        {
          title: "Win Rate",
          value: "0.0%",
          change: "0.0%",
          changePercent: "0.0%",
          icon: CheckCircle,
          trend: "neutral" as const
        }
      ];
    }

    const summary = portfolioData.summary;
    const formatCurrency = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatPercent = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;

    return [
      {
        title: "Total Portfolio Value",
        value: formatCurrency(summary.totalValue),
        change: formatCurrency(summary.totalPnL),
        changePercent: formatPercent(summary.totalPnLPercent),
        icon: DollarSign,
        trend: summary.totalPnL >= 0 ? "up" as const : "down" as const
      },
      {
        title: "Active Positions",
        value: summary.activePositions.toString(),
        change: `${summary.activePositions}`,
        changePercent: "total",
        icon: Target,
        trend: "neutral" as const
      },
      {
        title: "24h P&L",
        value: formatCurrency(summary.dayChange),
        change: formatCurrency(Math.abs(summary.dayChange * 0.1)),
        changePercent: formatPercent(summary.dayChangePercent),
        icon: TrendingUp,
        trend: summary.dayChange >= 0 ? "up" as const : "down" as const
      },
      {
        title: "Win Rate",
        value: `${summary.winRate.toFixed(1)}%`,
        change: `${(summary.winRate * 0.05).toFixed(1)}%`,
        changePercent: "recent",
        icon: CheckCircle,
        trend: summary.winRate >= 50 ? "up" as const : "down" as const
      }
    ];
  }, [portfolioData]);

  // Generate platform stats from real data
  const platformStats: PlatformStat[] = React.useMemo(() => {
    if (!portfolioData?.breakdown) {
      return [
        {
          platform: "Polymarket",
          icon: TrendingUp,
          color: "from-purple-500 to-pink-500",
          metrics: {
            totalVolume: "$0.00",
            activeMarkets: "0",
            winRate: "0.0%",
            totalProfit: "$0.00"
          },
          status: "Connect Wallet"
        },
        {
          platform: "Hyperliquid",
          icon: BarChart3,
          color: "from-blue-500 to-cyan-500",
          metrics: {
            totalVolume: "$0.00",
            activePositions: "0",
            pnl24h: "$0.00",
            leverage: "0.0x avg"
          },
          status: "Connect Wallet"
        }
      ];
    }

    const { polymarket, hyperliquid } = portfolioData.breakdown;
    const formatCurrency = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return [
      {
        platform: "Polymarket",
        icon: TrendingUp,
        color: "from-purple-500 to-pink-500",
        metrics: {
          totalVolume: formatCurrency(polymarket.value),
          activeMarkets: polymarket.positions.toString(),
          winRate: polymarket.positions > 0 ? "calculating..." : "0.0%",
          totalProfit: formatCurrency(polymarket.pnl)
        },
        status: polymarket.positions > 0 ? "Active" : "No Positions"
      },
      {
        platform: "Hyperliquid",
        icon: BarChart3,
        color: "from-blue-500 to-cyan-500",
        metrics: {
          totalVolume: formatCurrency(hyperliquid.value),
          activePositions: hyperliquid.positions.toString(),
          pnl24h: formatCurrency(hyperliquid.pnl),
          leverage: hyperliquid.positions > 0 ? "live data" : "0.0x avg"
        },
        status: hyperliquid.positions > 0 ? "Active" : "No Positions"
      }
    ];
  }, [portfolioData]);

  // Get recent activity from real data
  const recentActivity: TradingActivity[] = React.useMemo(() => {
    if (!historyData?.activities) return [];

    return historyData.activities.slice(0, 4).map((activity: any) => ({
      id: activity.id,
      type: activity.type,
      action: activity.action,
      platform: activity.platform,
      amount: activity.amount,
      time: new Date(activity.timestamp).toLocaleString(),
      status: activity.status
    }));
  }, [historyData]);

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
          {isConnected && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
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
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
          >
            <DollarSign className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Connect Your Wallet</h3>
            <p className="text-white/60 mb-6">Connect your wallet to view real portfolio data and trading statistics</p>
            <WalletConnect showChainSwitcher={true} />
          </motion.div>
        ) : portfolioLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                  <div className="w-16 h-4 bg-white/10 rounded"></div>
                </div>
                <div className="w-24 h-4 bg-white/10 rounded mb-2"></div>
                <div className="w-32 h-8 bg-white/10 rounded mb-1"></div>
                <div className="w-20 h-3 bg-white/10 rounded"></div>
              </div>
            </motion.div>
          ))
        ) : portfolioError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
          >
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Error Loading Portfolio</h3>
            <p className="text-white/60 mb-6">Failed to load portfolio data. Please try refreshing.</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
            >
              Retry
            </button>
          </motion.div>
        ) : (
          portfolioStats.map((stat, index) => (
            <StatCard key={stat.title} stat={stat} index={index} />
          ))
        )}
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
            {!isConnected ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Connect wallet to view trading history</p>
              </div>
            ) : historyLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse"></div>
                    <div>
                      <div className="w-32 h-4 bg-white/10 rounded mb-2 animate-pulse"></div>
                      <div className="w-24 h-3 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-4 bg-white/10 rounded mb-1 animate-pulse"></div>
                    <div className="w-12 h-3 bg-white/10 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No trading activity found</p>
                <p className="text-white/40 text-sm mt-2">Start trading to see your activity here</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      activity.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      activity.status === 'failed' ? 'bg-red-500/20 text-red-400' :
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
                      activity.status === 'failed' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {activity.status}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
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