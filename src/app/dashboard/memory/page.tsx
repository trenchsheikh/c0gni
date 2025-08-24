'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Network, 
  AlertTriangle, 
  Lightbulb, 
  Download, 
  RotateCcw, 
  Activity,
  Database,
  Target
} from "lucide-react";

const learnedPatterns = [
  {
    id: "pattern-001",
    pattern: "Sunday Morning Volatility Surge",
    description: "Tokens with Telegram spike >300% on Sunday mornings show 82% snipe success rate",
    confidence: 94.7,
    samples: 127,
    successRate: 82.3,
    discovered: "3 days ago",
    type: "social-temporal"
  },
  {
    id: "pattern-002", 
    pattern: "Whale Accumulation Signal",
    description: "Wallets with <3 prior launches moving >50 SOL indicate high rug risk (76% accuracy)",
    confidence: 89.2,
    samples: 89,
    successRate: 76.1,
    discovered: "1 week ago",
    type: "on-chain"
  },
  {
    id: "pattern-003",
    pattern: "LP Lock Duration Correlation",
    description: "Tokens with LP locked >30 days show 2.3x higher retention vs 7-day locks",
    confidence: 91.8,
    samples: 203,
    successRate: 67.9,
    discovered: "2 weeks ago",
    type: "defi-pattern"
  },
  {
    id: "pattern-004",
    pattern: "Cross-Platform Sentiment Alignment",
    description: "When Telegram + X sentiment align >85%, price movement follows within 15min (71% accuracy)",
    confidence: 78.4,
    samples: 156,
    successRate: 71.2,
    discovered: "5 days ago",
    type: "social-cross"
  },
  {
    id: "pattern-005",
    pattern: "Contract Deployment Timing",
    description: "Mints deployed during US trading hours (9-4 EST) show 31% higher volume",
    confidence: 86.1,
    samples: 342,
    successRate: 68.7,
    discovered: "1 week ago", 
    type: "temporal"
  }
];

const memoryTimeline = [
  {
    time: "2h ago",
    event: "Learned: $BONK patterns during high volatility",
    type: "discovery",
    impact: "high"
  },
  {
    time: "6h ago", 
    event: "Updated: Whale wallet behavior model",
    type: "update",
    impact: "medium"
  },
  {
    time: "12h ago",
    event: "Discarded: Low-confidence social pattern (<50%)",
    type: "cleanup",
    impact: "low"
  },
  {
    time: "1d ago",
    event: "Integrated: Cross-chain arbitrage opportunity detection",
    type: "integration", 
    impact: "high"
  },
  {
    time: "2d ago",
    event: "Learned: Sunday morning trading volume patterns",
    type: "discovery",
    impact: "high"
  }
];

const modelVersions = [
  {
    version: "v2.3.1",
    status: "active",
    deployed: "2h ago",
    performance: 94.2,
    changes: "Enhanced social sentiment analysis, improved rug detection"
  },
  {
    version: "v2.3.0", 
    status: "archived",
    deployed: "1d ago", 
    performance: 91.7,
    changes: "Added cross-platform signal correlation"
  },
  {
    version: "v2.2.9",
    status: "archived",
    deployed: "3d ago",
    performance: 89.4,
    changes: "Temporal pattern recognition improvements"
  },
  {
    version: "v2.2.8",
    status: "rollback-available",
    deployed: "1w ago",
    performance: 92.1, 
    changes: "Baseline stable model with proven track record"
  }
];

const knowledgeCategories = [
  { category: "Social Patterns", count: 127, accuracy: 78.4, color: "bg-blue-400" },
  { category: "On-Chain Signals", count: 203, accuracy: 89.2, color: "bg-green-400" },
  { category: "Temporal Patterns", count: 89, accuracy: 82.7, color: "bg-purple-400" },
  { category: "DeFi Mechanics", count: 156, accuracy: 91.8, color: "bg-yellow-400" },
  { category: "Whale Behavior", count: 67, accuracy: 86.3, color: "bg-red-400" },
  { category: "Risk Indicators", count: 234, accuracy: 94.1, color: "bg-cyan-400" }
];

const getPatternTypeColor = (type: string) => {
  switch (type) {
    case 'social-temporal': return 'text-blue-400 bg-blue-400/20';
    case 'on-chain': return 'text-green-400 bg-green-400/20';
    case 'defi-pattern': return 'text-purple-400 bg-purple-400/20';
    case 'social-cross': return 'text-yellow-400 bg-yellow-400/20';
    case 'temporal': return 'text-cyan-400 bg-cyan-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'discovery': return Lightbulb;
    case 'update': return RotateCcw;
    case 'cleanup': return AlertTriangle;
    case 'integration': return Network;
    default: return Activity;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-white/60';
    default: return 'text-white/60';
  }
};

