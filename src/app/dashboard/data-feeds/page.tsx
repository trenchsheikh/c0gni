'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  TrendingUp, 
  MessageCircle, 
  Wallet, 
  Globe, 
  Eye, 
  Filter, 
  Settings, 
  Volume2, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  BarChart3
} from "lucide-react";

const dataStreams = [
  {
    id: "pump-new-mints",
    source: "Pump.fun",
    type: "New Mints",
    icon: Zap,
    status: "active",
    latestEvent: "BONK2.0 launched with 15 SOL LP",
    timestamp: "3s ago",
    volume: 847,
    confidence: 89
  },
  {
    id: "tensor-nft", 
    source: "Tensor",
    type: "NFT Activity",
    icon: Activity,
    status: "active", 
    latestEvent: "DeGods floor price spike +12%",
    timestamp: "8s ago",
    volume: 234,
    confidence: 76
  },
  {
    id: "telegram-sentiment",
    source: "Telegram",
    type: "Social Sentiment",
    icon: MessageCircle,
    status: "active",
    latestEvent: "'PEPE' mentioned 450x in 10min",
    timestamp: "12s ago", 
    volume: 1205,
    confidence: 67
  },
  {
    id: "twitter-signals",
    source: "X (Twitter)",
    type: "Social Signals", 
    icon: Globe,
    status: "warning",
    latestEvent: "API rate limit approaching",
    timestamp: "2m ago",
    volume: 892,
    confidence: 45
  },
  {
    id: "whale-movements", 
    source: "On-Chain",
    type: "Wallet Movements",
    icon: Wallet,
    status: "active",
    latestEvent: "Whale accumulated 50k $BONK",
    timestamp: "5m ago",
    volume: 156,
    confidence: 94
  },
  {
    id: "dex-arbitrage",
    source: "DEX Monitor", 
    type: "Price Deltas",
    icon: TrendingUp,
    status: "active",
    latestEvent: "$WIF 0.34% spread Jupiter→Raydium",
    timestamp: "1m ago",
    volume: 634,
    confidence: 82
  }
];

const recentEvents = [
  {
    id: "event-001",
    source: "Pump.fun",
    event: "New mint detected: $WOJAK",
    details: "15 SOL initial LP, clean contract, 0% fees",
    confidence: 92,
    timestamp: "5s ago",
    priority: "high"
  },
  {
    id: "event-002", 
    source: "Telegram",
    event: "Social velocity spike: $BONK",
    details: "450 mentions in 'Alpha Hunters' channel",
    confidence: 78,
    timestamp: "23s ago",
    priority: "medium"
  },
  {
    id: "event-003",
    source: "On-Chain",
    event: "Whale wallet movement",
    details: "0x7A2b... transferred 100 SOL to DEX",
    confidence: 89,
    timestamp: "1m ago", 
    priority: "high"
  },
  {
    id: "event-004",
    source: "DEX Monitor", 
    event: "Arbitrage opportunity",
    details: "$PEPE 0.23% spread, 5min window",
    confidence: 85,
    timestamp: "2m ago",
    priority: "medium"
  },
  {
    id: "event-005",
    source: "Tensor",
    event: "NFT collection activity",
    details: "Mad Lads volume +67% in 1h",
    confidence: 71,
    timestamp: "3m ago",
    priority: "low"
  }
];

