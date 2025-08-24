'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

interface AccordionGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ title, icon, children }: AccordionProps) {
  const value = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <AccordionPrimitive.Item value={value} className="border border-white/10 rounded-lg overflow-hidden">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cn(
            "flex items-center justify-between w-full p-4 text-left",
            "bg-white/5 hover:bg-white/10 transition-colors",
            "group"
          )}
        >
          <div className="flex items-center gap-3">
            {icon && React.cloneElement(icon as React.ReactElement, {
              className: "w-5 h-5 text-white/80"
            })}
            <span className="text-white font-medium">{title}</span>
          </div>
          <ChevronDown className="w-5 h-5 text-white/60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="p-4 text-white/70 leading-relaxed border-t border-white/10">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

export function AccordionGroup({ children, className }: AccordionGroupProps) {
  const accordions = React.Children.toArray(children) as React.ReactElement<AccordionProps>[];
  const defaultValue = accordions.map((_, index) => 
    accordions[index].props.title.toLowerCase().replace(/\s+/g, '-')
  );

  return (
    <AccordionPrimitive.Root 
      type="multiple" 
      className={cn('space-y-2', className)}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}