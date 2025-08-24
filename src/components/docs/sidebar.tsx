'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationConfig, NavItem } from './navigation-config';

interface SidebarProps {
  className?: string;
}

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.items && item.items.length > 0;
  const isActive = item.href === pathname;
  const Icon = item.icon;

  // Auto-expand if child is active
  useEffect(() => {
    if (hasChildren && item.items?.some(child => child.href === pathname)) {
      setIsOpen(true);
    }
  }, [pathname, hasChildren, item.items]);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            "hover:bg-white/5 text-white/80 hover:text-white",
            depth === 0 && "mt-1"
          )}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className={cn("mt-1", depth > 0 && "ml-4")}>
            {item.items.map((child, index) => (
              <NavItemComponent key={index} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
        isActive
          ? "bg-blue-500/20 text-blue-400 font-medium"
          : "text-white/70 hover:bg-white/5 hover:text-white",
        depth > 0 && "ml-6"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{item.title}</span>
    </Link>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-lg rounded-lg lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-black/90 backdrop-blur-xl border-r border-white/10",
          "transform transition-transform duration-200 ease-in-out overflow-hidden",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-6 border-b border-white/10">
            <Link href="/docs" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">C</span>
              </div>
              <span className="text-white font-semibold text-lg">c0gni Docs</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {navigationConfig.map((item, index) => (
              <NavItemComponent key={index} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              ← Back to main site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}