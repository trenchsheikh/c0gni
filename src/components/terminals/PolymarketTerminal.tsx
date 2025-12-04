'use client';

import React, { useState, useEffect, useMemo, useCallback, memo, startTransition, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { WalletSwitcher } from '@/components/wallet/WalletSwitcher';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { CrossChainBridge } from '@/components/bridge/CrossChainBridge';
import TradingModal from '@/components/polymarket/TradingModal';
import { QuickTrade } from '@/components/trading/QuickTrade';
import { useWalletManager } from '@/hooks/useWalletManager';
// Removed WalletStatus to prevent blocking render
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  Eye,
  Clock,
  Users,
  Filter,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ArrowRightLeft
} from 'lucide-react';

// Types for Polymarket data
interface Market {
  id: string;
  question: string;
  description?: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume24h: number;
  totalVolume: number;
  liquidity: number;
  resolutionDate?: Date;
  status: 'active' | 'closed' | 'resolved';
  tags: string[];
  impliedOdds: number;
  conditionId?: string;
  yesTokenId?: string;
  noTokenId?: string;
  tradingEnabled?: boolean;
}

interface Position {
  marketId: string;
  question: string;
  side: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  marketValue: number;
}

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBook {
  yes: {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  };
  no: {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  };
}

const CATEGORIES = [
  'All',
  'Politics',
  'Crypto',
  'Sports',
  'Technology',
  'Economics',
  'Science',
  'Entertainment',
  'Other'
];

