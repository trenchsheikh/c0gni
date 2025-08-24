'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { navigationConfig } from './navigation-config';

interface NavLink {
  title: string;
  href: string;
}

export function PageNavigation() {
  const pathname = usePathname();
  
  // Flatten navigation structure to get all pages in order
  const getAllPages = (): NavLink[] => {
    const pages: NavLink[] = [];
    
    const extractPages = (items: any[]) => {
      for (const item of items) {
        if (item.href) {
          pages.push({ title: item.title, href: item.href });
        }
        if (item.items) {
          extractPages(item.items);
        }
      }
    };
    
    extractPages(navigationConfig);
    return pages;
  };
  
  const allPages = getAllPages();
  const currentIndex = allPages.findIndex(page => page.href === pathname);
  
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;
  
  if (!prevPage && !nextPage) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/10">
      {prevPage ? (
        <Link
          href={prevPage.href}
          className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <div>
            <div className="text-xs text-white/40">Previous</div>
            <div className="text-sm font-medium">{prevPage.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      
      {nextPage ? (
        <Link
          href={nextPage.href}
          className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors text-right"
        >
          <div>
            <div className="text-xs text-white/40">Next</div>
            <div className="text-sm font-medium">{nextPage.title}</div>
          </div>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}