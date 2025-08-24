'use client';

import React from "react";
import { motion } from "framer-motion";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export function InteractiveCard({ 
  children, 
  className = "", 
  delay = 0, 
  onClick, 
  isSelected = false 
}: InteractiveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`border rounded-xl transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'bg-white/10 border-white/30' 
          : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}