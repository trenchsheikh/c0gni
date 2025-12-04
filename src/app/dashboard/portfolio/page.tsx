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
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/dashboard/Card";
import { Table } from "@/components/dashboard/Table";
import { Section } from "@/components/dashboard/Section";

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
    <StatCard
      title="Total Portfolio"
      value={`$${portfolioSummary.totalValue.toLocaleString()}`}
      change={`+$${portfolioSummary.totalPnL.toFixed(2)}`}
      changePercent={`+${portfolioSummary.totalPnLPercent}%`}
      icon={DollarSign}
      trend={portfolioSummary.totalPnL >= 0 ? "up" : "down"}
      index={0}
    />
    <StatCard
      title="24h Change"
      value={`+$${portfolioSummary.dayChange.toFixed(2)}`}
      changePercent={`+${portfolioSummary.dayChangePercent}%`}
      subtitle="vs yesterday"
      icon={TrendingUp}
      trend={portfolioSummary.dayChange >= 0 ? "up" : "down"}
      index={1}
    />
    <StatCard
      title="Polymarket"
      value={`$${portfolioSummary.polymarketValue.toLocaleString()}`}
      changePercent={`${portfolioSummary.totalValue > 0 ? ((portfolioSummary.polymarketValue / portfolioSummary.totalValue) * 100).toFixed(1) : '0.0'}%`}
      subtitle="of portfolio"
      icon={Target}
      trend="neutral"
      index={2}
    />
    <StatCard
      title="Hyperliquid"
      value={`$${portfolioSummary.hyperliquidValue.toLocaleString()}`}
      changePercent={`${portfolioSummary.totalValue > 0 ? ((portfolioSummary.hyperliquidValue / portfolioSummary.totalValue) * 100).toFixed(1) : '0.0'}%`}
      subtitle="of portfolio"
      icon={BarChart3}
      trend="neutral"
      index={3}
    />
  </div>
));

const PolymarketTable = React.memo(({ positions, isLoading }: { positions: PortfolioPosition[], isLoading: boolean }) => (
  <Table
    title="Polymarket Positions"
    subtitle={`${positions.length} active positions`}
    delay={0.3}
  >
    <Table.Header>
      <Table.HeaderCell>Market</Table.HeaderCell>
      <Table.HeaderCell>Side</Table.HeaderCell>
      <Table.HeaderCell>Shares</Table.HeaderCell>
      <Table.HeaderCell>Avg Price</Table.HeaderCell>
      <Table.HeaderCell>Current</Table.HeaderCell>
      <Table.HeaderCell>Value</Table.HeaderCell>
      <Table.HeaderCell>P&L</Table.HeaderCell>
    </Table.Header>
    <Table.Body>
      {isLoading ? (
        <Table.Loading colSpan={7} />
      ) : positions.length === 0 ? (
        <Table.Empty
          icon={Target}
          title="No Polymarket positions found"
          description="Start trading on Polymarket to see positions here"
          colSpan={7}
        />
      ) : (
        positions.map((position, index) => (
          <Table.Row key={position.marketId} index={index}>
            <Table.Cell>
              <div>
                <p className="text-white text-sm font-medium">{position.question || position.marketId}</p>
                <p className="text-zinc-500 text-xs">{position.category || 'Other'}</p>
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                position.side === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {position.side}
              </span>
            </Table.Cell>
            <Table.Cell className="text-white text-sm">{position.size.toFixed(2)}</Table.Cell>
            <Table.Cell className="text-white text-sm">${position.avgPrice.toFixed(2)}</Table.Cell>
            <Table.Cell className="text-white text-sm">${position.currentPrice.toFixed(2)}</Table.Cell>
            <Table.Cell className="text-white text-sm">${position.marketValue.toFixed(2)}</Table.Cell>
            <Table.Cell>
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
            </Table.Cell>
          </Table.Row>
        ))
      )}
    </Table.Body>
  </Table>
));

