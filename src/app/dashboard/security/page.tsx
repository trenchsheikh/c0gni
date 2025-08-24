'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Wallet, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Settings, 
  Download, 
  Upload, 
  Zap, 
  Globe, 
  Database, 
  Fingerprint,
  Activity,
  Clock
} from "lucide-react";

const walletStatus = {
  connected: true,
  address: "7xKXtg2CW3J9z8wP1qR5m6N...",
  balance: "127.3 SOL",
  type: "Phantom Wallet",
  permissions: {
    signTransactions: true,
    approveTransactions: false,
    accessPrivateKeys: false,
    viewBalance: true
  },
  lastActivity: "2m ago"
};

const encryptionStatus = {
  agentMemory: {
    status: "encrypted",
    algorithm: "AES-256-GCM",
    keyRotation: "30 days",
    lastRotated: "5 days ago"
  },
  modelWeights: {
    status: "client-side",
    location: "Local Storage",
    backup: "Encrypted Cloud",
    size: "2.3 GB"
  },
  tradingKeys: {
    status: "hardware-secured", 
    provider: "Ledger HSM",
    multiSig: "2-of-3",
    lastUsed: "15m ago"
  },
  communications: {
    status: "end-to-end",
    protocol: "TLS 1.3 + ChaCha20",
    peers: 4,
    latency: "23ms avg"
  }
};

const securityLogs = [
  {
    timestamp: "2m ago",
    event: "Transaction signed successfully", 
    type: "success",
    details: "Snipe transaction for $BONK - 2.5 SOL",
    risk: "low"
  },
  {
    timestamp: "5m ago",
    event: "Unusual transaction pattern detected",
    type: "warning", 
    details: "Rapid fire transactions (>5 in 1min)",
    risk: "medium"
  },
  {
    timestamp: "12m ago",
    event: "Model weights updated",
    type: "info",
    details: "New learning model v2.3.1 deployed",
    risk: "low"
  },
  {
    timestamp: "18m ago",
    event: "Failed login attempt blocked",
    type: "blocked",
    details: "Invalid API key from unknown IP", 
    risk: "high"
  },
  {
    timestamp: "1h ago",
    event: "Wallet permissions verified",
    type: "success",
    details: "Phantom wallet connection validated",
    risk: "low"
  }
];

const privacySettings = {
  zkMode: false,
  hideStrategies: true,
  anonymizeLogs: false,
  shareAnalytics: true,
  dataRetention: "90 days"
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'encrypted':
    case 'client-side': 
    case 'hardware-secured':
    case 'end-to-end':
      return 'text-green-400 bg-green-400/20';
    case 'warning': return 'text-yellow-400 bg-yellow-400/20';
    case 'error': return 'text-red-400 bg-red-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

const getLogTypeColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-green-400';
    case 'warning': return 'text-yellow-400';
    case 'blocked': return 'text-red-400';
    case 'info': return 'text-blue-400';
    default: return 'text-white/60';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'text-green-400 bg-green-400/20';
    case 'medium': return 'text-yellow-400 bg-yellow-400/20';
    case 'high': return 'text-red-400 bg-red-400/20';
    default: return 'text-white/60 bg-white/10';
  }
};

