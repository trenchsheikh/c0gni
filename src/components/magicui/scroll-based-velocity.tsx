"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";

interface ScrollVelocityProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollVelocityContainer({ children, className }: ScrollVelocityProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

interface ScrollVelocityRowProps {
  children: React.ReactNode;
  className?: string;
  baseVelocity?: number;
  direction?: 1 | -1;
}

export function ScrollVelocityRow({
  children,
  className,
  baseVelocity = 5,
  direction = 1,
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(direction);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -direction;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = direction;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={cn("flex whitespace-nowrap", className)}>
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
      </motion.div>
    </div>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};