export default function MemoryVault() {
  const [learningRate, setLearningRate] = useState(75);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [learningMode, setLearningMode] = useState("adaptive");

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light text-white mb-2">Swarm Memory & Learning Vault</h1>
        <p className="text-white/60">Persistent intelligence and adaptive learning systems</p>
      </motion.div>

      {/* Learning Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">Learning Configuration</h3>
          <div className="flex items-center gap-3">
            <select 
              value={learningMode}
              onChange={(e) => setLearningMode(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm"
            >
              <option value="conservative">Conservative</option>
              <option value="adaptive">Adaptive</option>
              <option value="aggressive">Aggressive</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors">
              <Download className="w-4 h-4" />
              Export Memory
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Learning Rate
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Adaptation Speed</span>
                <span className="text-white text-sm font-mono">{learningRate}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none"
              />
              <div className="text-xs text-white/40">
                Higher = faster adaptation, more volatile
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Memory Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Total Patterns</span>
                <span className="text-white">{learnedPatterns.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Avg Confidence</span>
                <span className="text-white">87.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Memory Usage</span>
                <span className="text-white">2.3 GB</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Performance Impact
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Accuracy Gain</span>
                <span className="text-green-400">+12.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Decision Speed</span>
                <span className="text-green-400">+8.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Pattern Recognition</span>
                <span className="text-green-400">+15.2%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Knowledge Graph Visualization */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Learned Patterns</h3>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Learning Active
              </div>
            </div>

            <div className="space-y-4">
              {learnedPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedPattern === pattern.id 
                      ? 'bg-white/10 border-white/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">{pattern.pattern}</span>
                        <div className={`px-2 py-1 rounded-full text-xs ${getPatternTypeColor(pattern.type)}`}>
                          {pattern.type}
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{pattern.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 ml-4">
                      <div className="text-white font-mono text-sm">{pattern.confidence}%</div>
                      <div className="text-white/60 text-xs">confidence</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-white/60">Samples</div>
                      <div className="text-white font-mono">{pattern.samples}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Success Rate</div>
                      <div className="text-white font-mono">{pattern.successRate}%</div>
                    </div>
                    <div>
                      <div className="text-white/60">Discovered</div>
                      <div className="text-white">{pattern.discovered}</div>
                    </div>
                  </div>
                  
                  {selectedPattern === pattern.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-white/10 mt-3 pt-3"
                    >
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-xs mb-2">Pattern Strength</div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: `${pattern.confidence}%` }}
                          />
                        </div>
                        <div className="text-white/40 text-xs">
                          This pattern has been validated across {pattern.samples} samples with {pattern.successRate}% accuracy
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Memory Timeline & Model Versions */}
        <div className="space-y-6">
          {/* Memory Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-medium text-white mb-4">Memory Timeline</h3>
            
            <div className="space-y-3">
              {memoryTimeline.map((event, index) => {
                const EventIcon = getEventTypeIcon(event.type);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
                  >
                    <div className="p-1 bg-white/10 rounded-lg">
                      <EventIcon className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium mb-1">{event.event}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-xs">{event.time}</span>
                        <span className={`text-xs ${getImpactColor(event.impact)}`}>
                          {event.impact} impact
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm transition-colors">
              View Full Timeline
            </button>
          </motion.div>

          {/* Model Versions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-medium text-white mb-4">Model Versions</h3>
            
            <div className="space-y-3">
              {modelVersions.map((version, index) => (
                <motion.div
                  key={version.version}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{version.version}</span>
                      {version.status === 'active' && (
                        <div className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                          Active
                        </div>
                      )}
                      {version.status === 'rollback-available' && (
                        <div className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                          Rollback
                        </div>
                      )}
                    </div>
                    <div className="text-white font-mono text-sm">{version.performance}%</div>
                  </div>
                  
                  <div className="text-white/60 text-xs mb-1">{version.changes}</div>
                  <div className="text-white/40 text-xs">{version.deployed}</div>
                  
                  {version.status === 'rollback-available' && (
                    <button className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors">
                      Rollback to v{version.version}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Knowledge Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Knowledge Distribution</h3>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {knowledgeCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-4 text-center"
            >
              <div className="text-white font-medium text-sm mb-3">{category.category}</div>
              
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-white/60">Patterns</div>
                  <div className="text-white text-lg font-light">{category.count}</div>
                </div>
                <div>
                  <div className="text-white/60">Accuracy</div>
                  <div className={`font-mono ${category.accuracy > 90 ? 'text-green-400' : category.accuracy > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {category.accuracy}%
                  </div>
                </div>
              </div>
              
              <div className="mt-3 h-2 bg-white/10 rounded-full">
                <div 
                  className={`h-2 rounded-full ${category.color}`}
                  style={{ width: `${Math.min(100, (category.count / 250) * 100)}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-white/60 text-sm mb-2">
            Total Knowledge Base: {knowledgeCategories.reduce((sum, cat) => sum + cat.count, 0)} patterns
          </div>
          <div className="text-white/40 text-xs">
            Continuously learning and adapting to market conditions
          </div>
        </div>
      </motion.div>
    </div>
  );
}