const HyperliquidTable = React.memo(({ positions, isLoading }: { positions: PortfolioPosition[], isLoading: boolean }) => (
  <Table
    title="Hyperliquid Positions"
    subtitle={`${positions.length} active positions`}
    delay={0.4}
  >
    <Table.Header>
      <Table.HeaderCell>Symbol</Table.HeaderCell>
      <Table.HeaderCell>Side</Table.HeaderCell>
      <Table.HeaderCell>Size</Table.HeaderCell>
      <Table.HeaderCell>Entry</Table.HeaderCell>
      <Table.HeaderCell>Mark</Table.HeaderCell>
      <Table.HeaderCell>Notional</Table.HeaderCell>
      <Table.HeaderCell>P&L</Table.HeaderCell>
      <Table.HeaderCell>Leverage</Table.HeaderCell>
    </Table.Header>
    <Table.Body>
      {isLoading ? (
        <Table.Loading colSpan={8} />
      ) : positions.length === 0 ? (
        <Table.Empty
          icon={BarChart3}
          title="No Hyperliquid positions found"
          description="Start trading on Hyperliquid to see positions here"
          colSpan={8}
        />
      ) : (
        positions.map((position, index) => (
          <Table.Row key={position.marketId} index={index}>
            <Table.Cell>
              <span className="text-white text-sm font-medium">{position.symbol || position.marketId}</span>
            </Table.Cell>
            <Table.Cell>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                position.side === 'LONG' || position.side === 'Long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {position.side}
              </span>
            </Table.Cell>
            <Table.Cell className="text-white text-sm">{position.size.toFixed(4)}</Table.Cell>
            <Table.Cell className="text-white text-sm">${position.avgPrice.toLocaleString()}</Table.Cell>
            <Table.Cell className="text-white text-sm">${position.currentPrice.toLocaleString()}</Table.Cell>
            <Table.Cell className="text-white text-sm">${position.marketValue.toLocaleString()}</Table.Cell>
            <Table.Cell>
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
            </Table.Cell>
            <Table.Cell className="text-white text-sm">Live</Table.Cell>
          </Table.Row>
        ))
      )}
    </Table.Body>
  </Table>
));

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
      <PageHeader
        title="Portfolio Analysis"
        subtitle="Comprehensive view of your trading positions and performance"
      >
        <WalletConnect showChainSwitcher={true} />
        {isConnected && (
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
        <button className="px-6 py-2 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-all duration-300 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Export Report
        </button>
      </PageHeader>

      {/* Portfolio Metrics */}
      {!isConnected ? (
        <Card className="text-center">
          <DollarSign className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Your Wallet</h3>
          <p className="text-zinc-400 mb-6">Connect your wallet to view portfolio metrics</p>
          <WalletConnect showChainSwitcher={true} />
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} delay={index * 0.1}>
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                  <div className="w-16 h-4 bg-white/10 rounded"></div>
                </div>
                <div className="w-24 h-4 bg-white/10 rounded mb-2"></div>
                <div className="w-32 h-8 bg-white/10 rounded mb-1"></div>
                <div className="w-20 h-3 bg-white/10 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Error Loading Portfolio</h3>
          <p className="text-zinc-400 mb-6">Failed to load portfolio metrics. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            Retry
          </button>
        </Card>
      ) : (
        <PortfolioMetrics portfolioSummary={portfolioSummary} />
      )}

      {/* Portfolio Allocation Chart */}
      <Card delay={0.2}>
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
      </Card>

      {/* Position Tables */}
      {!isConnected ? (
        <Card className="text-center">
          <PieChart className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Your Wallet</h3>
          <p className="text-zinc-400 mb-6">Connect your wallet to view your trading positions and portfolio analysis</p>
          <WalletConnect showChainSwitcher={true} />
        </Card>
      ) : error ? (
        <Card className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Error Loading Portfolio</h3>
          <p className="text-zinc-400 mb-6">Failed to load portfolio data. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            Retry
          </button>
        </Card>
      ) : (
        <div className="space-y-8">
          <PolymarketTable positions={polymarketPositions} isLoading={isLoading} />
          <HyperliquidTable positions={hyperliquidPositions} isLoading={isLoading} />
        </div>
      )}

      {/* Performance Summary */}
      <Card delay={0.6}>
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
      </Card>
    </div>
  );
}