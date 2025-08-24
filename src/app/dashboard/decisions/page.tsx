'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  User,
  Bot,
  ChevronDown,
  ChevronRight,
  Code,
  Activity,
  Target,
  Filter
} from "lucide-react";

const decisionFeed = [
  {
    id: "dec-001",
    agent: "Analyzer",
    agentId: "analyzer-001",
    decision: "Approved snipe: $BONK2.0",
    reasoning: "Clean contract verified, no honeypot detected, freeze authority renounced, 78% social velocity in past 10min",
    confidence: 92,
    outcome: "approved",
    timestamp: "2m ago",
    details: {
      contractAddress: "7xKXtg2CW3J9z8wP1qR5m6N...",
      socialScore: 78,
      techScore: 94,
      riskScore: 12
    },
    humanOverride: false
  },
  {
    id: "dec-002",
    agent: "Risk Agent", 
    agentId: "risk-001",
    decision: "Vetoed trade: $WOJAK",
    reasoning: "LP too shallow (<5 SOL), high volatility detected (45% in 5min), suspicious wallet cluster identified",
    confidence: 89,
    outcome: "rejected",
    timestamp: "5m ago",
    details: {
      lpSize: "3.2 SOL",
      volatility: "45%",
      suspiciousWallets: 3
    },
    humanOverride: false
  },
  {
    id: "dec-003",
    agent: "Scout",
    agentId: "scout-001", 
    decision: "Flagged opportunity: $PEPE",
    reasoning: "High social momentum detected, whale accumulation pattern, cross-platform mention spike",
    confidence: 76,
    outcome: "flagged",
    timestamp: "8m ago",
    details: {
      socialMentions: 450,
      whaleTransfers: 5,
      sentiment: "bullish"
    },
    humanOverride: false
  },
  {
    id: "dec-004",
    agent: "Trader",
    agentId: "trader-001",
    decision: "Executed position exit: $WIF", 
    reasoning: "Take-profit target reached (2.1x), reducing risk exposure, rebalancing portfolio allocation",
    confidence: 95,
    outcome: "executed",
    timestamp: "12m ago",
    details: {
      entryPrice: 2.34,
      exitPrice: 4.91,
      multiplier: "2.1x",
      profit: "+0.8 SOL"
    },
    humanOverride: true,
    humanReason: "User override: take profit at 2x instead of 3x target"
  },
  {
    id: "dec-005",
    agent: "Hedger",
    agentId: "hedger-001",
    decision: "Risk mitigation failed: High slippage",
    reasoning: "Attempted to hedge $BONK position but slippage exceeded 3% threshold, market too volatile",
    confidence: 71,
    outcome: "failed",
    timestamp: "15m ago", 
    details: {
      targetSlippage: "1.5%",
      actualSlippage: "3.8%",
      position: "$BONK 2.5 SOL"
    },
    humanOverride: false
  }
];

const confidenceHistory = [
  { time: "6h ago", confidence: 85 },
  { time: "5h ago", confidence: 89 },
  { time: "4h ago", confidence: 92 },
  { time: "3h ago", confidence: 88 },
  { time: "2h ago", confidence: 91 },
  { time: "1h ago", confidence: 87 },
  { time: "now", confidence: 89 }
];

const promptExamples = [
  {
    agent: "Analyzer",
    prompt: "Analyze token contract safety for $TOKEN. Check: 1) Honeypot status 2) Freeze authority 3) Mint authority 4) LP lock status 5) Recent social sentiment. Confidence threshold: 80%"
  },
  {
    agent: "Scout", 
    prompt: "Monitor for new mints on Pump.fun with criteria: LP > 5 SOL, no suspicious wallet clusters, social mentions > 50/10min. Alert if confidence > 75%"
  },
  {
    agent: "Risk Agent",
    prompt: "Evaluate trade risk for position. Factors: 1) Slippage tolerance 2) Position size vs portfolio 3) Market volatility 4) Correlation with existing positions. Max risk: 5%"
  }
];