export default function PolymarketTerminal() {
  // State management - all synchronous, no blocking
  const [selectedTab, setSelectedTab] = useState<'markets' | 'positions' | 'orders' | 'bridge'>('markets');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false); // Start as false to show UI immediately
  const [error, setError] = useState<string | null>(null);
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Load wallet manager - but defer execution until after first render
  const { isConnected, address, isOnPolymarket, switchToPolymarket, chainId } = useWalletManager();

  // Mark as mounted after first render - then start loading data
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-switch to Polygon chain - deferred after mount
  useEffect(() => {
    if (!isMounted) return;
    startTransition(() => {
      if (isConnected && !isOnPolymarket && !isSwitchingChain) {
        setIsSwitchingChain(true);
        switchToPolymarket().catch(() => {
          // Silently fail - user can manually switch if needed
        }).finally(() => {
          setIsSwitchingChain(false);
        });
      }
    });
  }, [isMounted, isConnected, isOnPolymarket, switchToPolymarket, isSwitchingChain]);

  // Load real open markets with React Query - deferred after mount
  const { data: marketsData, isLoading: isMarketsLoading, error: marketsError } = useQuery({
    queryKey: ['polymarket-markets'],
    queryFn: async () => {
      const res = await fetch('/api/markets/polymarket', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load markets (${res.status})`);
      const data = await res.json();
      return (data.markets || data || []).map((m: any) => ({
        id: m.id || m.slug || String(m.ticker || m.question || Math.random()),
        question: m.question || m.title || m.name || 'Untitled market',
        description: m.description || undefined,
        category: m.category || (Array.isArray(m.tags) && m.tags[0]) || 'All',
        yesPrice: typeof m.yesPrice === 'number' ? m.yesPrice : (m.prices?.yes ?? m.prices?.[0] ?? 0),
        noPrice: typeof m.noPrice === 'number' ? m.noPrice : (m.prices?.no ?? m.prices?.[1] ?? 0),
        volume24h: m.volume24h || m.volume_24h || 0,
        totalVolume: m.totalVolume || m.volume || 0,
        liquidity: m.liquidity || 0,
        resolutionDate: m.endDate ? new Date(m.endDate) : undefined,
        status: m.status || (m.active ? 'active' : 'closed'),
        tags: m.tags || [],
        impliedOdds: typeof m.impliedOdds === 'number' ? m.impliedOdds : (m.yesPrice ?? m.prices?.yes ?? 0)
      }));
    },
    enabled: isMounted, // Only fetch after component is mounted
    staleTime: 60 * 1000, // Consider data fresh for 1 minute (longer cache for faster loads)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh
    retry: 1, // Faster retry
    retryDelay: 500, // Quick retry delay
  });

  // Update local state when query data changes (non-blocking, deferred)
  useEffect(() => {
    if (!isMounted) return;
    startTransition(() => {
      if (marketsData) {
        setMarkets(marketsData);
        setError(null);
      }
      if (marketsError) {
        setError(marketsError instanceof Error ? marketsError.message : 'Failed to load markets');
      }
      if (isMarketsLoading && markets.length === 0) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    });
  }, [isMounted, marketsData, marketsError, isMarketsLoading, markets.length]);

  // Load order book for the selected market (lazy loaded only when market is selected and visible)
  const { data: orderBookData } = useQuery({
    queryKey: ['polymarket-orderbook', selectedMarket?.id],
    queryFn: async () => {
      if (!selectedMarket) return null;
      const res = await fetch(`/api/markets/polymarket/orderbook?id=${encodeURIComponent(selectedMarket.id)}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const ob = await res.json();
      return ob?.orderBook || null;
    },
    enabled: !!selectedMarket && selectedTab === 'markets', // Only fetch when market is selected and on markets tab
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: false,
  });

  // Update order book state when query data changes (deferred)
  useEffect(() => {
    if (!isMounted) return;
    startTransition(() => {
      if (orderBookData !== undefined) {
        setOrderBook(orderBookData);
      }
    });
  }, [isMounted, orderBookData]);

  // Load user positions when connected and on positions tab (lazy loaded with React Query)
  const { data: positionsData, isLoading: isPositionsLoading } = useQuery({
    queryKey: ['polymarket-positions', address],
    queryFn: async () => {
      const res = await fetch('/api/markets/polymarket/positions');
      if (!res.ok) throw new Error('Failed to load positions');
      const data = await res.json();
      return data.positions || [];
    },
    enabled: isMounted && isConnected && selectedTab === 'positions', // Only fetch after mount and when connected and on positions tab
    staleTime: 15000, // Consider data fresh for 15 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (positionsData) {
      setPositions(positionsData);
    }
  }, [positionsData]);

  useEffect(() => {
    setIsLoadingPositions(isPositionsLoading);
  }, [isPositionsLoading]);

  // Load user orders when connected and on orders tab (lazy loaded with React Query)
  const { data: ordersData } = useQuery({
    queryKey: ['polymarket-orders', address],
    queryFn: async () => {
      const res = await fetch('/api/markets/polymarket/trade');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      return data.orders || [];
    },
    enabled: isMounted && isConnected && selectedTab === 'orders', // Only fetch after mount and when connected and on orders tab
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (ordersData) {
      setUserOrders(ordersData);
    }
  }, [ordersData]);

  // Filter markets based on search and category (memoized for performance)
  const filteredMarkets = useMemo(() => {
    return markets.filter(market => {
      const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           market.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [markets, searchQuery, selectedCategory]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'closed': return 'text-yellow-400 bg-yellow-400/20';
      case 'resolved': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleMarketSelect = useCallback((market: Market) => {
    setSelectedMarket(market);
  }, []);

  const MarketCard = memo(({ market, onSelect }: { market: Market; onSelect: (market: Market) => void }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(market)}
      className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg mb-2 line-clamp-2">
            {market.question}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-zinc-400 text-sm">{market.category}</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(market.status)}`}>
              {market.status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-500/20 rounded-xl p-3">
          <div className="text-green-400 text-sm font-medium mb-1">YES</div>
          <div className="text-white text-xl font-bold">{formatPrice(market.yesPrice)}</div>
          <div className="text-green-400/70 text-xs">{formatPercentage(market.yesPrice)}</div>
        </div>
        <div className="bg-red-500/20 rounded-xl p-3">
          <div className="text-red-400 text-sm font-medium mb-1">NO</div>
          <div className="text-white text-xl font-bold">{formatPrice(market.noPrice)}</div>
          <div className="text-red-400/70 text-xs">{formatPercentage(market.noPrice)}</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-zinc-400">
            <BarChart3 className="w-4 h-4" />
            <span>{formatCurrency(market.volume24h)}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <Users className="w-4 h-4" />
            <span>{formatCurrency(market.liquidity)}</span>
          </div>
        </div>
        {market.resolutionDate && (
          <div className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-4 h-4" />
            <span>{market.resolutionDate.toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  ));

  const PositionCard = memo(({ position }: { position: Position }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg mb-2 line-clamp-2">
            {position.question}
          </h3>
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
            position.side === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {position.side}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-zinc-400 text-sm mb-1">Shares</div>
          <div className="text-white text-lg font-medium">{position.shares}</div>
        </div>
        <div>
          <div className="text-zinc-400 text-sm mb-1">Avg Price</div>
          <div className="text-white text-lg font-medium">{formatPrice(position.avgPrice)}</div>
        </div>
        <div>
          <div className="text-zinc-400 text-sm mb-1">Market Value</div>
          <div className="text-white text-lg font-medium">{formatCurrency(position.marketValue)}</div>
        </div>
        <div>
          <div className="text-zinc-400 text-sm mb-1">P&L</div>
          <div className={`text-lg font-medium ${
            position.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {position.unrealizedPnl >= 0 ? '+' : ''}{formatCurrency(position.unrealizedPnl)}
          </div>
        </div>
      </div>
    </motion.div>
  ));

  const OrderBookView = memo(({ orderBook }: { orderBook: OrderBook }) => (
    <div className="grid grid-cols-2 gap-6">
      {/* YES Order Book */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <h3 className="text-green-400 font-medium text-lg mb-4">YES Order Book</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-zinc-400 text-sm mb-2">Asks</h4>
            <div className="space-y-1">
              {orderBook.yes.asks.map((ask, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-red-400">{formatPrice(ask.price)}</span>
                  <span className="text-zinc-400">{ask.size}</span>
                  <span className="text-zinc-500">{ask.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-zinc-400 text-sm mb-2">Bids</h4>
            <div className="space-y-1">
              {orderBook.yes.bids.map((bid, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-green-400">{formatPrice(bid.price)}</span>
                  <span className="text-zinc-400">{bid.size}</span>
                  <span className="text-zinc-500">{bid.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NO Order Book */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <h3 className="text-red-400 font-medium text-lg mb-4">NO Order Book</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-zinc-400 text-sm mb-2">Asks</h4>
            <div className="space-y-1">
              {orderBook.no.asks.map((ask, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-red-400">{formatPrice(ask.price)}</span>
                  <span className="text-zinc-400">{ask.size}</span>
                  <span className="text-zinc-500">{ask.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-zinc-400 text-sm mb-2">Bids</h4>
            <div className="space-y-1">
              {orderBook.no.bids.map((bid, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-green-400">{formatPrice(bid.price)}</span>
                  <span className="text-zinc-400">{bid.size}</span>
                  <span className="text-zinc-500">{bid.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  // Render UI immediately - don't wait for data
  return (
    <div className="space-y-6">
      {/* Header - Always visible immediately */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Polymarket Terminal</h1>
          <p className="text-zinc-400 font-light">Trade prediction markets with real-time data</p>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect showChainSwitcher={false} />
          {isSwitchingChain && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Switching to Polygon...
            </div>
          )}
          {!isSwitchingChain && (
            <button 
              onClick={() => {
                const queryClient = require('@tanstack/react-query').useQueryClient();
                queryClient.invalidateQueries({ queryKey: ['polymarket-markets'] });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-1">
        {[
          { id: 'markets', label: 'Markets', icon: TrendingUp },
          { id: 'positions', label: 'Positions', icon: PieChart },
          { id: 'orders', label: 'Orders', icon: Activity },
          { id: 'bridge', label: 'Bridge', icon: ArrowRightLeft }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
              selectedTab === tab.id
                ? 'bg-white/15 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTab === 'markets' && (
            <>
              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-white/40"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category} className="bg-black">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Markets Grid - Show skeleton immediately if no data */}
              <div className="space-y-4">
                {isLoading && markets.length === 0 ? (
                  <div className="grid gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 animate-pulse">
                        <div className="h-6 bg-white/5 rounded mb-4 w-3/4"></div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="h-20 bg-white/5 rounded-xl"></div>
                          <div className="h-20 bg-white/5 rounded-xl"></div>
                        </div>
                        <div className="h-4 bg-white/5 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-white/70">{error}</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredMarkets.map(market => (
                      <MarketCard key={market.id} market={market} onSelect={handleMarketSelect} />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </>
          )}

          {selectedTab === 'positions' && (
            <div className="space-y-4">
              {!isConnected ? (
                <div className="text-center py-12">
                  <PieChart className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400 mb-4">Connect wallet to view positions</p>
                  <WalletConnect showChainSwitcher={false} />
                </div>
              ) : isLoadingPositions ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30 mx-auto mb-4"></div>
                  <p className="text-zinc-400">Loading positions...</p>
                </div>
              ) : positions.length === 0 ? (
                <div className="text-center py-12">
                  <PieChart className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400">No positions found</p>
                  <p className="text-zinc-500 text-sm mt-2">Start trading to build your portfolio</p>
                </div>
              ) : (
                positions.map((position, index) => (
                  <PositionCard key={index} position={position} />
                ))
              )}
            </div>
          )}

          {selectedTab === 'orders' && (
            <div className="space-y-4">
              {!isConnected ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400 mb-4">Connect wallet to view orders</p>
                  <WalletConnect showChainSwitcher={false} />
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400">No orders found</p>
                  <p className="text-zinc-500 text-sm mt-2">Your trading history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div key={order.id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-medium">{order.action.toUpperCase()} {order.side}</div>
                          <div className="text-zinc-400 text-sm">Market: {order.marketId}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'filled' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'partially_filled' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-400">Size:</span>
                          <span className="text-white ml-2">{order.size}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Price:</span>
                          <span className="text-white ml-2">${order.price.toFixed(3)}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Filled:</span>
                          <span className="text-white ml-2">{order.filledSize}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Fees:</span>
                          <span className="text-white ml-2">${order.fees?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                      {order.txHash && (
                        <div className="mt-2 text-xs">
                          <span className="text-zinc-400">Tx: </span>
                          <span className="text-white/80 font-mono">{order.txHash.slice(0, 10)}...{order.txHash.slice(-8)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'bridge' && (
            <div className="max-w-2xl mx-auto">
              <CrossChainBridge />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Trade Component */}
          {selectedMarket && (
            <QuickTrade
              market={{
                id: selectedMarket.id,
                question: selectedMarket.question,
                yesPrice: selectedMarket.yesPrice,
                noPrice: selectedMarket.noPrice,
                type: 'polymarket',
              }}
              platform="polymarket"
              onTradeComplete={() => {
                // Refresh positions after trade
                if (selectedTab === 'positions') {
                  // Trigger position refresh
                }
              }}
            />
          )}

          {/* Market Details */}
          {selectedMarket && (
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-medium text-lg mb-4">Market Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-zinc-400 text-sm mb-2">Question</h4>
                  <p className="text-white text-sm">{selectedMarket.question}</p>
                </div>

                {selectedMarket.description && (
                  <div>
                    <h4 className="text-zinc-400 text-sm mb-2">Description</h4>
                    <p className="text-white/80 text-sm">{selectedMarket.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-zinc-400 text-sm mb-1">24h Volume</h4>
                    <p className="text-white font-medium">{formatCurrency(selectedMarket.volume24h)}</p>
                  </div>
                  <div>
                    <h4 className="text-zinc-400 text-sm mb-1">Liquidity</h4>
                    <p className="text-white font-medium">{formatCurrency(selectedMarket.liquidity)}</p>
                  </div>
                </div>

                {/* Trading Interface */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white font-medium mb-3">Quick Trade</h4>
                  {isConnected ? (
                    <button
                      onClick={() => setIsTradingModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                    >
                      <DollarSign className="w-4 h-4" />
                      Open Trading
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-zinc-400 text-sm mb-3">Connect wallet to trade</p>
                      <WalletConnect showChainSwitcher={false} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Book */}
          {selectedMarket && orderBook && (
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-medium text-lg mb-4">Order Book</h3>
              <OrderBookView orderBook={orderBook} />
            </div>
          )}

          {/* Portfolio Summary */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-medium text-lg mb-4">Portfolio Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Value</span>
                <span className="text-white font-medium">
                  {formatCurrency(positions.reduce((sum, pos) => sum + pos.marketValue, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Unrealized P&L</span>
                <span className={`font-medium ${
                  positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0) >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0) >= 0 ? '+' : ''}
                  {formatCurrency(positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Active Positions</span>
                <span className="text-white font-medium">{positions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Modal */}
      <TradingModal
        market={selectedMarket}
        isOpen={isTradingModalOpen}
        onClose={() => setIsTradingModalOpen(false)}
      />
    </div>
  );
}
