'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changePercent?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  index?: number;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  change,
  changePercent,
  icon: Icon,
  trend = 'neutral',
  index = 0,
  subtitle
}: StatCardProps) {
  return (
    <Card delay={index * 0.1} className="group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {changePercent && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            trend === 'up' ? 'text-white' : trend === 'down' ? 'text-white/60' : 'text-white/40'
          )}>
            {trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
            {trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
            <span>{changePercent}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl font-light mt-1 tracking-tight">{value}</p>
        {subtitle && <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>}
        {change && !subtitle && <p className="text-zinc-500 text-sm mt-1">{change}</p>}
      </div>
    </Card>
  );
}

