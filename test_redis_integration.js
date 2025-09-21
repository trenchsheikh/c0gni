#!/usr/bin/env node

// Test script for Redis integration with Hyperliquid data
// Run with: node test_redis_integration.js

const { Redis } = require('@upstash/redis');

// Redis client configuration
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const HL_INFO_URL = 'https://api.hyperliquid.xyz/info';

async function postInfo(body) {
  const resp = await fetch(HL_INFO_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`Hyperliquid info error ${resp.status}`);
  return resp.json();
}

async function testRedisConnection() {
  console.log('🔍 Testing Redis connection...');
  try {
    await redis.ping();
    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    return false;
  }
}

async function testHyperliquidAPI() {
  console.log('🔍 Testing Hyperliquid API...');
  try {
    const meta = await postInfo({ type: 'meta' });
    console.log(`✅ Hyperliquid API working - found ${meta.universe?.length || 0} assets`);
    return true;
  } catch (error) {
    console.error('❌ Hyperliquid API failed:', error.message);
    return false;
  }
}

async function testDataSync() {
  console.log('🔍 Testing data sync process...');
  try {
    // Fetch data from Hyperliquid
    const [metaAndAssetCtxs, mids] = await Promise.all([
      postInfo({ type: 'metaAndAssetCtxs' }),
      postInfo({ type: 'allMids' }),
    ]);

    const [universe, assetCtxs] = metaAndAssetCtxs;

    // Process one market for testing
    const btcAsset = universe.find(asset => asset.name === 'BTC');
    const btcCtx = assetCtxs[universe.indexOf(btcAsset)];

    if (!btcAsset || !btcCtx) {
      throw new Error('Could not find BTC data');
    }

    const testMarket = {
      symbol: 'BTC-USD',
      marketType: 'perp',
      baseAsset: 'BTC',
      quoteAsset: 'USD',
      markPrice: parseFloat(btcCtx.markPx || '0'),
      lastPrice: parseFloat(mids.BTC || '0'),
      volume24h: parseFloat(btcCtx.dayNtlVlm || '0'),
      fundingRate: parseFloat(btcCtx.funding || '0'),
      openInterest: parseFloat(btcCtx.openInterest || '0'),
      maxLeverage: btcAsset.maxLeverage,
    };

    // Store in Redis
    await redis.setex('test:btc-market', 60, JSON.stringify(testMarket));
    console.log('✅ Data stored in Redis');

    // Retrieve from Redis
    const retrieved = await redis.get('test:btc-market');
    const parsedData = JSON.parse(retrieved);

    console.log('✅ Data retrieved from Redis:');
    console.log(`   - Symbol: ${parsedData.symbol}`);
    console.log(`   - Mark Price: $${parsedData.markPrice.toLocaleString()}`);
    console.log(`   - 24h Volume: $${parsedData.volume24h.toLocaleString()}`);
    console.log(`   - Funding Rate: ${(parsedData.fundingRate * 100).toFixed(4)}%`);

    return true;
  } catch (error) {
    console.error('❌ Data sync test failed:', error.message);
    return false;
  }
}

async function testOrderBook() {
  console.log('🔍 Testing order book fetch...');
  try {
    const orderBook = await postInfo({ type: 'l2Book', coin: 'BTC' });

    if (orderBook?.levels) {
      const [bids, asks] = orderBook.levels;
      console.log('✅ Order book data retrieved:');
      console.log(`   - Best bid: $${bids[0]?.px || 'N/A'} (${bids[0]?.sz || 0} BTC)`);
      console.log(`   - Best ask: $${asks[0]?.px || 'N/A'} (${asks[0]?.sz || 0} BTC)`);
      console.log(`   - Spread: $${asks[0]?.px && bids[0]?.px ? (parseFloat(asks[0].px) - parseFloat(bids[0].px)).toFixed(2) : 'N/A'}`);

      // Store order book in Redis
      const formattedOrderBook = {
        bids: bids.slice(0, 10).map(level => ({
          price: parseFloat(level.px),
          size: parseFloat(level.sz)
        })),
        asks: asks.slice(0, 10).map(level => ({
          price: parseFloat(level.px),
          size: parseFloat(level.sz)
        })),
        lastUpdate: new Date().toISOString()
      };

      await redis.setex('test:btc-orderbook', 30, JSON.stringify(formattedOrderBook));
      console.log('✅ Order book stored in Redis');

      return true;
    } else {
      throw new Error('No order book levels found');
    }
  } catch (error) {
    console.error('❌ Order book test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Hyperliquid Redis Integration Tests');
  console.log('='.repeat(50));

  const tests = [
    testRedisConnection,
    testHyperliquidAPI,
    testDataSync,
    testOrderBook
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ Test failed with error: ${error.message}`);
      failed++;
    }
    console.log(''); // Add spacing between tests
  }

  console.log('='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All tests passed! Your Hyperliquid Redis integration is working correctly.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit /api/hyperliquid/sync to populate Redis with market data');
    console.log('3. Check the Hyperliquid terminal for real-time updates');
  } else {
    console.log('⚠️  Some tests failed. Please check your configuration and try again.');
  }
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };