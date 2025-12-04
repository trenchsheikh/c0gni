'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  headerActions?: React.ReactNode;
}

export function Section({ 
  title, 
  subtitle, 
  children, 
  className, 
  delay = 0.2,
  headerActions 
}: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {title && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-light text-white mb-2 tracking-tight">{title}</h2>
            {subtitle && <p className="text-zinc-400 text-sm">{subtitle}</p>}
          </div>
          {headerActions}
        </div>
      )}
      <div className={cn('space-y-6', className)}>
        {children}
      </div>
    </motion.div>
  );
}

