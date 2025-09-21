import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  env: {
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    HYPERLIQUID_INFO_URL: process.env.HYPERLIQUID_INFO_URL,
  },
  webpack: (config, { isServer }) => {
    // Fix for MetaMask SDK React Native dependencies in web environment
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
      'react-native-get-random-values': false,
      'react-native-svg': false,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore React Native modules in browser builds
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        '@react-native-async-storage/async-storage': 'null',
        'react-native': 'null',
        'react-native-get-random-values': 'null',
        'react-native-svg': 'null',
      });
    }

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    };
    return config;
  },
  compress: false,
  poweredByHeader: false,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
