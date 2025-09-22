'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { WalletSwitcher } from '@/components/wallet/WalletSwitcher';
import { CrossChainBridge } from '@/components/bridge/CrossChainBridge';
import { QuickTrade } from '@/components/trading/QuickTrade';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Settings,
  Target,
  Shield,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ArrowUpDown,
  Percent,
  Calculator,
  Eye,
  Maximize2,
  LineChart,
  ArrowRightLeft
} from 'lucide-react';
import { HyperliquidWS, parseHLOrderBook } from '@/lib/ws/hyperliquid';

// Types for Hyperliquid data
interface Market {
  symbol: string;
  marketType: 'perp' | 'spot';
  baseAsset: string;
  quoteAsset: string;
  markPrice: number;
  indexPrice?: number;
  lastPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  volume24h: number;
  openInterest?: number;
  fundingRate?: number;
  nextFunding?: Date;
  maxLeverage?: number;
  status: string;
}

interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  margin: number;
  leverage: number;
  liquidationPrice?: number;
  marginRatio: number;
  fundingPaid: number;
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop' | 'take_profit';
  size: number;
  price?: number;
  triggerPrice?: number;
  filledSize: number;
  status: 'pending' | 'filled' | 'partial' | 'cancelled';
  timestamp: Date;
  reduceOnly: boolean;
  postOnly: boolean;
}

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  lastUpdate: Date;
}

const MARKET_TYPES = ['All', 'Perpetuals', 'Spot'];

