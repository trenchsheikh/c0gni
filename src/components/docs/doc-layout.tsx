'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { PageNavigation } from './page-navigation';

interface DocLayoutProps {
  children: React.ReactNode;
}

export default function DocLayout({ children }: DocLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      
      {/* Main content area */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-8 pt-16 lg:pt-8">
            <Breadcrumbs />
            <div className="mt-8">
              {children}
            </div>
            <PageNavigation />
          </div>
        </main>
      </div>
    </div>
  );
}