'use client';

import React from "react";
import { motion } from "framer-motion";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  onClick?: () => void;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
}

export function AnimatedContainer({
  children,
  className = "",
  delay = 0,
  direction = 'up',
  onClick,
  whileHover,
  whileTap
}: AnimatedContainerProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 20 };
      case 'down': return { opacity: 0, y: -20 };
      case 'left': return { opacity: 0, x: 20 };
      case 'right': return { opacity: 0, x: -20 };
      default: return { opacity: 0, y: 20 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}