const sourceMetrics = [
  { name: "Pump.fun", activity: 847, uptime: 99.8, accuracy: 94.2 },
  { name: "Telegram", activity: 1205, uptime: 98.1, accuracy: 78.9 },
  { name: "X (Twitter)", activity: 892, uptime: 96.7, accuracy: 67.3 },
  { name: "On-Chain", activity: 156, uptime: 100.0, accuracy: 96.8 },
  { name: "Tensor", activity: 234, uptime: 99.2, accuracy: 82.1 },
  { name: "DEX Monitor", activity: 634, uptime: 99.5, accuracy: 88.7 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/20';
    case 'warning': return 'text-yellow-400 bg-yellow-400/20';
    case 'error': return 'text-red-400 bg-red-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-400 bg-red-400/20';
    case 'medium': return 'text-yellow-400 bg-yellow-400/20'; 
    case 'low': return 'text-green-400 bg-green-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

export default function DataFeedConsole() {
  const [noiseThreshold, setNoiseThreshold] = useState(50);
  const [autoFilter, setAutoFilter] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light text-white mb-2">Data Feed Console</h1>
        <p className="text-white/60">Real-time data ingestion and signal detection</p>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">Signal Filters</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Auto Filter</span>
              <button
                onClick={() => setAutoFilter(!autoFilter)}
                className={`w-10 h-6 rounded-full transition-all duration-300 ${
                  autoFilter ? 'bg-green-400' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  autoFilter ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Noise Threshold
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Confidence Level</span>
                <span className="text-white text-sm font-mono">{noiseThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={noiseThreshold}
                onChange={(e) => setNoiseThreshold(Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none"
              />
              <div className="text-xs text-white/40">
                Events below {noiseThreshold}% confidence are filtered
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Volume Filters
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Min LP Size</span>
                <span className="text-white">5 SOL</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Min Social Mentions</span>
                <span className="text-white">50/10min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Min Wallet Transfer</span>
                <span className="text-white">10 SOL</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Source Priority
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">On-Chain Data</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Pump.fun API</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Social Signals</span>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Live Data Streams */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Live Data Streams</h3>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live • {dataStreams.length} Sources
              </div>
            </div>

            <div className="space-y-4">
              {dataStreams.map((stream, index) => {
                const StreamIcon = stream.icon;
                
                return (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedSource(selectedSource === stream.id ? null : stream.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      selectedSource === stream.id 
                        ? 'bg-white/10 border-white/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <StreamIcon className="w-5 h-5 text-white/80" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{stream.source}</span>
                            <span className="text-white/40 text-sm">• {stream.type}</span>
                          </div>
                          <div className="text-white/60 text-sm mt-1">{stream.latestEvent}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <div className="text-white/60">Events/h</div>
                          <div className="text-white font-mono">{stream.volume}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-white/60">Confidence</div>
                          <div className="text-white font-mono">{stream.confidence}%</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(stream.status)}`}>
                          {stream.status === 'active' ? <CheckCircle className="w-3 h-3" /> : 
                           stream.status === 'warning' ? <AlertCircle className="w-3 h-3" /> :
                           <Clock className="w-3 h-3" />}
                          {stream.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>Last event: {stream.timestamp}</span>
                      <div className="w-16 h-1 bg-white/10 rounded-full">
                        <motion.div 
                          className="h-1 bg-green-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (stream.confidence * 1.2))}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Recent Events</h3>
          
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-white text-sm font-medium">{event.event}</div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(event.priority)}`}>
                    {event.priority}
                  </div>
                </div>
                
                <div className="text-white/60 text-xs mb-2">{event.details}</div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">{event.source} • {event.timestamp}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1 bg-white/10 rounded-full">
                      <div 
                        className="h-1 bg-green-400 rounded-full"
                        style={{ width: `${event.confidence}%` }}
                      />
                    </div>
                    <span className="text-white/60 text-xs ml-1">{event.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm transition-colors">
            View All Events
          </button>
        </motion.div>
      </div>

      {/* Data Source Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Data Source Heatmap</h3>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sourceMetrics.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.08] transition-colors"
            >
              <div className="text-center">
                <div className="text-white text-sm font-medium mb-2">{source.name}</div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-white/60">Activity</div>
                    <div className="text-white font-mono">{source.activity}/h</div>
                  </div>
                  <div>
                    <div className="text-white/60">Uptime</div>
                    <div className={`font-mono ${source.uptime > 99 ? 'text-green-400' : source.uptime > 95 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {source.uptime}%
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60">Accuracy</div>
                    <div className={`font-mono ${source.accuracy > 90 ? 'text-green-400' : source.accuracy > 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {source.accuracy}%
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${source.activity > 800 ? 'bg-red-400' : source.activity > 400 ? 'bg-yellow-400' : 'bg-green-400'}`}
                    style={{ width: `${Math.min(100, (source.activity / 1200) * 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-white/60">Low Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-white/60">Medium Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-white/60">High Activity</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}