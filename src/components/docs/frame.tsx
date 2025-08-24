import React from 'react';
import { cn } from '@/lib/utils';

interface FrameProps {
  children: React.ReactNode;
  className?: string;
}

export function Frame({ children, className }: FrameProps) {
  return (
    <div className={cn('p-4 bg-white/5 border border-white/10 rounded-lg', className)}>
      {children}
    </div>
  );
}