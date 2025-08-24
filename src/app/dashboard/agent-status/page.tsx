'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Zap, 
  Eye, 
  Brain, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  ArrowRightLeft, 
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const agentStatuses = [
  {
    id: "scout-001",
    role: "Scout",
    icon: Eye,
    status: "active",
    latency: 127,
    uptime: 99.7,
    lastAction: "Detected new mint: BONK2.0 — 2.1x potential",
    lastActionTime: "12s ago",
    color: "green"
  },
  {
    id: "analyzer-001", 
    role: "Analyzer",
    icon: Brain,
    status: "active",
    latency: 243,
    uptime: 98.9,
    lastAction: "Approved contract: Clean code, no honeypot",
    lastActionTime: "1m ago",
    color: "green"
  },
  {
    id: "trader-001",
    role: "Trader", 
    icon: TrendingUp,
    status: "idle",
    latency: 89,
    uptime: 99.2,
    lastAction: "Sniped $PEPE — 1.8x exit",
    lastActionTime: "5m ago", 
    color: "blue"
  },
  {
    id: "hedger-001",
    role: "Hedger",
    icon: Shield,
    status: "error",
    latency: 0,
    uptime: 87.3,
    lastAction: "Failed to execute hedge: Slippage too high",
    lastActionTime: "8m ago",
    color: "red"
  },
  {
    id: "monitor-001",
    role: "Monitor",
    icon: BarChart3,
    status: "learning",
    latency: 156,
    uptime: 96.8,
    lastAction: "Analyzing pattern: Sunday morning volatility",
    lastActionTime: "2m ago",
    color: "yellow"
  },
  {
    id: "arbitrage-001",
    role: "Arb Engine",
    icon: ArrowRightLeft,
    status: "active",
    latency: 312,
    uptime: 94.1,
    lastAction: "Found arb: Jupiter vs Raydium 0.23% spread",
    lastActionTime: "30s ago",
    color: "green"
  }
];

const executionQueue = [
  {
    id: "exec-001",
    action: "Snipe $WOJAK",
    agent: "trader-001",
    status: "pending",
    priority: "high",
    estimatedTime: "~2s"
  },
  {
    id: "exec-002", 
    action: "Verify contract safety",
    agent: "analyzer-001",
    status: "processing",
    priority: "medium",
    estimatedTime: "~5s"
  },
  {
    id: "exec-003",
    action: "Execute arbitrage trade",
    agent: "arbitrage-001", 
    status: "waiting",
    priority: "medium",
    estimatedTime: "~8s"
  },
  {
    id: "exec-004",
    action: "Rebalance LP position",
    agent: "balancer-001",
    status: "waiting",
    priority: "low",
    estimatedTime: "~15s"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/20';
    case 'idle': return 'text-blue-400 bg-blue-400/20';
    case 'error': return 'text-red-400 bg-red-400/20';
    case 'learning': return 'text-yellow-400 bg-yellow-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return CheckCircle;
    case 'idle': return Clock;
    case 'error': return XCircle;
    case 'learning': return Brain;
    default: return Activity;
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

export default function AgentStatusMonitor() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light text-white mb-2">Agent Status Monitor</h1>
        <p className="text-white/60">Real-time health and performance of all active agents</p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: "4", icon: CheckCircle, color: "text-green-400" },
          { label: "Avg Latency", value: "156ms", icon: Zap, color: "text-blue-400" },
          { label: "Success Rate", value: "94.2%", icon: TrendingUp, color: "text-green-400" },
          { label: "Queue Depth", value: "4", icon: Clock, color: "text-yellow-400" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                  <div className="text-white text-2xl font-light mt-1">{stat.value}</div>
                </div>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Agent Status Grid */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Agent Status Grid</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                  <RotateCcw className="w-4 h-4 text-white/60" />
                </button>
                <div className="text-sm text-white/60">Auto-refresh: 2s</div>
              </div>
            </div>

            <div className="space-y-3">
              {agentStatuses.map((agent, index) => {
                const AgentIcon = agent.icon;
                const StatusIcon = getStatusIcon(agent.status);
                
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      selectedAgent === agent.id 
                        ? 'bg-white/10 border-white/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <AgentIcon className="w-5 h-5 text-white/80" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{agent.role}</span>
                              <span className="text-white/40 text-sm font-mono">#{agent.id}</span>
                            </div>
                            <div className="text-white/60 text-sm mt-1">{agent.lastAction}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-white/60 text-xs">Latency</div>
                          <div className="text-white text-sm font-mono">{agent.latency}ms</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/60 text-xs">Uptime</div>
                          <div className="text-white text-sm font-mono">{agent.uptime}%</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(agent.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {agent.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                      <span>Last action: {agent.lastActionTime}</span>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Pause className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Play className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Execution Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Execution Queue</h3>
          
          <div className="space-y-3">
            {executionQueue.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white text-sm font-medium">{item.action}</div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span className="font-mono">{item.agent}</span>
                  <span>{item.estimatedTime}</span>
                </div>
                
                <div className="mt-2">
                  {item.status === 'processing' ? (
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <motion.div 
                        className="bg-blue-400 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  ) : (
                    <div className={`text-xs px-2 py-1 rounded ${
                      item.status === 'pending' ? 'text-yellow-400 bg-yellow-400/20' :
                      item.status === 'waiting' ? 'text-white/60 bg-white/10' :
                      'text-green-400 bg-green-400/20'
                    }`}>
                      {item.status}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-white/5 rounded-xl">
            <div className="text-white/60 text-sm mb-2">Queue Performance</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-white/40">Avg Wait Time</div>
                <div className="text-white font-mono">2.3s</div>
              </div>
              <div>
                <div className="text-white/40">Success Rate</div>
                <div className="text-white font-mono">96.7%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-4">System Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-red-400 text-sm font-medium">Hedger Agent Error</div>
              <div className="text-white/60 text-xs">Agent hedger-001 failed to execute hedge due to high slippage</div>
            </div>
            <div className="text-red-400/60 text-xs ml-auto">8m ago</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-yellow-400 text-sm font-medium">High Queue Depth</div>
              <div className="text-white/60 text-xs">Execution queue has 4+ pending actions</div>
            </div>
            <div className="text-yellow-400/60 text-xs ml-auto">2m ago</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Eye className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-blue-400 text-sm font-medium">New Opportunity Detected</div>
              <div className="text-white/60 text-xs">Scout found high-potential mint: BONK2.0 with 2.1x potential</div>
            </div>
            <div className="text-blue-400/60 text-xs ml-auto">12s ago</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}