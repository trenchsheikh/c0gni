'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface TableProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Table({ title, subtitle, children, className, delay = 0.3 }: TableProps) {
  return (
    <Card delay={delay} className={cn('overflow-hidden', className)}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-6">
          {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
          {subtitle && <p className="text-zinc-400 text-sm">{subtitle}</p>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          {children}
        </table>
      </div>
    </Card>
  );
}

Table.Header = function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <thead>
      <tr className={cn('border-b border-white/10', className)}>
        {children}
      </tr>
    </thead>
  );
};

Table.HeaderCell = function TableHeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn('text-left text-white/60 text-sm font-medium py-3', className)}>
      {children}
    </th>
  );
};

Table.Body = function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
};

Table.Row = function TableRow({ 
  children, 
  index = 0, 
  className,
  onClick 
}: { 
  children: React.ReactNode; 
  index?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
      className={cn(
        'border-b border-white/5 hover:bg-white/5 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.tr>
  );
};

Table.Cell = function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn('py-4', className)}>
      {children}
    </td>
  );
};

Table.Empty = function TableEmpty({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description?: string;
  colSpan: number;
}) {
  return (
    <tr>
      <td colSpan={100} className="py-12 text-center">
        <Icon className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <p className="text-white/60">{title}</p>
        {description && <p className="text-white/40 text-sm mt-2">{description}</p>}
      </td>
    </tr>
  );
};

Table.Loading = function TableLoading({ colSpan, rows = 3 }: { colSpan: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-white/5">
          {Array.from({ length: colSpan }).map((_, colIndex) => (
            <td key={colIndex} className="py-4">
              <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

