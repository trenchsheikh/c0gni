'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, Brain, Zap, LucideIcon } from "lucide-react";

interface StatType {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: string;
}

const stats = [
  { title: "Active Projects", value: "24", change: "+12%", icon: Brain, trend: "up" },
  { title: "Team Members", value: "18", change: "+3", icon: Users, trend: "up" },
  { title: "AI Models Deployed", value: "42", change: "+8", icon: Zap, trend: "up" },
  { title: "Performance Score", value: "98.2%", change: "+2.1%", icon: TrendingUp, trend: "up" }
];

const recentActivity = [
  { action: "New AI model deployed", project: "Vision Recognition", time: "2 hours ago" },
  { action: "Team member added", project: "Natural Language Processing", time: "4 hours ago" },
  { action: "Analytics report generated", project: "Predictive Analytics", time: "6 hours ago" },
  { action: "System optimization completed", project: "Infrastructure", time: "1 day ago" }
];

const StatCard = ({ stat, index }: { stat: StatType, index: number }) => {
  const Icon = stat.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/60 text-sm font-medium mb-2">{stat.title}</p>
            <p className="text-white text-3xl font-light mb-3">{stat.value}</p>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-green-400/10 rounded-full">
                <ArrowUpRight className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/15 transition-all duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-light text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/60">Monitor your AI projects and team performance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-medium text-white mb-6">Performance Analytics</h3>
            <div className="h-80 bg-white/5 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Interactive charts will be displayed here</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <p className="text-white text-sm font-medium mb-1">{activity.action}</p>
                <p className="text-white/60 text-sm mb-2">{activity.project}</p>
                <p className="text-white/40 text-xs">{activity.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {["Deploy New Model", "Create Project", "Generate Report"].map((action) => (
            <motion.button
              key={action}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white/10 rounded-2xl text-white hover:bg-white/15 transition-all duration-300 text-center"
            >
              <div className="text-lg font-medium">{action}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}