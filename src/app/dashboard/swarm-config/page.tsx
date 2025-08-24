'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Shield, 
  Eye, 
  BarChart3, 
  ArrowRightLeft, 
  Settings2, 
  Play, 
  Square, 
  Copy,
  Key
} from "lucide-react";

const agentRoles = [
  { id: "scout", name: "Scout", icon: Eye, description: "Monitors for new opportunities", active: true, dependencies: [] },
  { id: "analyzer", name: "Analyzer", icon: Brain, description: "Analyzes contract safety and viability", active: true, dependencies: ["scout"] },
  { id: "trader", name: "Trader", icon: TrendingUp, description: "Executes trades based on analysis", active: true, dependencies: ["analyzer"] },
  { id: "hedger", name: "Hedger", icon: Shield, description: "Manages risk and hedging positions", active: false, dependencies: ["trader"] },
  { id: "monitor", name: "Monitor", icon: BarChart3, description: "Tracks performance and metrics", active: true, dependencies: [] },
  { id: "arbitrage", name: "Arb Engine", icon: ArrowRightLeft, description: "Finds and executes arbitrage opportunities", active: false, dependencies: ["monitor"] },
  { id: "balancer", name: "Balancer", icon: Settings2, description: "Optimizes LP positions", active: false, dependencies: ["monitor"] },
  { id: "rebalancer", name: "Rebalancer", icon: Zap, description: "Automatically rebalances portfolios", active: false, dependencies: ["balancer"] }
];

const swarmPresets = [
  {
    id: "sniper",
    name: "Sniper Swarm",
    description: "Scout + Analyzer + Trader for quick opportunities",
    roles: ["scout", "analyzer", "trader", "monitor"],
    color: "from-red-500/20 to-orange-500/20"
  },
  {
    id: "arbitrage",
    name: "Arbitrage Team", 
    description: "Monitor + Arb Engine + Hedger for price differences",
    roles: ["monitor", "arbitrage", "hedger"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "optimizer",
    name: "LP Optimizer",
    description: "Balancer + Fee Tracker + Rebalancer for LP management",
    roles: ["monitor", "balancer", "rebalancer"],
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: "custom",
    name: "Custom Setup",
    description: "User-defined agent configuration",
    roles: [],
    color: "from-purple-500/20 to-pink-500/20"
  }
];

const mockSwarmIdentity = {
  id: "swarm_001",
  pubkey: "7xKXtg2CW3J9z8...",
  onChainFootprint: "0x1a2b3c...",
  status: "active"
};

export default function SwarmConfigPanel() {
  const [activeRoles, setActiveRoles] = useState<string[]>(
    agentRoles.filter(role => role.active).map(role => role.id)
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("sniper");

  const toggleRole = (roleId: string) => {
    setActiveRoles(prev => {
      const newRoles = prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId];
      
      // Auto-disable dependent roles when parent is disabled
      const role = agentRoles.find(r => r.id === roleId);
      if (role && !newRoles.includes(roleId)) {
        const dependentRoles = agentRoles
          .filter(r => r.dependencies.includes(roleId))
          .map(r => r.id);
        return newRoles.filter(id => !dependentRoles.includes(id));
      }
      
      return newRoles;
    });
  };

  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = swarmPresets.find(p => p.id === presetId);
    if (preset) {
      setActiveRoles(preset.roles);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light text-white mb-2">Swarm Configuration</h1>
        <p className="text-white/60">Define, toggle, and tune your agent team</p>
      </motion.div>

      {/* Swarm Identity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-4">Swarm Identity</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-white/60 text-sm mb-1">Swarm ID</div>
            <div className="text-white font-mono text-sm">{mockSwarmIdentity.id}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-white/60 text-sm mb-1">Public Key</div>
            <div className="text-white font-mono text-sm flex items-center gap-2">
              {mockSwarmIdentity.pubkey}
              <Copy className="w-3 h-3 text-white/40 cursor-pointer hover:text-white/80" />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-white/60 text-sm mb-1">On-Chain Footprint</div>
            <div className="text-white font-mono text-sm">{mockSwarmIdentity.onChainFootprint}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-white/60 text-sm mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-sm capitalize">{mockSwarmIdentity.status}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Swarm Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Swarm Presets</h3>
          <div className="space-y-3">
            {swarmPresets.map((preset) => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyPreset(preset.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                  selectedPreset === preset.id
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-full h-2 rounded-full mb-3 bg-gradient-to-r ${preset.color}`}></div>
                <h4 className="text-white font-medium mb-1">{preset.name}</h4>
                <p className="text-white/60 text-sm">{preset.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role Selector Matrix */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Agent Roles</h3>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Active: {activeRoles.length}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {agentRoles.map((role) => {
                const Icon = role.icon;
                const isActive = activeRoles.includes(role.id);
                const hasDependency = role.dependencies.some(dep => !activeRoles.includes(dep));
                
                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/10 border-green-400/30' 
                        : hasDependency
                        ? 'bg-white/5 border-red-400/30 opacity-50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-green-400/20' : 'bg-white/10'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            isActive ? 'text-green-400' : 'text-white/60'
                          }`} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{role.name}</h4>
                          {role.dependencies.length > 0 && (
                            <div className="text-xs text-white/40">
                              Depends on: {role.dependencies.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRole(role.id)}
                        disabled={hasDependency}
                        className={`w-10 h-6 rounded-full border-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-green-400 border-green-400'
                            : hasDependency
                            ? 'bg-white/10 border-red-400/30'
                            : 'bg-white/10 border-white/30 hover:border-white/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                          isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                    <p className="text-white/60 text-sm">{role.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dependency Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Dependency Graph</h3>
        <div className="bg-white/5 rounded-2xl p-8 h-40 flex items-center justify-center">
          <div className="text-center">
            <Settings2 className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Visual dependency graph will be displayed here</p>
            <p className="text-white/40 text-sm mt-2">Circuit board style connections between active agents</p>
          </div>
        </div>
      </motion.div>

      {/* Control Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex gap-4"
      >
        <button className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 font-medium transition-all duration-300">
          <Play className="w-4 h-4" />
          Deploy Swarm
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 font-medium transition-all duration-300">
          <Square className="w-4 h-4" />
          Stop All Agents
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all duration-300">
          <Key className="w-4 h-4" />
          Export Config
        </button>
      </motion.div>
    </div>
  );
}