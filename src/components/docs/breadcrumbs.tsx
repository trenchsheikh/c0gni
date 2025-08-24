'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { navigationConfig } from './navigation-config';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    // Always start with home
    breadcrumbs.push({
      title: 'Docs',
      href: '/docs',
      icon: Home,
    });
    
    // Build up the path
    let currentPath = '/docs';
    
    for (let i = 1; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      
      // Find the title from navigation config
      let title = paths[i];
      
      // Search through navigation config for matching href
      const findTitle = (items: any[], searchPath: string): string | null => {
        for (const item of items) {
          if (item.href === searchPath) {
            return item.title;
          }
          if (item.items) {
            const found = findTitle(item.items, searchPath);
            if (found) return found;
          }
        }
        return null;
      };
      
      const foundTitle = findTitle(navigationConfig, currentPath);
      if (foundTitle) {
        title = foundTitle;
      } else {
        // Capitalize and format the path segment
        title = paths[i]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      
      breadcrumbs.push({
        title,
        href: currentPath,
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on the main docs page
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-white/60">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white font-medium">
              {item.icon && <item.icon className="inline w-4 h-4 mr-1" />}
              {item.title}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-white transition-colors"
            >
              {item.icon && <item.icon className="inline w-4 h-4 mr-1" />}
              {item.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}