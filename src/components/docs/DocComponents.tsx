'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check, 
  Info as InfoIcon, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Card Component
interface CardProps {
  title: string;
  icon?: React.ComponentType<any>;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, icon: Icon, href, children, className = '' }: CardProps) => {
  const content = (
    <div className={`group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/15 transition-colors">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">
            {title}
            {href && <ExternalLink className="inline w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />}
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
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return content;
};

// CardGroup Component
interface CardGroupProps {
  cols?: number;
  children: React.ReactNode;
  className?: string;
}

export const CardGroup = ({ cols = 2, children, className = '' }: CardGroupProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid gap-4 ${gridCols[cols as keyof typeof gridCols]} ${className}`}>
      {children}
    </div>
  );
};

// Tabs Component
interface TabsProps {
  children: React.ReactNode;
  className?: string;
}

interface TabProps {
  title: string;
  children: React.ReactNode;
}

export const Tab = ({ children }: TabProps) => <div>{children}</div>;

export const Tabs = ({ children, className = '' }: TabsProps) => {
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border-b border-white/10">
        <div className="flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === index
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              {tab.props.title}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        {tabs[activeTab]?.props.children}
      </div>
    </div>
  );
};

// Accordion Components
interface AccordionProps {
  title: string;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
}

interface AccordionGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const Accordion = ({ title, icon: Icon, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-white/80" />}
          <span className="text-white font-medium">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 text-white/70 leading-relaxed border-t border-white/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AccordionGroup = ({ children, className = '' }: AccordionGroupProps) => (
  <div className={`space-y-2 ${className}`}>
    {children}
  </div>
);

// Steps Component
interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export const Step = ({ title, children }: StepProps) => (
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

export const Steps = ({ children, className = '' }: StepsProps) => {
  const steps = React.Children.toArray(children);
  
  return (
    <div className={`space-y-0 ${className}`}>
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
};

// Alert Components
interface AlertProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const Alert = ({ type = 'info', children, className = '' }: AlertProps) => {
  const styles = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: Info
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
    <div className={`flex gap-3 p-4 rounded-lg border ${style.bg} ${style.border} ${className}`}>
      <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 text-white/80 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

// Convenience alert components
export const Info = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <Alert type="info" className={className}>{children}</Alert>
);

export const Warning = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <Alert type="warning" className={className}>{children}</Alert>
);

export const Tip = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <Alert type="success" className={className}>{children}</Alert>
);

// Code Block Component
interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  className?: string;
}

export const CodeBlock = ({ children, language = '', filename, className = '' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${className}`}>
      {filename && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-white/60 text-sm font-mono">
          {filename}
        </div>
      )}
      <div className="relative">
        <pre className="p-4 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-x-auto text-sm">
          <code className={`language-${language}`} style={{ color: '#e4e4e7' }}>
            {children}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-white/60" />
          )}
        </button>
      </div>
    </div>
  );
};

// Table Component (for better table styling)
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full border-collapse">
      {children}
    </table>
  </div>
);

// Frame Component for images/content
interface FrameProps {
  children: React.ReactNode;
  className?: string;
}

export const Frame = ({ children, className = '' }: FrameProps) => (
  <div className={`p-4 bg-white/5 border border-white/10 rounded-lg ${className}`}>
    {children}
  </div>
);