const getOutcomeColor = (outcome: string) => {
  switch (outcome) {
    case 'approved': return 'text-green-400 bg-green-400/20';
    case 'rejected': return 'text-red-400 bg-red-400/20';
    case 'executed': return 'text-blue-400 bg-blue-400/20';
    case 'flagged': return 'text-yellow-400 bg-yellow-400/20';
    case 'failed': return 'text-red-400 bg-red-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

const getOutcomeIcon = (outcome: string) => {
  switch (outcome) {
    case 'approved': return CheckCircle;
    case 'rejected': return XCircle;
    case 'executed': return Target;
    case 'flagged': return AlertTriangle;
    case 'failed': return XCircle;
    default: return Clock;
  }
};

export default function DecisionLog() {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [humanInLoop, setHumanInLoop] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [showPrompts, setShowPrompts] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light text-white mb-2">Decision Log & Reasoning Engine</h1>
        <p className="text-white/60">Transparent agent decision-making and reasoning trails</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">Decision Controls</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Human-in-Loop</span>
              <button
                onClick={() => setHumanInLoop(!humanInLoop)}
                className={`w-10 h-6 rounded-full transition-all duration-300 ${
                  humanInLoop ? 'bg-blue-400' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  humanInLoop ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <button 
              onClick={() => setShowPrompts(!showPrompts)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white transition-colors"
            >
              <Code className="w-4 h-4" />
              Prompt Audit
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Confidence Threshold
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Require Manual Approval</span>
                <span className="text-white text-sm font-mono">&lt;{confidenceThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none"
              />
              <div className="text-xs text-white/40">
                Decisions below {confidenceThreshold}% require human approval
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Decision Stats (24h)
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/60">Total Decisions</div>
                <div className="text-white text-xl font-light">247</div>
              </div>
              <div>
                <div className="text-white/60">Avg Confidence</div>
                <div className="text-white text-xl font-light">87.3%</div>
              </div>
              <div>
                <div className="text-white/60">Human Overrides</div>
                <div className="text-white text-xl font-light">12</div>
              </div>
              <div>
                <div className="text-white/60">Success Rate</div>
                <div className="text-white text-xl font-light">91.2%</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Decision Feed */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Decision Feed</h3>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Feed
              </div>
            </div>

            <div className="space-y-4">
              {decisionFeed.map((decision, index) => {
                const OutcomeIcon = getOutcomeIcon(decision.outcome);
                const isExpanded = selectedDecision === decision.id;
                
                return (
                  <motion.div
                    key={decision.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`border rounded-xl transition-all duration-300 ${
                      isExpanded 
                        ? 'bg-white/10 border-white/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => setSelectedDecision(isExpanded ? null : decision.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
                            <Bot className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{decision.agent}</span>
                              <span className="text-white/40 text-sm font-mono">#{decision.agentId}</span>
                              {decision.humanOverride && <User className="w-4 h-4 text-yellow-400" />}
                            </div>
                            <div className="text-white text-sm mt-1">{decision.decision}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="text-white/60">Confidence</div>
                            <div className="text-white font-mono">{decision.confidence}%</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getOutcomeColor(decision.outcome)}`}>
                            <OutcomeIcon className="w-3 h-3" />
                            {decision.outcome}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-white/70 text-sm mb-2">{decision.reasoning}</div>
                      <div className="text-xs text-white/40">{decision.timestamp}</div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10 p-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-white/60 text-xs mb-2">Decision Details</div>
                            <div className="space-y-1 text-sm">
                              {Object.entries(decision.details).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                  <span className="text-white font-mono">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-white/60 text-xs mb-2">Confidence Breakdown</div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Overall</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1 bg-white/20 rounded-full">
                                    <div 
                                      className="h-1 bg-green-400 rounded-full"
                                      style={{ width: `${decision.confidence}%` }}
                                    />
                                  </div>
                                  <span className="text-white text-xs">{decision.confidence}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {decision.humanOverride && (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm font-medium">Human Override Applied</span>
                            </div>
                            <div className="text-white/60 text-sm">{decision.humanReason}</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Confidence Graph & Prompt Audit */}
        <div className="space-y-6">
          {/* Confidence Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-medium text-white mb-4">Confidence Over Time</h3>
            
            <div className="h-48 bg-white/5 rounded-2xl flex items-end justify-between p-4 gap-2">
              {confidenceHistory.map((point, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="bg-gradient-to-t from-green-400 to-green-300 rounded-t-sm w-full"
                    style={{ height: `${(point.confidence / 100) * 120}px` }}
                  />
                  <div className="text-xs text-white/60 transform -rotate-45 origin-bottom-left">
                    {point.time}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-white/60">Avg: 89.1%</span>
              <span className="text-white/60">Trend: +2.3%</span>
            </div>
          </motion.div>

          {/* Prompt Audit */}
          {showPrompts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Prompt Audit
              </h3>
              
              <div className="space-y-4">
                {promptExamples.map((prompt, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="text-white font-medium text-sm mb-2">{prompt.agent}</div>
                    <div className="bg-black/20 rounded-lg p-3 font-mono text-xs text-white/80">
                      {prompt.prompt}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm transition-colors">
                Export All Prompts
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}