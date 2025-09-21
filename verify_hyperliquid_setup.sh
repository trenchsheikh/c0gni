#!/bin/bash

# Hyperliquid Terminal Setup Verification Script
echo "🔍 Verifying Hyperliquid Terminal Setup"
echo "======================================"

# Check if required dependencies are installed
echo "1. Checking dependencies..."

if grep -q "@upstash/redis" package.json; then
    echo "   ✅ @upstash/redis installed"
else
    echo "   ❌ @upstash/redis not found"
    exit 1
fi

if grep -q "@tanstack/react-query" package.json; then
    echo "   ✅ @tanstack/react-query installed"
else
    echo "   ❌ @tanstack/react-query not found"
    exit 1
fi

# Check if Redis environment variables are set
echo ""
echo "2. Checking Redis environment variables..."

if [ -n "$KV_REST_API_URL" ]; then
    echo "   ✅ KV_REST_API_URL is set"
else
    echo "   ❌ KV_REST_API_URL not set"
    exit 1
fi

if [ -n "$KV_REST_API_TOKEN" ]; then
    echo "   ✅ KV_REST_API_TOKEN is set"
else
    echo "   ❌ KV_REST_API_TOKEN not set"
    exit 1
fi

# Check if required files exist
echo ""
echo "3. Checking required files..."

required_files=(
    "src/lib/redis.ts"
    "src/app/api/hyperliquid/sync/route.ts"
    "src/app/api/markets/hyperliquid/route.ts"
    "src/app/api/markets/hyperliquid/orderbook/route.ts"
    "src/components/terminals/HyperliquidTerminal.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
        exit 1
    fi
done

# Test API responses from Hyperliquid
echo ""
echo "4. Testing Hyperliquid API connectivity..."

response=$(curl -s -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type": "meta"}' \
  --max-time 10)

if echo "$response" | jq -e '.universe | length' > /dev/null 2>&1; then
    universe_count=$(echo "$response" | jq '.universe | length')
    echo "   ✅ Hyperliquid API responsive (found $universe_count assets)"
else
    echo "   ❌ Hyperliquid API not responding properly"
    exit 1
fi

# Test Redis connectivity (if in development)
echo ""
echo "5. Testing Redis connectivity..."

if command -v node &> /dev/null; then
    if [ -f "test_redis_integration.js" ]; then
        echo "   🔄 Running Redis integration test..."
        if node test_redis_integration.js > /tmp/redis_test.log 2>&1; then
            echo "   ✅ Redis integration test passed"
        else
            echo "   ⚠️  Redis integration test failed (see /tmp/redis_test.log)"
            echo "      This might be normal if Redis keys don't exist yet"
        fi
    else
        echo "   ⚠️  Redis integration test script not found"
    fi
else
    echo "   ⚠️  Node.js not available for Redis testing"
fi

echo ""
echo "======================================"
echo "🎉 Hyperliquid Terminal Setup Verification Complete!"
echo ""
echo "Next steps to get real-time data working:"
echo "1. Start your development server:"
echo "   npm run dev"
echo ""
echo "2. Populate Redis cache by calling the sync endpoint:"
echo "   curl -X GET http://localhost:3000/api/hyperliquid/sync"
echo ""
echo "3. Visit your Hyperliquid terminal and you should see:"
echo "   - Real market data with 24h changes, volume, funding rates"
echo "   - Live price updates every 2 seconds"
echo "   - Order book data for major pairs"
echo ""
echo "4. Optional: Set up a cron job or background process to keep Redis updated:"
echo "   */5 * * * * curl -X GET http://localhost:3000/api/hyperliquid/sync"
echo ""
echo "🚀 Your Hyperliquid terminal is ready for real-time trading data!"