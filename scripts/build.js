#!/usr/bin/env node

// Custom build script for Vercel deployment with memory optimization
const { execSync } = require('child_process');

console.log('🚀 Starting optimized build process...');

// Set memory limits and optimization flags
process.env.NODE_OPTIONS = '--max-old-space-size=7168 --optimize-for-size';

// Clear any existing build artifacts
try {
  execSync('rm -rf .next', { stdio: 'inherit' });
  console.log('✅ Cleared previous build artifacts');
} catch (e) {
  console.log('⚠️  No previous build artifacts to clear');
}

// Run the Next.js build
try {
  console.log('📦 Building application...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
    }
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}