'use client';

import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

interface TabProps {
  title: string;
  value?: string;
  children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function Tabs({ children, defaultValue, className }: TabsProps) {
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const firstTabValue = defaultValue || tabs[0]?.props.title?.toLowerCase().replace(/\s+/g, '-');

  return (
    <TabsPrimitive.Root defaultValue={firstTabValue} className={cn('space-y-4', className)}>
      <TabsPrimitive.List className="border-b border-white/10">
        <div className="flex space-x-8">
          {tabs.map((tab, index) => {
            const value = tab.props.value || tab.props.title.toLowerCase().replace(/\s+/g, '-');
            return (
              <TabsPrimitive.Trigger
                key={index}
                value={value}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  "data-[state=active]:border-blue-400 data-[state=active]:text-blue-400",
                  "data-[state=inactive]:border-transparent data-[state=inactive]:text-white/60",
                  "hover:text-white hover:border-white/20"
                )}
              >
                {tab.props.title}
              </TabsPrimitive.Trigger>
            );
          })}
        </div>
      </TabsPrimitive.List>
      
      {tabs.map((tab, index) => {
        const value = tab.props.value || tab.props.title.toLowerCase().replace(/\s+/g, '-');
        return (
          <TabsPrimitive.Content key={index} value={value} className="mt-4">
            {tab.props.children}
          </TabsPrimitive.Content>
        );
      })}
    </TabsPrimitive.Root>
  );
}