export default function HyperliquidTerminal() {
  // State management
  const [selectedTab, setSelectedTab] = useState<'markets' | 'positions' | 'orders' | 'funding' | 'bridge'>('markets');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [wsEnabled] = useState(() => (process.env.NEXT_PUBLIC_ENABLE_HYPERLIQUID_WS || 'false').toLowerCase() === 'true');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketType, setSelectedMarketType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Trading form state
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [orderSize, setOrderSize] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [postOnly, setPostOnly] = useState(false);

  // Fetch markets with React Query for real-time updates
  const { data: marketsData, isLoading: isQueryLoading, error: queryError, refetch } = useQuery({
    queryKey: ['hyperliquid-markets'],
    queryFn: async () => {
      const res = await fetch('/api/markets/hyperliquid', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load markets (${res.status})`);
      return res.json();
    },
    refetchInterval: 2000, // Refresh every 2 seconds
    refetchIntervalInBackground: true,
    staleTime: 1000, // Consider data stale after 1 second
  });

  // Background sync to keep Redis cache fresh
  useQuery({
    queryKey: ['hyperliquid-auto-sync'],
    queryFn: async () => {
      const res = await fetch('/api/hyperliquid/auto-sync', { cache: 'no-store' });
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 60000, // Check every minute for auto-sync
    refetchIntervalInBackground: true,
    retry: false, // Don't retry if auto-sync fails
    staleTime: 30000, // 30 seconds
  });

  // Process markets data and manage loading state
  useEffect(() => {
    setIsLoading(isQueryLoading);

    if (marketsData?.markets) {
      const newMarkets: Market[] = marketsData.markets.map((m: any) => ({
        symbol: m.symbol || m.asset || m.pair,
        marketType: m.marketType || (m.type || 'perp'),
        baseAsset: m.baseAsset || m.base || (m.symbol?.split('-')[0] ?? ''),
        quoteAsset: m.quoteAsset || m.quote || (m.symbol?.split('-')[1] ?? 'USD'),
        markPrice: Number(m.markPrice ?? m.mid ?? m.price ?? 0),
        indexPrice: Number(m.indexPrice ?? 0) || undefined,
        lastPrice: Number(m.lastPrice ?? m.price ?? m.mid ?? 0),
        priceChange24h: Number(m.priceChange24h ?? m.change24h ?? 0),
        priceChangePercent24h: Number(m.priceChangePercent24h ?? m.change24hPct ?? 0),
        volume24h: Number(m.volume24h ?? m.volume ?? 0),
        openInterest: Number(m.openInterest ?? 0) || undefined,
        fundingRate: Number(m.fundingRate ?? 0) || undefined,
        nextFunding: m.nextFunding ? new Date(m.nextFunding) : undefined,
        maxLeverage: Number(m.maxLeverage ?? 0) || undefined,
        status: m.status || 'active',
      }));

      // Only update state if markets actually changed to prevent unnecessary re-renders
      setMarkets(prevMarkets => {
        if (prevMarkets.length !== newMarkets.length) {
          return newMarkets;
        }

        // Check if any market data has actually changed
        const hasChanges = newMarkets.some((newMarket, index) => {
          const prevMarket = prevMarkets[index];
          if (!prevMarket || prevMarket.symbol !== newMarket.symbol) return true;

          // Only update if price data has meaningfully changed
          return (
            Math.abs(prevMarket.markPrice - newMarket.markPrice) > 0.00001 ||
            Math.abs(prevMarket.priceChangePercent24h - newMarket.priceChangePercent24h) > 0.001 ||
            Math.abs(prevMarket.volume24h - newMarket.volume24h) > 1 ||
            (prevMarket.openInterest !== newMarket.openInterest) ||
            (prevMarket.fundingRate !== newMarket.fundingRate)
          );
        });

        return hasChanges ? newMarkets : prevMarkets;
      });
      setError(null);

      // Mark as initially loaded after first successful data fetch
      if (!hasInitiallyLoaded) {
        setHasInitiallyLoaded(true);
      }
    } else if (queryError) {
      setError(queryError?.message || 'Failed to load markets');
    }
  }, [marketsData, queryError, isQueryLoading]);

  // Order book with React Query and WebSocket fallback
  const { data: orderBookData } = useQuery({
    queryKey: ['hyperliquid-orderbook', selectedMarket?.symbol],
    queryFn: async () => {
      if (!selectedMarket) return null;
      const res = await fetch(`/api/markets/hyperliquid/orderbook?symbol=${encodeURIComponent(selectedMarket.symbol)}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.orderBook;
    },
    enabled: !!selectedMarket && !wsEnabled, // Only use API polling when WebSocket is disabled
    refetchInterval: wsEnabled ? false : 5000, // Refresh every 5 seconds when not using WebSocket
    refetchIntervalInBackground: true,
    staleTime: 3000,
  });

  // WebSocket connection for real-time order book (when enabled)
  useEffect(() => {
    let ws: HyperliquidWS | null = null;
    let cancelled = false;

    const connectWs = () => {
      if (!selectedMarket || !wsEnabled) return;
      ws = new HyperliquidWS({
        onMessage: (msg) => {
          const parsed = parseHLOrderBook(msg);
          if (parsed && !cancelled) {
            setOrderBook({
              bids: parsed.bids,
              asks: parsed.asks,
              spread: parsed.spread,
              lastUpdate: parsed.lastUpdate,
            });
          }
        },
        onOpen: () => {
          ws?.subscribeOrderBook(selectedMarket.symbol);
        },
      });
      ws.connect();
    };

    if (wsEnabled) {
      connectWs();
    } else {
      // Use API data when WebSocket is disabled
      if (orderBookData) {
        setOrderBook(orderBookData);
      }
    }

    return () => {
      cancelled = true;
      ws?.disconnect();
      ws = null;
    };
  }, [selectedMarket, wsEnabled, orderBookData]);

  // Filter markets with useMemo to prevent unnecessary recalculations
  const filteredMarkets = React.useMemo(() => {
    return markets.filter(market => {
      const matchesSearch = market.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedMarketType === 'All' ||
                         (selectedMarketType === 'Perpetuals' && market.marketType === 'perp') ||
                         (selectedMarketType === 'Spot' && market.marketType === 'spot');
      return matchesSearch && matchesType;
    });
  }, [markets, searchQuery, selectedMarketType]);

  const formatCurrency = (value: number) => {
    if (value === 0 || isNaN(value)) return '$0.00';

    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPrice = (value: number, precision: number = 2) => {
    if (isNaN(value)) return '0.00';
    return value.toFixed(precision);
  };

  const formatPercentage = (value: number) => {
    if (isNaN(value) || value === 0) return '0.00%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatNumber = (value: number, precision: number = 4) => {
    return value.toFixed(precision);
  };

  const getTimeUntilFunding = (nextFunding?: Date) => {
    if (!nextFunding) return 'N/A';
    const now = new Date();
    const diff = nextFunding.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const MarketCard = React.memo(({ market, isInitialLoad }: { market: Market; isInitialLoad: boolean }) => (
    <motion.div
      initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => setSelectedMarket(market)}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 ${
        selectedMarket?.symbol === market.symbol ? 'border-blue-500/50 bg-blue-500/10' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-medium text-lg">{market.symbol}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              market.marketType === 'perp'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {market.marketType === 'perp' ? 'PERP' : 'SPOT'}
            </span>
          </div>
          <div className="text-white text-2xl font-bold">
            ${formatPrice(market.markPrice, market.markPrice < 1 ? 6 : 2)}
          </div>
        </div>
        <div className={`text-right ${
          market.priceChangePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          <div className="text-lg font-medium">
            {formatPercentage(market.priceChangePercent24h)}
          </div>
          <div className="text-sm">
            {market.priceChange24h >= 0 ? '+' : ''}
            ${formatPrice(Math.abs(market.priceChange24h))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-white/60 text-sm">24h Volume</div>
          <div className="text-white font-medium">
            {formatCurrency(market.volume24h)}
          </div>
        </div>
        {market.openInterest && (
          <div>
            <div className="text-white/60 text-sm">Open Interest</div>
            <div className="text-white font-medium">
              {formatCurrency(market.openInterest)}
            </div>
          </div>
        )}
      </div>

      {market.fundingRate !== undefined && (
        <div className="flex justify-between items-center text-sm border-t border-white/10 pt-3">
          <div>
            <span className="text-white/60">Funding: </span>
            <span className={`font-medium ${
              market.fundingRate >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {(market.fundingRate * 100).toFixed(4)}%
            </span>
          </div>
          <div className="text-white/60">
            Next: {getTimeUntilFunding(market.nextFunding)}
          </div>
        </div>
      )}
    </motion.div>
  ), (prevProps, nextProps) => {
    // Only re-render if market data has actually changed
    const prev = prevProps.market;
    const next = nextProps.market;

    return (
      prev.symbol === next.symbol &&
      prevProps.isInitialLoad === nextProps.isInitialLoad &&
      Math.abs(prev.markPrice - next.markPrice) < 0.00001 &&
      Math.abs(prev.priceChangePercent24h - next.priceChangePercent24h) < 0.001 &&
      Math.abs(prev.volume24h - next.volume24h) < 1 &&
      prev.openInterest === next.openInterest &&
      prev.fundingRate === next.fundingRate
    );
  });

  MarketCard.displayName = 'MarketCard';

  const PositionCard = ({ position }: { position: Position }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-medium text-lg">{position.symbol}</h3>
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
            position.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {position.side.toUpperCase()} {position.leverage}x
          </div>
        </div>
        <div className={`text-right ${
          position.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          <div className="text-lg font-bold">
            {position.unrealizedPnl >= 0 ? '+' : ''}{formatCurrency(position.unrealizedPnl)}
          </div>
          <div className="text-sm">
            {((position.unrealizedPnl / position.margin) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-white/60 text-sm">Size</div>
          <div className="text-white font-medium">{formatNumber(position.size)}</div>
        </div>
        <div>
          <div className="text-white/60 text-sm">Entry Price</div>
          <div className="text-white font-medium">${formatPrice(position.entryPrice)}</div>
        </div>
        <div>
          <div className="text-white/60 text-sm">Mark Price</div>
          <div className="text-white font-medium">${formatPrice(position.markPrice)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Margin:</span>
          <span className="text-white">{formatCurrency(position.margin)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Margin Ratio:</span>
          <span className="text-white">{(position.marginRatio * 100).toFixed(2)}%</span>
        </div>
        {position.liquidationPrice && (
          <>
            <div className="flex justify-between">
              <span className="text-white/60">Liq. Price:</span>
              <span className="text-red-400">${formatPrice(position.liquidationPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Funding:</span>
              <span className={position.fundingPaid >= 0 ? 'text-green-400' : 'text-red-400'}>
                {formatCurrency(position.fundingPaid)}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  const OrderCard = ({ order }: { order: Order }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-medium text-lg">{order.symbol}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {order.side.toUpperCase()}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              {order.orderType.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${
            order.status === 'pending' ? 'text-yellow-400' :
            order.status === 'filled' ? 'text-green-400' :
            order.status === 'partial' ? 'text-blue-400' : 'text-red-400'
          }`}>
            {order.status.toUpperCase()}
          </div>
          <div className="text-white/60 text-xs">
            {order.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Size:</span>
          <span className="text-white">{formatNumber(order.size)}</span>
        </div>
        {order.price && (
          <div className="flex justify-between">
            <span className="text-white/60">Price:</span>
            <span className="text-white">${formatPrice(order.price)}</span>
          </div>
        )}
        {order.triggerPrice && (
          <div className="flex justify-between">
            <span className="text-white/60">Trigger:</span>
            <span className="text-white">${formatPrice(order.triggerPrice)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-white/60">Filled:</span>
          <span className="text-white">{formatNumber(order.filledSize)}</span>
        </div>
      </div>

      {(order.reduceOnly || order.postOnly) && (
        <div className="flex gap-2 mt-3">
          {order.reduceOnly && (
            <span className="px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400">
              Reduce Only
            </span>
          )}
          {order.postOnly && (
            <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
              Post Only
            </span>
          )}
        </div>
      )}

      <button className="w-full mt-4 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300">
        Cancel Order
      </button>
    </motion.div>
  );

  const TradingInterface = () => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-white font-medium text-lg mb-4">Trade {selectedMarket?.symbol}</h3>

      {/* Order Side */}
      <div className="flex mb-4">
        <button
          onClick={() => setOrderSide('buy')}
          className={`flex-1 py-3 rounded-l-xl font-medium transition-all duration-300 ${
            orderSide === 'buy'
              ? 'bg-green-500/30 text-green-400 border border-green-500/50'
              : 'bg-white/10 text-white/60 border border-white/20'
          }`}
        >
          Buy / Long
        </button>
        <button
          onClick={() => setOrderSide('sell')}
          className={`flex-1 py-3 rounded-r-xl font-medium transition-all duration-300 ${
            orderSide === 'sell'
              ? 'bg-red-500/30 text-red-400 border border-red-500/50'
              : 'bg-white/10 text-white/60 border border-white/20'
          }`}
        >
          Sell / Short
        </button>
      </div>

      {/* Order Type */}
      <div className="flex mb-4">
        <button
          onClick={() => setOrderType('market')}
          className={`flex-1 py-2 rounded-l-xl font-medium transition-all duration-300 ${
            orderType === 'market'
              ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
              : 'bg-white/10 text-white/60 border border-white/20'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('limit')}
          className={`flex-1 py-2 rounded-r-xl font-medium transition-all duration-300 ${
            orderType === 'limit'
              ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
              : 'bg-white/10 text-white/60 border border-white/20'
          }`}
        >
          Limit
        </button>
      </div>

      {/* Size Input */}
      <div className="mb-4">
        <label className="block text-white/60 text-sm mb-2">Size</label>
        <input
          type="number"
          value={orderSize}
          onChange={(e) => setOrderSize(e.target.value)}
          placeholder="0.00"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
        />
      </div>

      {/* Price Input (for limit orders) */}
      {orderType === 'limit' && (
        <div className="mb-4">
          <label className="block text-white/60 text-sm mb-2">Price</label>
          <input
            type="number"
            value={orderPrice}
            onChange={(e) => setOrderPrice(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          />
        </div>
      )}

      {/* Leverage (for perpetuals) */}
      {selectedMarket?.marketType === 'perp' && (
        <div className="mb-4">
          <label className="block text-white/60 text-sm mb-2">Leverage: {leverage}x</label>
          <input
            type="range"
            min="1"
            max={selectedMarket.maxLeverage || 50}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>1x</span>
            <span>{selectedMarket.maxLeverage || 50}x</span>
          </div>
        </div>
      )}

      {/* Order Options */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center gap-2 text-white/60 text-sm">
          <input
            type="checkbox"
            checked={reduceOnly}
            onChange={(e) => setReduceOnly(e.target.checked)}
            className="rounded"
          />
          Reduce Only
        </label>
        <label className="flex items-center gap-2 text-white/60 text-sm">
          <input
            type="checkbox"
            checked={postOnly}
            onChange={(e) => setPostOnly(e.target.checked)}
            className="rounded"
          />
          Post Only
        </label>
      </div>

      {/* Submit Button */}
      <button className={`w-full py-4 rounded-xl font-medium text-white transition-all duration-300 ${
        orderSide === 'buy'
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-red-500 hover:bg-red-600'
      }`}>
        {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedMarket?.baseAsset}
      </button>

      {/* Order Summary */}
      {orderSize && (orderType === 'market' || orderPrice) && (
        <div className="mt-4 p-4 bg-white/5 rounded-xl">
          <div className="text-white/60 text-sm mb-2">Order Summary</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Size:</span>
              <span className="text-white">{orderSize} {selectedMarket?.baseAsset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Price:</span>
              <span className="text-white">
                {orderType === 'market' ? 'Market' : `$${orderPrice}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Value:</span>
              <span className="text-white">
                {formatCurrency(
                  Number(orderSize) * (orderType === 'market'
                    ? selectedMarket?.markPrice || 0
                    : Number(orderPrice) || 0)
                )}
              </span>
            </div>
            {selectedMarket?.marketType === 'perp' && (
              <div className="flex justify-between">
                <span className="text-white/60">Margin:</span>
                <span className="text-white">
                  {formatCurrency(
                    (Number(orderSize) * (orderType === 'market'
                      ? selectedMarket?.markPrice || 0
                      : Number(orderPrice) || 0)) / leverage
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">Hyperliquid Terminal</h1>
          <p className="text-white/60">Advanced perpetual and spot trading</p>
        </div>
        <div className="flex items-center gap-4">
          <WalletSwitcher />
          <button
            onClick={() => refetch()}
            disabled={isQueryLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isQueryLoading ? 'animate-spin' : ''}`} />
            {isQueryLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
        {[
          { id: 'markets', label: 'Markets', icon: BarChart3 },
          { id: 'positions', label: 'Positions', icon: Target },
          { id: 'orders', label: 'Orders', icon: Activity },
          { id: 'funding', label: 'Funding', icon: Clock },
          { id: 'bridge', label: 'Bridge', icon: ArrowRightLeft }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
              selectedTab === tab.id
                ? 'bg-white/15 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
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
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  />
                </div>
                <select
                  value={selectedMarketType}
                  onChange={(e) => setSelectedMarketType(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-white/40"
                >
                  {MARKET_TYPES.map(type => (
                    <option key={type} value={type} className="bg-black">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Markets Grid */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30 mx-auto mb-4"></div>
                    <p className="text-white/60">Loading markets...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-white/70">{error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMarkets.map(market => (
                      <MarketCard
                        key={market.symbol}
                        market={market}
                        isInitialLoad={!hasInitiallyLoaded}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {selectedTab === 'positions' && (
            <div className="space-y-4">
              {positions.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No open positions</p>
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
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No active orders</p>
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
          )}

          {selectedTab === 'funding' && (
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-medium text-lg mb-4">Funding Rates</h3>
                <div className="space-y-3">
                  {markets.filter(m => m.marketType === 'perp').map(market => (
                    <div key={market.symbol} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <div>
                        <div className="text-white font-medium">{market.symbol}</div>
                        <div className="text-white/60 text-sm">
                          Next funding: {getTimeUntilFunding(market.nextFunding)}
                        </div>
                      </div>
                      <div className={`text-lg font-medium ${
                        (market.fundingRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {((market.fundingRate || 0) * 100).toFixed(4)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                id: selectedMarket.symbol,
                symbol: selectedMarket.symbol,
                markPrice: selectedMarket.markPrice,
                type: 'hyperliquid',
              }}
              platform="hyperliquid"
              onTradeComplete={() => {
                // Refresh positions after trade
                if (selectedTab === 'positions') {
                  // Trigger position refresh
                }
              }}
            />
          )}

          {/* Trading Interface */}
          {selectedMarket && <TradingInterface />}

          {/* Order Book */}
          {selectedMarket && orderBook && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-medium text-lg mb-4">Order Book</h3>
              <div className="space-y-4">
                {/* Asks */}
                <div>
                  <div className="text-red-400 text-sm font-medium mb-2">Asks</div>
                  <div className="space-y-1">
                    {orderBook.asks.slice().reverse().map((ask, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-red-400">${formatPrice(ask.price)}</span>
                        <span className="text-white/60">{formatNumber(ask.size)}</span>
                        <span className="text-white/40">{formatNumber(ask.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spread */}
                <div className="text-center py-2 border-y border-white/10">
                  <div className="text-white/60 text-sm">
                    Spread: ${formatPrice(orderBook.spread)}
                  </div>
                </div>

                {/* Bids */}
                <div>
                  <div className="text-green-400 text-sm font-medium mb-2">Bids</div>
                  <div className="space-y-1">
                    {orderBook.bids.map((bid, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-green-400">${formatPrice(bid.price)}</span>
                        <span className="text-white/60">{formatNumber(bid.size)}</span>
                        <span className="text-white/40">{formatNumber(bid.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Summary */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-medium text-lg mb-4">Portfolio Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Total P&L</span>
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
                <span className="text-white/60">Total Margin</span>
                <span className="text-white font-medium">
                  {formatCurrency(positions.reduce((sum, pos) => sum + pos.margin, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Active Positions</span>
                <span className="text-white font-medium">{positions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Open Orders</span>
                <span className="text-white font-medium">{orders.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
