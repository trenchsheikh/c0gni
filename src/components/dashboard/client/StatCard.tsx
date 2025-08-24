'use client';

import React from "react";
import { motion } from "framer-motion";
import { Brain, Users, Zap, TrendingUp, ArrowUpRight } from "lucide-react";

interface StatType {
  title: string;
  value: string;
  change: string;
  iconName: 'Brain' | 'Users' | 'Zap' | 'TrendingUp';
  trend: string;
}

interface StatCardProps {
  stat: StatType;
  index: number;
}

const iconMap = {
  Brain,
  Users,
  Zap,
  TrendingUp
};

export function StatCard({ stat, index }: StatCardProps) {
  const Icon = iconMap[stat.iconName];
  
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
}