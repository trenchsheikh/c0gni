'use client'

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { useWalletManager } from '@/hooks/useWalletManager';
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
  Eye,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { WalletConnect } from "@/components/wallet/WalletConnect";

interface PortfolioPosition {
  platform: 'polymarket' | 'hyperliquid';
  marketId: string;
  symbol?: string;
  question?: string;
  side: string;
  size: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  category?: string;
}



const PortfolioMetrics = React.memo(({ portfolioSummary }: { portfolioSummary: any }) => (
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
        change: `${portfolioSummary.totalValue > 0 ? ((portfolioSummary.polymarketValue / portfolioSummary.totalValue) * 100).toFixed(1) : '0.0'}%`,
        percent: "of portfolio",
        icon: Target,
        trend: "neutral" as const
      },
      {
        title: "Hyperliquid",
        value: `$${portfolioSummary.hyperliquidValue.toLocaleString()}`,
        change: `${portfolioSummary.totalValue > 0 ? ((portfolioSummary.hyperliquidValue / portfolioSummary.totalValue) * 100).toFixed(1) : '0.0'}%`,
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
));

const PolymarketTable = React.memo(({ positions, isLoading }: { positions: PortfolioPosition[], isLoading: boolean }) => (
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
        {positions.length} active positions
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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="py-4">
                  <div className="animate-pulse">
                    <div className="w-32 h-4 bg-white/10 rounded mb-2"></div>
                    <div className="w-16 h-3 bg-white/10 rounded"></div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="w-12 h-6 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
              </tr>
            ))
          ) : positions.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center">
                <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No Polymarket positions found</p>
                <p className="text-white/40 text-sm mt-2">Start trading on Polymarket to see positions here</p>
              </td>
            </tr>
          ) : (
            positions.map((position, index) => (
              <motion.tr
                key={position.marketId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4">
                  <div>
                    <p className="text-white text-sm font-medium">{position.question || position.marketId}</p>
                    <p className="text-white/60 text-xs">{position.category || 'Other'}</p>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    position.side === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {position.side}
                  </span>
                </td>
                <td className="py-4 text-white text-sm">{position.size.toFixed(2)}</td>
                <td className="py-4 text-white text-sm">${position.avgPrice.toFixed(2)}</td>
                <td className="py-4 text-white text-sm">${position.currentPrice.toFixed(2)}</td>
                <td className="py-4 text-white text-sm">${position.marketValue.toFixed(2)}</td>
                <td className="py-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      position.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.unrealizedPnl >= 0 ? '+' : ''}${position.unrealizedPnl.toFixed(2)}
                    </p>
                    <p className={`text-xs ${
                      position.unrealizedPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.unrealizedPnlPercent >= 0 ? '+' : ''}{position.unrealizedPnlPercent.toFixed(1)}%
                    </p>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
));

const HyperliquidTable = React.memo(({ positions, isLoading }: { positions: PortfolioPosition[], isLoading: boolean }) => (
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
        {positions.length} active positions
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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="py-4">
                  <div className="w-20 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-12 h-6 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-20 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-20 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-24 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
                <td className="py-4">
                  <div className="w-12 h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
              </tr>
            ))
          ) : positions.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center">
                <BarChart3 className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No Hyperliquid positions found</p>
                <p className="text-white/40 text-sm mt-2">Start trading on Hyperliquid to see positions here</p>
              </td>
            </tr>
          ) : (
            positions.map((position, index) => (
              <motion.tr
                key={position.marketId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4">
                  <span className="text-white text-sm font-medium">{position.symbol || position.marketId}</span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    position.side === 'LONG' || position.side === 'Long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {position.side}
                  </span>
                </td>
                <td className="py-4 text-white text-sm">{position.size.toFixed(4)}</td>
                <td className="py-4 text-white text-sm">${position.avgPrice.toLocaleString()}</td>
                <td className="py-4 text-white text-sm">${position.currentPrice.toLocaleString()}</td>
                <td className="py-4 text-white text-sm">${position.marketValue.toLocaleString()}</td>
                <td className="py-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      position.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.unrealizedPnl >= 0 ? '+' : ''}${position.unrealizedPnl.toFixed(2)}
                    </p>
                    <p className={`text-xs ${
                      position.unrealizedPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.unrealizedPnlPercent >= 0 ? '+' : ''}{position.unrealizedPnlPercent.toFixed(2)}%
                    </p>
                  </div>
                </td>
                <td className="py-4 text-white text-sm">Live</td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default function PortfolioPage() {
  const { isConnected, address } = useWalletManager();

  // Fetch real portfolio data
  const { data: portfolioData, isLoading, error, refetch } = useQuery({
    queryKey: ['portfolio', address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/portfolio?address=${address}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      return res.json();
    },
    enabled: !!address && isConnected,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const portfolioSummary = portfolioData?.summary || {
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    polymarketValue: 0,
    hyperliquidValue: 0,
    dayChange: 0,
    dayChangePercent: 0,
    activePositions: 0,
    winRate: 0
  };

  const positions: PortfolioPosition[] = portfolioData?.positions || [];
  const polymarketPositions = React.useMemo(() => 
    positions.filter(p => p.platform === 'polymarket'), 
    [positions]
  );
  const hyperliquidPositions = React.useMemo(() => 
    positions.filter(p => p.platform === 'hyperliquid'), 
    [positions]
  );

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
          {isConnected && (
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/15 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
          <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/15 transition-colors">
            <Activity className="w-4 h-4 inline mr-2" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Portfolio Metrics */}
      {!isConnected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <DollarSign className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Your Wallet</h3>
          <p className="text-white/60 mb-6">Connect your wallet to view portfolio metrics</p>
          <WalletConnect showChainSwitcher={true} />
        </motion.div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
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
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Error Loading Portfolio</h3>
          <p className="text-white/60 mb-6">Failed to load portfolio metrics. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
          >
            Retry
          </button>
        </motion.div>
      ) : (
        <PortfolioMetrics portfolioSummary={portfolioSummary} />
      )}

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
      {!isConnected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <PieChart className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Your Wallet</h3>
          <p className="text-white/60 mb-6">Connect your wallet to view your trading positions and portfolio analysis</p>
          <WalletConnect showChainSwitcher={true} />
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Error Loading Portfolio</h3>
          <p className="text-white/60 mb-6">Failed to load portfolio data. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
          >
            Retry
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <PolymarketTable positions={polymarketPositions} isLoading={isLoading} />
          <HyperliquidTable positions={hyperliquidPositions} isLoading={isLoading} />
        </div>
      )}

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
            <div className={`p-4 rounded-xl mb-3 ${
              portfolioSummary.winRate >= 50 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <TrendingUp className={`w-8 h-8 mx-auto ${
                portfolioSummary.winRate >= 50 ? 'text-green-400' : 'text-red-400'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              portfolioSummary.winRate >= 50 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioSummary.winRate.toFixed(1)}%
            </p>
            <p className="text-white/60 text-sm">Win Rate</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-blue-500/20 rounded-xl mb-3">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto" />
            </div>
            <p className="text-white text-2xl font-bold">{portfolioSummary.activePositions}</p>
            <p className="text-white/60 text-sm">Active Positions</p>
          </div>
          <div className="text-center">
            <div className={`p-4 rounded-xl mb-3 ${
              portfolioSummary.dayChangePercent >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <Percent className={`w-8 h-8 mx-auto ${
                portfolioSummary.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              portfolioSummary.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioSummary.dayChangePercent >= 0 ? '+' : ''}{portfolioSummary.dayChangePercent.toFixed(1)}%
            </p>
            <p className="text-white/60 text-sm">24h Change</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}