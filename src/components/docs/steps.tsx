import React from 'react';
import { cn } from '@/lib/utils';

interface StepProps {
  title: string;
  children: React.ReactNode;
}

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
        {/* Step number will be injected by Steps component */}
      </div>
      <div className="flex-1 pb-8">
        <h3 className="text-white font-medium mb-2">{title}</h3>
        <div className="text-white/70 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function Steps({ children, className }: StepsProps) {
  const steps = React.Children.toArray(children);
  
  return (
    <div className={cn('space-y-0', className)}>
      {steps.map((step, index) => {
        if (React.isValidElement<StepProps>(step)) {
          return (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-px h-full bg-white/20" />
              )}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium relative z-10">
                  {index + 1}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-white font-medium mb-2">{step.props.title}</h3>
                  <div className="text-white/70 leading-relaxed">{step.props.children}</div>
                </div>
              </div>
            </div>
          );
        }
        return step;
      })}
    </div>
  );
}