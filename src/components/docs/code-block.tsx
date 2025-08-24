'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ children, language = '', filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group', className)}>
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
}