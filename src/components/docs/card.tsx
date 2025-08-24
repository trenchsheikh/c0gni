import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, icon, href, children, className }: CardProps) {
  const content = (
    <div
      className={cn(
        "group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl",
        "hover:bg-white/10 hover:border-white/20 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/15 transition-colors">
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-5 h-5 text-white"
            })}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">
            {title}
            {href && (
              <ExternalLink className="inline w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </h3>
          <div className="text-white/70 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

interface CardGroupProps {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export function CardGroup({ cols = 2, children, className }: CardGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn(`grid gap-4 ${gridCols[cols]}`, className)}>
      {children}
    </div>
  );
}