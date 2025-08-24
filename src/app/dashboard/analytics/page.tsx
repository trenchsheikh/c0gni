'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Target, 
  Users, 
  Zap, 
  ExternalLink, 
  Download, 
  Calendar, 
  Activity, 
  Award, 
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react";

const portfolioMetrics = {
  totalROI: {
    sol: "+15.7 SOL",
    cogni: "+2,340 $C0GNI", 
    percentage: "+47.3%"
  },
  winRate: 82.4,
  sharpeRatio: 2.18,
  maxDrawdown: -8.3,
  totalTrades: 247,
  avgHoldTime: "4.2min",
  bestTrade: "+3.2x on $BONK",
  worstTrade: "-0.8 SOL on $DOGE"
};

const agentContributions = [
  { agent: "Scout", role: "Discovery", contribution: 78.2, value: "+12.3 SOL", color: "bg-blue-400" },
  { agent: "Analyzer", role: "Safety", contribution: 89.1, value: "+0.8 SOL", color: "bg-green-400" },
  { agent: "Trader", role: "Execution", contribution: 67.3, value: "+11.2 SOL", color: "bg-purple-400" },
  { agent: "Hedger", role: "Risk Mgmt", contribution: 45.8, value: "-2.1 SOL", color: "bg-red-400" },
  { agent: "Monitor", role: "Analytics", contribution: 92.7, value: "+1.1 SOL", color: "bg-yellow-400" },
  { agent: "Arb Engine", role: "Arbitrage", contribution: 71.9, value: "+3.4 SOL", color: "bg-cyan-400" }
];

const performanceData = [
  { time: "6h", pnl: -0.2, cumulative: 12.1 },
  { time: "5h", pnl: +1.8, cumulative: 12.3 },
  { time: "4h", pnl: +0.5, cumulative: 14.1 },
  { time: "3h", pnl: -0.8, cumulative: 14.6 },
  { time: "2h", pnl: +2.1, cumulative: 13.8 },
  { time: "1h", pnl: +1.2, cumulative: 15.9 },
  { time: "now", pnl: +0.4, cumulative: 17.1 }
];

const latencyMetrics = [
  { stage: "Detection", target: 200, actual: 127, status: "good" },
  { stage: "Analysis", target: 500, actual: 342, status: "good" },
  { stage: "Decision", target: 100, actual: 89, status: "excellent" },
  { stage: "Execution", target: 300, actual: 456, status: "warning" },
  { stage: "Settlement", target: 2000, actual: 1834, status: "good" }
];

const benchmarkComparison = [
  { benchmark: "Top 10 Pump.fun Traders", ourPerformance: 47.3, benchmarkPerformance: 34.1, status: "outperform" },
  { benchmark: "Solana DeFi Index", ourPerformance: 47.3, benchmarkPerformance: 28.9, status: "outperform" },
  { benchmark: "Meme Coin Alpha Fund", ourPerformance: 47.3, benchmarkPerformance: 52.7, status: "underperform" },
  { benchmark: "Manual Trading Avg", ourPerformance: 47.3, benchmarkPerformance: 12.4, status: "outperform" }
];

const recentTrades = [
  {
    id: "trade-001",
    token: "$BONK",
    type: "Snipe",
    entry: 0.0000234,
    exit: 0.0000389,
    pnl: "+1.8 SOL",
    multiplier: "1.66x",
    timestamp: "2m ago",
    txHash: "4xK2m9nR5p..."
  },
  {
    id: "trade-002", 
    token: "$PEPE",
    type: "Scalp",
    entry: 0.00000891,
    exit: 0.00000934,
    pnl: "+0.4 SOL", 
    multiplier: "1.05x",
    timestamp: "8m ago",
    txHash: "7nR5p1mT8x..."
  },
  {
    id: "trade-003",
    token: "$WIF",
    type: "Swing", 
    entry: 2.34,
    exit: 4.91,
    pnl: "+2.1 SOL",
    multiplier: "2.1x",
    timestamp: "15m ago",
    txHash: "9mT8x3bC5k..."
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-400 bg-green-400/20';
    case 'good': return 'text-blue-400 bg-blue-400/20';
    case 'warning': return 'text-yellow-400 bg-yellow-400/20';
    case 'poor': return 'text-red-400 bg-red-400/20';
    case 'outperform': return 'text-green-400';
    case 'underperform': return 'text-red-400';
    default: return 'text-white/60';
  }
};

