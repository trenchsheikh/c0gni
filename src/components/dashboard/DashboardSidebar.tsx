'use client';

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Brain, TrendingUp, BarChart3, ArrowRightLeft, Target, ChevronLeft, ChevronRight, Wallet, LogOut, Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useWalletManager } from '@/hooks/useWalletManager';
import { walletUtils } from '@/lib/wallet';
import { useQueryClient } from '@tanstack/react-query';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const navItems = [
  { id: "overview", label: "Overview", icon: Home, href: "/dashboard" },
  { id: "polymarket", label: "Polymarket", icon: TrendingUp, href: "/dashboard/polymarket" },
  { id: "hyperliquid", label: "Hyperliquid", icon: BarChart3, href: "/dashboard/hyperliquid" },
  { id: "portfolio", label: "Portfolio", icon: Target, href: "/dashboard/portfolio" },
  { id: "bridge", label: "Bridge", icon: ArrowRightLeft, href: "/dashboard/bridge" },
  { id: "agents", label: "Agents", icon: Brain, href: "/dashboard/agents" }
];

interface DashboardSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function DashboardSidebar({ isCollapsed, toggleSidebar }: DashboardSidebarProps) {
  const queryClient = useQueryClient();
  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Prefetch data on hover for instant tab switching
  const handleMouseEnter = (href: string) => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }

    prefetchTimeout.current = setTimeout(() => {
      if (href === '/dashboard/polymarket') {
        // Prefetch Polymarket markets data
        queryClient.prefetchQuery({
          queryKey: ['polymarket-markets'],
          queryFn: async () => {
            const res = await fetch('/api/markets/polymarket', { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed to load markets (${res.status})`);
            const data = await res.json();
            return (data.markets || data || []).map((m: any) => ({
              id: m.id || m.slug || String(m.ticker || m.question || Math.random()),
              question: m.question || m.title || m.name || 'Untitled market',
              description: m.description || undefined,
              category: m.category || (Array.isArray(m.tags) && m.tags[0]) || 'All',
              yesPrice: typeof m.yesPrice === 'number' ? m.yesPrice : (m.prices?.yes ?? m.prices?.[0] ?? 0),
              noPrice: typeof m.noPrice === 'number' ? m.noPrice : (m.prices?.no ?? m.prices?.[1] ?? 0),
              volume24h: m.volume24h || m.volume_24h || 0,
              totalVolume: m.totalVolume || m.volume || 0,
              liquidity: m.liquidity || 0,
              resolutionDate: m.endDate ? new Date(m.endDate) : undefined,
              status: m.status || (m.active ? 'active' : 'closed'),
              tags: m.tags || [],
              impliedOdds: typeof m.impliedOdds === 'number' ? m.impliedOdds : (m.yesPrice ?? m.prices?.yes ?? 0)
            }));
          },
          staleTime: 60 * 1000,
        });
      } else if (href === '/dashboard/hyperliquid') {
        // Prefetch Hyperliquid markets data
        queryClient.prefetchQuery({
          queryKey: ['hyperliquid-markets'],
          queryFn: async () => {
            const res = await fetch('/api/markets/hyperliquid', { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed to load markets (${res.status})`);
            return res.json();
          },
          staleTime: 30 * 1000,
        });
      }
    }, 150);
  };
  const pathname = usePathname();
  const { isConnected, address, disconnect, connect } = useWalletManager();

  return (
    <motion.nav
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 280,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 z-50 h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-r border-white/5 flex flex-col"
    >
      {/* Logo Section */}
      <div className={`flex items-center h-20 px-6 border-b border-white/5 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-start"
            >
              <Image
                src="/c0gni-white.svg"
                alt="C0gni"
                width={180}
                height={50}
                className="h-14 w-auto object-contain"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="icon-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/c0gni-c-white.svg"
                alt="C0gni"
                width={32}
                height={32}
                className="w-8 h-8"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <div className={`flex-1 py-6 px-3 space-y-1 ${isCollapsed ? 'overflow-hidden' : 'overflow-y-auto scrollbar-hide'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.id} 
              href={item.href}
              prefetch={true}
              onMouseEnter={() => handleMouseEnter(item.href)}
            >
              <motion.div
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl transition-all duration-200 cursor-pointer group mb-1 ${isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-zinc-100'
                  }`}
              >
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}

                <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-white' : 'group-hover:text-zinc-100'}`} />

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 font-medium text-sm truncate"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-white/10">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5 flex flex-col gap-2">
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center justify-center py-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all duration-200 group`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          ) : (
            <ChevronLeft className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          )}
        </button>

        {isConnected && address ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer`}>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center border border-white/10">
                    <span className="text-white font-bold text-xs">
                      {address.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#050505]"></div>
                </div>

                {!isCollapsed && (
                  <div className="ml-3 overflow-hidden text-left">
                    <div className="text-sm font-medium text-zinc-200 truncate">
                      {walletUtils.formatAddress(address)}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">Connected</div>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-56 bg-zinc-900 border-white/10 text-white ml-2">
              <DropdownMenuLabel className="text-zinc-400">Wallet Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  toast.success('Address copied');
                }}
                className="focus:bg-white/10 focus:text-white cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Address
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => disconnect()}
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => connect()}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all duration-200 cursor-pointer border border-white/5`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>

            {!isCollapsed && (
              <div className="ml-3 font-medium text-sm">
                Connect Wallet
              </div>
            )}
          </button>
        )}
      </div>
    </motion.nav>
  );
}