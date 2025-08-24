'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ChevronRight, 
  ChevronDown, 
  Book, 
  Rocket, 
  Coins, 
  Settings,
  Users,
  Code,
  Shield,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  badge?: string;
}

const navigationStructure: NavItem[] = [
  {
    title: "Getting Started",
    icon: Rocket,
    children: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/quickstart" },
      { title: "Token Overview", href: "/docs/token" },
      { title: "Architecture", href: "/docs/architecture" }
    ]
  },
  {
    title: "Agent System",
    icon: Users,
    children: [
      { title: "Overview", href: "/docs/agents" },
      { title: "Agent Types", href: "/docs/agents/types" },
      { title: "Swarm Intelligence", href: "/docs/agents/swarms" },
      { title: "Performance", href: "/docs/agents/performance" },
      { title: "Lifecycle", href: "/docs/agents/lifecycle" }
    ]
  },
  {
    title: "Platform",
    icon: Settings,
    children: [
      { title: "Agent Factory", href: "/docs/platform/factory" },
      { title: "Agent Studio", href: "/docs/platform/studio" },
      { title: "Trading Terminal", href: "/docs/platform/terminal" },
      { title: "Marketplace", href: "/docs/platform/marketplace" }
    ]
  },
  {
    title: "Developer",
    icon: Code,
    children: [
      { title: "SDK Introduction", href: "/docs/sdk" },
      { title: "Python SDK", href: "/docs/sdk/python" },
      { title: "TypeScript SDK", href: "/docs/sdk/typescript" },
      { title: "API Reference", href: "/docs/api" }
    ]
  },
  {
    title: "Technical",
    icon: Shield,
    children: [
      { title: "Solana Integration", href: "/docs/technical/solana" },
      { title: "MEV Protection", href: "/docs/technical/mev" },
      { title: "On-Chain Memory", href: "/docs/technical/memory" },
      { title: "Security", href: "/docs/technical/security" }
    ]
  },
  {
    title: "Support",
    icon: HelpCircle,
    children: [
      { title: "FAQ", href: "/docs/support/faq" },
      { title: "Troubleshooting", href: "/docs/support/troubleshooting" },
      { title: "Community", href: "/docs/support/community" }
    ]
  }
];

interface DocLayoutProps {
  children: React.ReactNode;
}

export default function DocLayout({ children }: DocLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Getting Started']);
  const pathname = usePathname();

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isCurrentPage = (href: string) => {
    if (href === '/docs' && pathname === '/docs') return true;
    if (href !== '/docs' && pathname.startsWith(href)) return true;
    return false;
  };

  const NavSection = ({ section }: { section: NavItem }) => {
    const isExpanded = expandedSections.includes(section.title);
    const Icon = section.icon;

    return (
      <div className="mb-1">
        <button
          onClick={() => toggleSection(section.title)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            {section.title}
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        {isExpanded && section.children && (
          <div className="ml-6 mt-1 space-y-1">
            {section.children.map((item) => (
              <Link
                key={item.href}
                href={item.href!}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  isCurrentPage(item.href!)
                    ? 'text-blue-400 bg-blue-500/10 border-l-2 border-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.title}
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur">
        <div className="flex h-16 items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link href="/" className="flex items-center gap-3 text-white font-semibold">
            <Image 
              src="/c0gni-c-white.svg" 
              alt="c0gni logo" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
            c0gni Docs
          </Link>
          
          <div className="ml-auto flex items-center gap-4">
            <Link 
              href="https://app.cognilabs.com"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-80 bg-[#0A0A0A] border-r border-white/10 transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10 lg:hidden">
            <span className="text-white font-semibold">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 pt-6 space-y-2 h-full overflow-y-auto">
            {navigationStructure.map((section) => (
              <NavSection key={section.title} section={section} />
            ))}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}