export default function PnLAnalytics() {
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light text-white mb-2">Performance & PnL Analytics</h1>
            <p className="text-white/60">On-chain verified performance and detailed analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm"
            >
              <option value="1h">1 Hour</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total ROI", value: portfolioMetrics.totalROI.percentage, subValue: portfolioMetrics.totalROI.sol, icon: TrendingUp, color: "text-green-400" },
          { label: "Win Rate", value: `${portfolioMetrics.winRate}%`, subValue: `${portfolioMetrics.totalTrades} trades`, icon: Target, color: "text-green-400" },
          { label: "Sharpe Ratio", value: portfolioMetrics.sharpeRatio, subValue: "Risk-adjusted", icon: Award, color: "text-blue-400" },
          { label: "Max Drawdown", value: `${portfolioMetrics.maxDrawdown}%`, subValue: "Peak to trough", icon: TrendingDown, color: "text-red-400" }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/60 text-sm">{metric.label}</div>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="text-white text-2xl font-light">{metric.value}</div>
              <div className="text-white/40 text-sm mt-1">{metric.subValue}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Portfolio Performance</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white/60">Cumulative PnL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white/60">Hourly PnL</span>
                </div>
              </div>
            </div>

            <div className="h-64 bg-white/5 rounded-2xl p-4 mb-4">
              <div className="flex items-end justify-between h-full gap-2">
                {performanceData.map((point, index) => (
                  <div key={index} className="flex flex-col items-center justify-end h-full flex-1">
                    <div className="flex flex-col items-center gap-1 mb-2">
                      <div 
                        className={`w-full rounded-t ${point.pnl >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ 
                          height: `${Math.abs(point.pnl) * 20}px`,
                          transform: point.pnl < 0 ? 'scaleY(-1)' : 'none'
                        }}
                      />
                      <div className="text-xs text-white/60">{point.pnl > 0 ? '+' : ''}{point.pnl}</div>
                    </div>
                    <div 
                      className="bg-blue-400/50 rounded-t w-full"
                      style={{ height: `${(point.cumulative / 20) * 100}px` }}
                    />
                    <div className="text-xs text-white/40 mt-1">{point.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-white/60">Best Trade</div>
                <div className="text-green-400 font-medium">{portfolioMetrics.bestTrade}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-white/60">Avg Hold Time</div>
                <div className="text-white font-medium">{portfolioMetrics.avgHoldTime}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-white/60">Worst Trade</div>
                <div className="text-red-400 font-medium">{portfolioMetrics.worstTrade}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Agent Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Agent Contributions</h3>
          
          <div className="space-y-4">
            {agentContributions.map((agent, index) => (
              <motion.div
                key={agent.agent}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedAgent(selectedAgent === agent.agent ? null : agent.agent)}
                className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedAgent === agent.agent 
                    ? 'bg-white/10 border-white/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-medium">{agent.agent}</div>
                    <div className="text-white/60 text-sm">{agent.role}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${agent.contribution > 70 ? 'text-green-400' : agent.contribution > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {agent.contribution}%
                    </div>
                    <div className="text-white/60 text-sm">{agent.value}</div>
                  </div>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div 
                    className={`h-2 rounded-full ${agent.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.contribution}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-white/5 rounded-xl">
            <div className="text-white/60 text-sm mb-2">Top Performer</div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Monitor (Analytics)</span>
              <span className="text-green-400 font-medium">92.7%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Latency Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Latency Performance</h3>
        
        <div className="grid md:grid-cols-5 gap-4">
          {latencyMetrics.map((metric, index) => (
            <motion.div
              key={metric.stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-4 text-center"
            >
              <div className="text-white font-medium mb-2">{metric.stage}</div>
              <div className="text-2xl font-light text-white mb-1">{metric.actual}ms</div>
              <div className="text-white/60 text-sm mb-2">Target: {metric.target}ms</div>
              <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(metric.status)}`}>
                {metric.status}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-white/60">Avg Total Latency</div>
            <div className="text-white text-lg font-medium">2.8s</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-white/60">Target: Sub-3s</div>
            <div className="text-green-400 text-lg font-medium">✓ Achieved</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-white/60">Improvement</div>
            <div className="text-green-400 text-lg font-medium">-15% vs last week</div>
          </div>
        </div>
      </motion.div>

      {/* Benchmark Comparison & Recent Trades */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Benchmark Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Benchmark Comparison</h3>
          
          <div className="space-y-4">
            {benchmarkComparison.map((bench, index) => (
              <motion.div
                key={bench.benchmark}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">{bench.benchmark}</span>
                  <span className={`text-sm font-medium ${getStatusColor(bench.status)}`}>
                    {bench.status === 'outperform' ? '↗' : '↘'} {Math.abs(bench.ourPerformance - bench.benchmarkPerformance).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/60">Us</span>
                      <span className="text-white">{bench.ourPerformance}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <div 
                        className="bg-green-400 h-1 rounded-full"
                        style={{ width: `${(bench.ourPerformance / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/60">Benchmark</span>
                      <span className="text-white">{bench.benchmarkPerformance}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <div 
                        className="bg-blue-400 h-1 rounded-full"
                        style={{ width: `${(bench.benchmarkPerformance / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-white">Recent Trades</h3>
            <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">View All</button>
          </div>
          
          <div className="space-y-3">
            {recentTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{trade.token}</span>
                      <span className="text-white/60 text-sm">{trade.type}</span>
                    </div>
                    <div className="text-white/40 text-xs">
                      {trade.entry.toFixed(8)} → {trade.exit.toFixed(8)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-green-400 text-sm font-medium">{trade.pnl}</div>
                    <div className="text-white/60 text-xs">{trade.multiplier}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/40 text-xs">{trade.timestamp}</div>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-white/5 rounded-xl">
            <div className="text-center">
              <div className="text-white/60 text-sm">All trades verified on-chain</div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">100% Transparent</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}