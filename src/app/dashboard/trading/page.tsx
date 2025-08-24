'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  StopCircle, 
  Settings, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Timer
} from "lucide-react";

const activePositions = [
  {
    id: "pos-001",
    token: "$BONK",
    amount: "2.5 SOL",
    entryPrice: 0.0000234,
    currentPrice: 0.0000287,
    pnl: "+0.6 SOL",
    pnlPercent: "+23.8%",
    size: "$127.50",
    status: "profitable",
    entryTime: "2m ago"
  },
  {
    id: "pos-002", 
    token: "$PEPE",
    amount: "1.8 SOL",
    entryPrice: 0.00000891,
    currentPrice: 0.00000823,
    pnl: "-0.15 SOL",
    pnlPercent: "-7.6%",
    size: "$91.80",
    status: "losing",
    entryTime: "5m ago"
  },
  {
    id: "pos-003",
    token: "$WIF", 
    amount: "3.2 SOL",
    entryPrice: 2.34,
    currentPrice: 2.71,
    pnl: "+0.5 SOL",
    pnlPercent: "+15.8%",
    size: "$163.20",
    status: "profitable",
    entryTime: "12m ago"
  }
];

const pendingOrders = [
  {
    id: "order-001",
    type: "snipe",
    token: "$WOJAK",
    amount: "1.0 SOL",
    triggerPrice: 0.00045,
    currentPrice: 0.00048,
    status: "waiting",
    priority: "high"
  },
  {
    id: "order-002",
    type: "arbitrage", 
    token: "$BONK",
    spread: "0.23%",
    amount: "0.8 SOL",
    exchanges: "Jupiter → Raydium",
    status: "processing",
    priority: "medium"
  },
  {
    id: "order-003",
    type: "stop-loss",
    token: "$PEPE", 
    amount: "1.8 SOL",
    triggerPrice: 0.00000750,
    currentPrice: 0.00000823,
    status: "monitoring",
    priority: "high"
  }
];

const executionHistory = [
  {
    id: "exec-001",
    action: "Buy $BONK",
    amount: "2.5 SOL",
    price: 0.0000234,
    result: "Success",
    txHash: "4xK2m9...",
    timestamp: "2m ago",
    pnl: "+0.6 SOL"
  },
  {
    id: "exec-002", 
    action: "Sell $DOGE",
    amount: "1.2 SOL", 
    price: 0.087,
    result: "Success",
    txHash: "7nR5p1...",
    timestamp: "8m ago",
    pnl: "+0.3 SOL"
  },
  {
    id: "exec-003",
    action: "Snipe $WIF",
    amount: "3.2 SOL",
    price: 2.34,
    result: "Success", 
    txHash: "9mT8x3...",
    timestamp: "12m ago",
    pnl: "+0.5 SOL"
  }
];

const jitoMetrics = {
  bundleSuccessRate: 94.2,
  avgConfirmationTime: "1.8s",
  currentTip: "0.001 SOL",
  queuePosition: 3,
  priorityFeeEst: "0.0005 SOL"
};

