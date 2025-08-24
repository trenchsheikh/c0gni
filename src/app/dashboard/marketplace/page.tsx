'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Store, 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download, 
  GitFork, 
  Eye, 
  Play, 
  Award, 
  Filter, 
  Search, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Zap,
  Target,
  BarChart3,
  Shield,
  Settings
} from "lucide-react";

const featuredSwarms = [
  {
    id: "swarm-001",
    name: "Alpha Hunter Pro",
    creator: "DeGenTrader.sol",
    description: "High-frequency sniper with advanced MEV protection and 89% win rate",
    price: {
      rent: "5 $C0GNI/day",
      buy: "150 $C0GNI",
      profitShare: "15%"
    },
    performance: {
      roi: "+347%",
      winRate: 89.2,
      totalTrades: 1247,
      avgHold: "3.2min"
    },
    verification: {
      onChain: true,
      audited: true,
      verified: true
    },
    tags: ["Sniper", "MEV-Protected", "High-Freq"],
    rating: 4.8,
    users: 234,
    revenue: "12.4k $C0GNI",
    featured: true
  },
  {
    id: "swarm-002", 
    name: "Arbitrage Master",
    creator: "ArbKing.sol",
    description: "Cross-DEX arbitrage specialist with sub-second execution and risk management",
    price: {
      rent: "8 $C0GNI/day",
      buy: "280 $C0GNI", 
      profitShare: "20%"
    },
    performance: {
      roi: "+189%",
      winRate: 76.8,
      totalTrades: 892,
      avgHold: "45s"
    },
    verification: {
      onChain: true,
      audited: false,
      verified: true
    },
    tags: ["Arbitrage", "Cross-DEX", "Fast-Execution"],
    rating: 4.6,
    users: 156,
    revenue: "8.9k $C0GNI",
    featured: true
  },
  {
    id: "swarm-003",
    name: "LP Yield Optimizer", 
    creator: "YieldFarmer.sol",
    description: "Automated LP position management with rebalancing and fee compounding",
    price: {
      rent: "3 $C0GNI/day",
      buy: "95 $C0GNI",
      profitShare: "12%"
    },
    performance: {
      roi: "+67%",
      winRate: 94.1,
      totalTrades: 445,
      avgHold: "2.3h"
    },
    verification: {
      onChain: true,
      audited: true,
      verified: true
    },
    tags: ["LP-Optimizer", "DeFi", "Yield-Farming"],
    rating: 4.9,
    users: 89,
    revenue: "3.2k $C0GNI",
    featured: false
  },
  {
    id: "swarm-004",
    name: "Social Signal Trader",
    creator: "AlphaScout.sol", 
    description: "Sentiment-driven trading with multi-platform social analysis",
    price: {
      rent: "4 $C0GNI/day",
      buy: "120 $C0GNI",
      profitShare: "18%"
    },
    performance: {
      roi: "+156%",
      winRate: 71.3,
      totalTrades: 623,
      avgHold: "8.7min"
    },
    verification: {
      onChain: true,
      audited: false,
      verified: false
    },
    tags: ["Social-Trading", "Sentiment", "Multi-Platform"],
    rating: 4.2,
    users: 67,
    revenue: "2.1k $C0GNI",
    featured: false
  }
];

const mySwarms = [
  {
    id: "my-swarm-001",
    name: "Custom Sniper v2",
    description: "Personal sniper configuration with custom risk parameters",
    performance: "+89% ROI, 156 trades",
    earnings: "2.3k $C0GNI earned",
    status: "active",
    users: 12,
    lastUpdate: "2d ago"
  },
  {
    id: "my-swarm-002",
    name: "Weekend Scalper",
    description: "Low-risk weekend trading strategy",
    performance: "+34% ROI, 67 trades", 
    earnings: "890 $C0GNI earned",
    status: "paused",
    users: 5,
    lastUpdate: "1w ago"
  }
];

const categories = [
  { name: "All", count: 247, active: true },
  { name: "Snipers", count: 89, active: false },
  { name: "Arbitrage", count: 45, active: false },
  { name: "LP Optimizers", count: 32, active: false },
  { name: "Social Trading", count: 28, active: false },
  { name: "Risk Management", count: 18, active: false }
];

interface VerificationType {
  onChain: boolean;
  audited: boolean;
  verified: boolean;
}

