'use client';

import React from "react";
import { motion } from "framer-motion";
import { Home, Brain, Activity, TrendingUp, BarChart3, ArrowRightLeft, Target } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { id: "overview", label: "Trading Overview", icon: Home, href: "/dashboard" },
  { id: "polymarket", label: "Polymarket", icon: TrendingUp, href: "/dashboard/polymarket" },
  { id: "hyperliquid", label: "Hyperliquid", icon: BarChart3, href: "/dashboard/hyperliquid" },
  { id: "portfolio", label: "Portfolio", icon: Target, href: "/dashboard/portfolio" },
  { id: "bridge", label: "Cross-Chain", icon: ArrowRightLeft, href: "/dashboard/bridge" },
  { id: "agents", label: "AI Assistant", icon: Brain, href: "/dashboard/agents" }
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-6 top-6 bottom-6 z-50 w-64"
    >
      <div className="h-full flex flex-col bg-white/5 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex justify-center cursor-pointer mb-12 pb-6 border-b border-white/10 relative z-10"
        >
          <Image src="/c0gni-white.svg" alt="C0gni Labs" width={200} height={80} className="w-full h-auto max-w-full" />
        </motion.div>
        
        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  whileHover={{ 
                    scale: 1.02, 
                    x: 4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer group ${
                    isActive 
                      ? 'bg-white/15 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/10 rounded-2xl border border-white/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:h-6"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                    isActive ? 'text-white' : 'group-hover:text-white'
                  }`} />
                  <span className={`relative z-10 font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'group-hover:text-white'
                  }`}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 w-2 h-2 bg-white/60 rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-white/10 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/15">
                <span className="text-white/80 font-medium text-sm">AU</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0A0A0A]"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white group-hover:text-white transition-colors">Admin User</div>
              <div className="text-xs text-white/50 group-hover:text-white/70 transition-colors">admin@c0gni.labs</div>
            </div>
            <motion.div
              className="w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}