export default function TradingTerminal() {
  const [mevProtection, setMevProtection] = useState(true);
  const [autoExitEnabled, setAutoExitEnabled] = useState(true);
  const [takeProfitLevel, setTakeProfitLevel] = useState(200);
  const [stopLossLevel, setStopLossLevel] = useState(50);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light text-white mb-2">Trading Terminal</h1>
        <p className="text-white/60">Monitor and control live trading activity</p>
      </motion.div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Portfolio Value", value: "12.3 SOL", change: "+2.1 SOL", icon: DollarSign, color: "text-green-400" },
          { label: "Active Positions", value: "3", change: "+1", icon: TrendingUp, color: "text-blue-400" },
          { label: "24h PnL", value: "+1.4 SOL", change: "+11.4%", icon: Target, color: "text-green-400" },
          { label: "Success Rate", value: "87.3%", change: "+2.1%", icon: CheckCircle, color: "text-green-400" }
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
                  <div className={`text-sm ${stat.color} mt-1`}>{stat.change}</div>
                </div>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Positions */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Active Positions</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                  Close All
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                  <Settings className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {activePositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.08] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-white font-bold text-lg">{position.token}</div>
                      <div className="text-white/60 text-sm">{position.amount}</div>
                      <div className="text-white/40 text-sm">• {position.entryTime}</div>
                    </div>
                    <div className={`text-right ${
                      position.status === 'profitable' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <div className="font-bold">{position.pnl}</div>
                      <div className="text-sm">{position.pnlPercent}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-white/40">Entry Price</div>
                      <div className="text-white font-mono">{position.entryPrice.toFixed(8)}</div>
                    </div>
                    <div>
                      <div className="text-white/40">Current Price</div>
                      <div className="text-white font-mono">{position.currentPrice.toFixed(8)}</div>
                    </div>
                    <div>
                      <div className="text-white/40">Size</div>
                      <div className="text-white font-mono">{position.size}</div>
                    </div>
                    <div className="text-right">
                      <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors">
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pending Orders & Jito Integration */}
        <div className="space-y-6">
          {/* Jito Integration Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-medium text-white mb-4">Jito Integration</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <div className="text-white/60 text-sm">Bundle Success Rate</div>
                  <div className="text-white text-lg font-medium">{jitoMetrics.bundleSuccessRate}%</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="text-white/60 text-xs">Confirmation Time</div>
                  <div className="text-white text-sm font-mono">{jitoMetrics.avgConfirmationTime}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="text-white/60 text-xs">Queue Position</div>
                  <div className="text-white text-sm font-mono">#{jitoMetrics.queuePosition}</div>
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Tip Optimization</span>
                  <button className="text-blue-400 text-xs">Auto</button>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="0.0001" 
                    max="0.01" 
                    step="0.0001" 
                    defaultValue="0.001"
                    className="flex-1 h-1 bg-white/20 rounded-lg appearance-none slider"
                  />
                  <span className="text-white text-sm font-mono min-w-fit">{jitoMetrics.currentTip}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pending Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-medium text-white mb-4">Pending Orders</h3>
            
            <div className="space-y-3">
              {pendingOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-white text-sm font-medium">{order.type}</div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        order.priority === 'high' ? 'text-red-400 bg-red-400/20' :
                        order.priority === 'medium' ? 'text-yellow-400 bg-yellow-400/20' :
                        'text-green-400 bg-green-400/20'
                      }`}>
                        {order.priority}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      order.status === 'processing' ? 'text-blue-400 bg-blue-400/20' :
                      order.status === 'waiting' ? 'text-yellow-400 bg-yellow-400/20' :
                      'text-white/60 bg-white/10'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="text-white/80 text-sm mb-1">{order.token}</div>
                  <div className="text-white/60 text-xs">
                    {order.amount} • 
                    {order.triggerPrice && ` Trigger: ${order.triggerPrice}`}
                    {order.spread && ` Spread: ${order.spread}`}
                    {order.exchanges && ` ${order.exchanges}`}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auto-Exit Rules Engine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">Auto-Exit Rules Engine</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Auto-Exit</span>
              <button
                onClick={() => setAutoExitEnabled(!autoExitEnabled)}
                className={`w-10 h-6 rounded-full transition-all duration-300 ${
                  autoExitEnabled ? 'bg-green-400' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  autoExitEnabled ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">MEV Protection</span>
              <button
                onClick={() => setMevProtection(!mevProtection)}
                className={`w-10 h-6 rounded-full transition-all duration-300 ${
                  mevProtection ? 'bg-green-400' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  mevProtection ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Take Profit
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Level</span>
                  <span className="text-white text-sm font-mono">{takeProfitLevel}%</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="500" 
                  value={takeProfitLevel}
                  onChange={(e) => setTakeProfitLevel(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <CheckCircle className="w-3 h-3" />
                Applied to all positions
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <StopCircle className="w-4 h-4" />
              Stop Loss
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Level</span>
                  <span className="text-white text-sm font-mono">-{stopLossLevel}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="90" 
                  value={stopLossLevel}
                  onChange={(e) => setStopLossLevel(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <AlertTriangle className="w-3 h-3" />
                High risk threshold
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Time-Based Exit
            </h4>
            <div className="space-y-3">
              <div>
                <div className="text-white/60 text-sm mb-2">Exit after</div>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                  <option>5 minutes</option>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>Never</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Clock className="w-3 h-3" />
                Prevents bag holding
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Execution History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">Execution History</h3>
          <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">View All</button>
        </div>

        <div className="space-y-3">
          {executionHistory.map((execution, index) => (
            <motion.div
              key={execution.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <div className="text-white text-sm font-medium">{execution.action}</div>
                  <div className="text-white/60 text-xs">{execution.amount} @ {execution.price.toFixed(8)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-green-400 text-sm font-medium">{execution.pnl}</div>
                  <div className="text-white/40 text-xs">{execution.timestamp}</div>
                </div>
                <button className="p-1 hover:bg-white/10 rounded">
                  <ExternalLink className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}