export default function SecurityHub() {
  const [zkMode, setZkMode] = useState(privacySettings.zkMode);
  const [hideStrategies, setHideStrategies] = useState(privacySettings.hideStrategies);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light text-white mb-2">Privacy & Security Hub</h1>
        <p className="text-white/60">Ensure your strategies and funds remain secure</p>
      </motion.div>

      {/* Security Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-green-500/10 border-2 border-green-500/30 rounded-3xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-green-400 text-xl font-medium mb-2">
              🔒 Zero Seed Phrase Access Policy
            </h3>
            <p className="text-white/80 text-sm">
              C0gni Labs never accesses, stores, or transmits your private keys or seed phrases. 
              All sensitive operations remain within your wallet&apos;s secure environment.
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Wallet Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Binding Status
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">Connection Status</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Connected</span>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">Wallet Address</div>
              <div className="text-white font-mono text-sm flex items-center gap-2">
                {showPrivateKeys ? walletStatus.address : walletStatus.address.slice(0, 8) + '...'}
                <button 
                  onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                  className="text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPrivateKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">Wallet Type</div>
              <div className="text-white text-sm">{walletStatus.type}</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">Balance</div>
              <div className="text-white text-lg font-medium">{walletStatus.balance}</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-white font-medium mb-3">Permissions</h4>
            <div className="space-y-2">
              {Object.entries(walletStatus.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  {value ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Encryption Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Encryption Status
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Agent Memory</span>
                <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(encryptionStatus.agentMemory.status)}`}>
                  {encryptionStatus.agentMemory.status}
                </div>
              </div>
              <div className="text-white/60 text-xs space-y-1">
                <div>Algorithm: {encryptionStatus.agentMemory.algorithm}</div>
                <div>Key Rotation: {encryptionStatus.agentMemory.keyRotation}</div>
                <div>Last Rotated: {encryptionStatus.agentMemory.lastRotated}</div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Model Weights</span>
                <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(encryptionStatus.modelWeights.status)}`}>
                  client-side only
                </div>
              </div>
              <div className="text-white/60 text-xs space-y-1">
                <div>Location: {encryptionStatus.modelWeights.location}</div>
                <div>Backup: {encryptionStatus.modelWeights.backup}</div>
                <div>Size: {encryptionStatus.modelWeights.size}</div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Trading Keys</span>
                <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(encryptionStatus.tradingKeys.status)}`}>
                  HSM secured
                </div>
              </div>
              <div className="text-white/60 text-xs space-y-1">
                <div>Provider: {encryptionStatus.tradingKeys.provider}</div>
                <div>Multi-Sig: {encryptionStatus.tradingKeys.multiSig}</div>
                <div>Last Used: {encryptionStatus.tradingKeys.lastUsed}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Privacy Controls
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-white text-sm font-medium">ZK Mode (Beta)</div>
                  <div className="text-white/60 text-xs">Hide execution intent until settlement</div>
                </div>
                <button
                  onClick={() => setZkMode(!zkMode)}
                  className={`w-10 h-6 rounded-full transition-all duration-300 ${
                    zkMode ? 'bg-purple-400' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    zkMode ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-white text-sm font-medium">Hide Strategies</div>
                  <div className="text-white/60 text-xs">Keep trading patterns private</div>
                </div>
                <button
                  onClick={() => setHideStrategies(!hideStrategies)}
                  className={`w-10 h-6 rounded-full transition-all duration-300 ${
                    hideStrategies ? 'bg-blue-400' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    hideStrategies ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white text-sm font-medium mb-3">Data Retention</div>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                <option value="30">30 days</option>
                <option value="90" selected>90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white text-sm font-medium mb-2">Data Export</div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                  <Upload className="w-4 h-4" />
                  Import
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Security Activity Log
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Monitoring
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white text-sm transition-colors">
              <Download className="w-4 h-4" />
              Export Logs
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {securityLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-2 min-w-fit">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-white/60 text-sm">{log.timestamp}</span>
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-medium mb-1 ${getLogTypeColor(log.type)}`}>
                  {log.event}
                </div>
                <div className="text-white/60 text-sm">{log.details}</div>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs ${getRiskColor(log.risk)}`}>
                {log.risk} risk
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-white/60">Security Score</div>
            <div className="text-green-400 text-xl font-medium">A+</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-white/60">Threats Blocked (24h)</div>
            <div className="text-white text-xl font-medium">7</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-white/60">Last Security Scan</div>
            <div className="text-white text-xl font-medium">2m ago</div>
          </div>
        </div>
      </motion.div>

      {/* Security Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Security Recommendations
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Excellent Security</span>
            </div>
            <ul className="text-white/70 text-sm space-y-1">
              <li>✓ Hardware wallet connected</li>
              <li>✓ Multi-signature enabled</li>
              <li>✓ Regular key rotation active</li>
              <li>✓ End-to-end encryption enabled</li>
            </ul>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Recommendations</span>
            </div>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Enable ZK mode for enhanced privacy</li>
              <li>• Set up 2FA for additional security</li>
              <li>• Consider shorter data retention period</li>
              <li>• Regular security audit scheduled</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}