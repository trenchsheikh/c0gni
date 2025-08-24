import React from 'react';
import { 
  Info as InfoIcon, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = 'info', children, className }: AlertProps) {
  const styles = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: InfoIcon
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20', 
      text: 'text-yellow-400',
      icon: AlertTriangle
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: AlertCircle
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={cn(
      'flex gap-3 p-4 rounded-lg border',
      style.bg,
      style.border,
      className
    )}>
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', style.text)} />
      <div className="flex-1 text-white/80 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

// Convenience components
export function Info({ children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="info" className={className}>{children}</Alert>;
}

export function Warning({ children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="warning" className={className}>{children}</Alert>;
}

export function Tip({ children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="success" className={className}>{children}</Alert>;
}