const getVerificationIcon = (verification: VerificationType) => {
  if (verification.onChain && verification.audited && verification.verified) {
    return <Award className="w-4 h-4 text-green-400" />;
  } else if (verification.onChain && verification.verified) {
    return <CheckCircle className="w-4 h-4 text-blue-400" />;
  } else {
    return <Clock className="w-4 h-4 text-yellow-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/20';
    case 'paused': return 'text-yellow-400 bg-yellow-400/20';
    case 'stopped': return 'text-red-400 bg-red-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

export default function AgentMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"browse" | "create">("browse");

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
            <h1 className="text-4xl font-light text-white mb-2">Agent Marketplace</h1>
            <p className="text-white/60">Monetize or copy proven trading strategies</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white/10 rounded-xl p-1">
              <button 
                onClick={() => setViewMode("browse")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "browse" ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Browse Swarms
              </button>
              <button 
                onClick={() => setViewMode("create")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "create" ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Creator Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {viewMode === "browse" ? (
        <>
          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text"
                  placeholder="Search swarms by name, creator, or strategy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/60" />
                <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm">
                  <option>Sort by Performance</option>
                  <option>Sort by Price</option>
                  <option>Sort by Rating</option>
                  <option>Sort by Users</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category.name 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </motion.div>

          {/* Featured Swarms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-light text-white">Featured Swarms</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredSwarms.filter(swarm => swarm.featured).map((swarm, index) => (
                <motion.div
                  key={swarm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white text-xl font-medium">{swarm.name}</h4>
                        {getVerificationIcon(swarm.verification)}
                        <div className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs">
                          Featured
                        </div>
                      </div>
                      <div className="text-white/60 text-sm mb-2">by {swarm.creator}</div>
                      <p className="text-white/80 text-sm">{swarm.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 ml-4">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{swarm.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {swarm.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-white/60">ROI</div>
                      <div className="text-green-400 font-bold text-lg">{swarm.performance.roi}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Win Rate</div>
                      <div className="text-white font-bold text-lg">{swarm.performance.winRate}%</div>
                    </div>
                    <div>
                      <div className="text-white/60">Total Trades</div>
                      <div className="text-white">{swarm.performance.totalTrades}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Avg Hold</div>
                      <div className="text-white">{swarm.performance.avgHold}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-white/60" />
                        <span className="text-white/60">{swarm.users} users</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-white/60" />
                        <span className="text-white/60">{swarm.revenue} earned</span>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 mb-4">
                    <div className="text-white/60 text-xs mb-2">Pricing Options</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-white/40">Rent</div>
                        <div className="text-white font-mono">{swarm.price.rent}</div>
                      </div>
                      <div>
                        <div className="text-white/40">Buy</div>
                        <div className="text-white font-mono">{swarm.price.buy}</div>
                      </div>
                      <div>
                        <div className="text-white/40">Profit Share</div>
                        <div className="text-white font-mono">{swarm.price.profitShare}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                      <Play className="w-3 h-3" />
                      Rent
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                      <Download className="w-3 h-3" />
                      Buy
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                      <GitFork className="w-3 h-3" />
                      Fork
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Swarms Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-light text-white mb-6">All Swarms</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredSwarms.filter(swarm => !swarm.featured).map((swarm, index) => (
                <motion.div
                  key={swarm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/[0.08] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">{swarm.name}</h4>
                        {getVerificationIcon(swarm.verification)}
                      </div>
                      <div className="text-white/60 text-xs">by {swarm.creator}</div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">{swarm.rating}</span>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-3">{swarm.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div>
                      <div className="text-white/60">ROI</div>
                      <div className="text-green-400 font-bold">{swarm.performance.roi}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Win Rate</div>
                      <div className="text-white font-bold">{swarm.performance.winRate}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-white/60">{swarm.users} users</span>
                    <span className="text-white font-mono">Rent: {swarm.price.rent}</span>
                  </div>

                  <button className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        /* Creator Dashboard */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Creator Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Earnings", value: "3.2k $C0GNI", icon: DollarSign, color: "text-green-400" },
              { label: "Active Swarms", value: "2", icon: Zap, color: "text-blue-400" },
              { label: "Total Users", value: "17", icon: Users, color: "text-purple-400" },
              { label: "Avg Rating", value: "4.7", icon: Star, color: "text-yellow-400" }
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

          {/* My Swarms */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">My Published Swarms</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors">
                <Play className="w-4 h-4" />
                Publish New Swarm
              </button>
            </div>

            <div className="space-y-4">
              {mySwarms.map((swarm, index) => (
                <motion.div
                  key={swarm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="text-white font-medium">{swarm.name}</h4>
                        <p className="text-white/60 text-sm">{swarm.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(swarm.status)}`}>
                        {swarm.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                        <Eye className="w-4 h-4 text-white/60" />
                      </button>
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                        <Settings className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-white/60">Performance</div>
                      <div className="text-white">{swarm.performance}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Earnings</div>
                      <div className="text-green-400">{swarm.earnings}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Active Users</div>
                      <div className="text-white">{swarm.users}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Last Updated</div>
                      <div className="text-white/60">{swarm.lastUpdate}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-medium text-white mb-6">Revenue Analytics</h3>
            
            <div className="h-48 bg-white/5 rounded-2xl p-4 mb-6">
              <div className="text-center text-white/60 pt-16">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>Revenue chart placeholder</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-white/60 text-sm">This Month</div>
                <div className="text-white text-xl font-medium">890 $C0GNI</div>
                <div className="text-green-400 text-sm">+23%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-white/60 text-sm">Best Month</div>
                <div className="text-white text-xl font-medium">1.2k $C0GNI</div>
                <div className="text-white/60 text-sm">March 2024</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-white/60 text-sm">Projected</div>
                <div className="text-white text-xl font-medium">1.1k $C0GNI</div>
                <div className="text-blue-400 text-sm">Next month</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}