'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className, hover = true, delay = 0, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6',
        hover && 'hover:bg-zinc-900/80 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

