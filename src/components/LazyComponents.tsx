'use client';

import dynamic from 'next/dynamic';

// Lazy load heavy components to reduce initial bundle size
export const Globe = dynamic(() => import('./magicui/globe').then(mod => ({ default: mod.Globe })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/20 animate-pulse rounded-full" />
});

export const MacbookScroll = dynamic(() => import('./ui/macbook-scroll').then(mod => ({ default: mod.MacbookScroll })), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-black/20 animate-pulse rounded-xl" />
});

export const Iridescence = dynamic(() => import('./Iridescence'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
});

export const AnimatedBeam = dynamic(() => import('./magicui/animated-beam').then(mod => ({ default: mod.AnimatedBeam })), {
  ssr: false,
  loading: () => <div className="w-full h-full" />
});

export const ScrollBasedVelocity = dynamic(() => import('./magicui/scroll-based-velocity').then(mod => ({ 
  default: mod.ScrollVelocityContainer 
})), {
  ssr: false,
  loading: () => <div className="w-full h-20" />
});

export const ScrollVelocityRow = dynamic(() => import('./magicui/scroll-based-velocity').then(mod => ({ 
  default: mod.ScrollVelocityRow 
})), {
  ssr: false,
  loading: () => <div className="w-full h-8" />
});

export const LightRays = dynamic(() => import('./LightRays'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent opacity-50" />
  )
});