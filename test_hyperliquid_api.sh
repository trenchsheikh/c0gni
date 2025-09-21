#!/bin/bash

# Hyperliquid API Testing Script
# This script tests various Hyperliquid API endpoints to understand data structures

echo "=== Testing Hyperliquid API Endpoints ==="
echo "Base URL: https://api.hyperliquid.xyz/info"
echo ""

# Test 1: Get metadata (universe, spot assets)
echo "1. Testing 'meta' endpoint..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "meta"}' | jq '.' > hyperliquid_meta.json
echo "✓ Saved to hyperliquid_meta.json"
echo ""

# Test 2: Get all mid prices
echo "2. Testing 'allMids' endpoint..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "allMids"}' | jq '.' > hyperliquid_mids.json
echo "✓ Saved to hyperliquid_mids.json"
echo ""

# Test 3: Get 24h stats for all markets
echo "3. Testing 'metaAndAssetCtxs' endpoint..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "metaAndAssetCtxs"}' | jq '.' > hyperliquid_asset_contexts.json
echo "✓ Saved to hyperliquid_asset_contexts.json"
echo ""

# Test 4: Get order book for BTC-USD
echo "4. Testing 'l2Book' endpoint for BTC..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "l2Book", "coin": "BTC"}' | jq '.' > hyperliquid_btc_orderbook.json
echo "✓ Saved to hyperliquid_btc_orderbook.json"
echo ""

# Test 5: Get order book for ETH-USD
echo "5. Testing 'l2Book' endpoint for ETH..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "l2Book", "coin": "ETH"}' | jq '.' > hyperliquid_eth_orderbook.json
echo "✓ Saved to hyperliquid_eth_orderbook.json"
echo ""

# Test 6: Get funding rates
echo "6. Testing funding rate endpoints..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "fundingRates"}' | jq '.' > hyperliquid_funding_rates.json
echo "✓ Saved to hyperliquid_funding_rates.json"
echo ""

# Test 7: Get candle data for BTC (1h timeframe)
echo "7. Testing 'candleSnapshot' endpoint for BTC..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "candleSnapshot", "req": {"coin": "BTC", "interval": "1h", "startTime": '$(( $(date +%s) * 1000 - 24 * 60 * 60 * 1000 ))', "endTime": '$(( $(date +%s) * 1000 ))'}}' | jq '.' > hyperliquid_btc_candles.json
echo "✓ Saved to hyperliquid_btc_candles.json"
echo ""

# Test 8: Check spot metadata
echo "8. Testing spot metadata..."
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "spotMeta"}' | jq '.' > hyperliquid_spot_meta.json
echo "✓ Saved to hyperliquid_spot_meta.json"
echo ""

echo "=== API Testing Complete ==="
echo "Files created:"
echo "- hyperliquid_meta.json (market metadata)"
echo "- hyperliquid_mids.json (current prices)"
echo "- hyperliquid_asset_contexts.json (24h stats, volume, etc.)"
echo "- hyperliquid_btc_orderbook.json (BTC order book)"
echo "- hyperliquid_eth_orderbook.json (ETH order book)"
echo "- hyperliquid_funding_rates.json (funding rates)"
echo "- hyperliquid_btc_candles.json (BTC price history)"
echo "- hyperliquid_spot_meta.json (spot market info)"
echo ""
echo "Review these files to understand the actual data structures returned by Hyperliquid API"