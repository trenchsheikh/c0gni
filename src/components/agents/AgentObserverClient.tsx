'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  BarChart3,
  Settings,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';
import { AnimatedContainer } from "@/components/dashboard/client/AnimatedContainer";
import { useAgentWebSocket, type AgentState, type MarketEvent } from '@/lib/websocket';

interface TradingSignal {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  price_target: number;
  reason: string;
  timestamp: string;
}

const statusColors = {
  idle: 'text-blue-400 bg-blue-400/20',
  working: 'text-green-400 bg-green-400/20',
  error: 'text-red-400 bg-red-400/20',
  stopped: 'text-gray-400 bg-gray-400/20'
};

const eventTypeIcons = {
  trade_executed: DollarSign,
  signal_generated: TrendingUp,
  risk_alert: AlertTriangle,
  position_opened: Activity,
  position_closed: CheckCircle
};

export function AgentObserverClient() {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<MarketEvent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { client, connect, disconnect, subscribe, requestAgentData, requestEvents } = useAgentWebSocket();

  // WebSocket connection and data updates
  useEffect(() => {
    const connectToWebSocket = async () => {
      try {
        await connect();
        setIsConnected(true);

        // Subscribe to agent updates
        const unsubscribeAgents = subscribe('agents', (agentData: AgentState[]) => {
          setAgents(agentData);
        });

        // Subscribe to events
        const unsubscribeEvents = subscribe('events', (eventData: MarketEvent[]) => {
          setRealtimeEvents(prev => {
            const newEvents = eventData.filter(event => 
              !prev.some(existing => existing.id === event.id)
            );
            return [...newEvents, ...prev].slice(0, 20); // Keep last 20 events
          });
        });

        // Subscribe to connection status
        const unsubscribeConnection = subscribe('connection', (connectionData: any) => {
          setIsConnected(connectionData.status === 'connected');
        });

        // Initial data request
        requestAgentData();
        requestEvents(20);

        return () => {
          unsubscribeAgents();
          unsubscribeEvents();
          unsubscribeConnection();
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
      }
    };

    if (autoRefresh) {
      connectToWebSocket();
    }

    return () => {
      disconnect();
    };
  }, [autoRefresh]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-8">
        {/* Header */}
        <AnimatedContainer className="text-center">
          <h1 className="text-5xl font-light text-white mb-4">
            Agent Observer
          </h1>
          <p className="text-white/60 text-xl">
            Real-time monitoring of autonomous trading agents
          </p>
        </AnimatedContainer>

        {/* Connection Status & Controls */}
        <AnimatedContainer delay={0.1}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                  <span className="text-white font-medium">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="text-white/60 text-sm">
                  {agents.length} agents active
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    autoRefresh 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-white/10 text-white/60 border border-white/20'
                  }`}
                >
                  {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {autoRefresh ? 'Pause' : 'Resume'}
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Agents Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.agent_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              onClick={() => setSelectedAgent(selectedAgent === agent.agent_id ? null : agent.agent_id)}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 cursor-pointer hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">
                    {agent.agent_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <p className="text-white/40 text-sm">
                    {agent.agent_id}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[agent.status]}`}>
                    {agent.status}
                  </div>
                  <Brain className="w-5 h-5 text-white/60" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-white/40 text-xs mb-1">Portfolio Value</p>
                  <p className="text-white font-medium">
                    {formatCurrency(agent.portfolio_value)}
                  </p>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs mb-1">Daily P&L</p>
                  <p className={`font-medium ${agent.daily_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(agent.daily_pnl)}
                  </p>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs mb-1">Win Rate</p>
                  <p className="text-white font-medium">
                    {formatPercentage(agent.win_rate)}
                  </p>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs mb-1">Trades Today</p>
                  <p className="text-white font-medium">
                    {agent.trade_count}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">
                    {agent.active_positions} positions
                  </span>
                </div>
                
                <div className="text-white/40 text-xs">
                  {getTimeAgo(agent.last_activity)}
                </div>
              </div>

              {/* Detailed view when selected */}
              <AnimatePresence>
                {selectedAgent === agent.agent_id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Performance Score</span>
                        <span className="text-white font-medium">
                          {formatPercentage(agent.performance_score)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Risk Level</span>
                        <span className="text-white font-medium capitalize">
                          {agent.risk_level}
                        </span>
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${agent.performance_score * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Real-time Events Feed */}
        <AnimatedContainer delay={0.4}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Live Events</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/60 text-sm">Live</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realtimeEvents.map((event, index) => {
                const Icon = eventTypeIcons[event.event_type];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className={`p-2 rounded-xl ${
                      event.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      event.severity === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium text-sm">
                          {event.event_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <span className="text-white/40 text-xs">
                          {getTimeAgo(event.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm mt-1">
                        {event.agent_id} • {event.data?.symbol || 'System'}
                        {event.data?.amount && ` • ${formatCurrency(event.data.amount)}`}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              
              {realtimeEvents.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-white/40 mx-auto mb-3" />
                  <p className="text-white/40">Waiting for events...</p>
                </div>
              )}
            </div>
          </div>
        </AnimatedContainer>
    </div>
  );
}
