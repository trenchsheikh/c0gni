import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { getMarketData as getHyperliquidCache, getPolymarketMarkets as getPolymarketCache } from '@/lib/redis'

// Polymarket Data Tool
export const getPolymarketDataTool = new DynamicStructuredTool({
  name: 'getPolymarketData',
  description: 'Get real-time Polymarket prediction market data including active markets, prices, volumes, and trading opportunities. Use this to analyze prediction markets and betting opportunities.',
  schema: z.object({
    query: z.string().describe('What specific market data you want: "trending", "politics", "crypto", "sports", "active", or search terms'),
    limit: z.number().optional().nullable().describe('Number of markets to return (default 10, max 50)')
  }),
  func: async ({ query, limit }) => {
    try {
      console.log(`🎯 [AGENT] Fetching Polymarket data for: "${query}"`)

      const effLimit = typeof limit === 'number' && Number.isFinite(limit) ? limit : 10

      // Prefer cached data from our Redis instance; avoid network fetches here
      let markets = await getPolymarketCache() || []
      // Auto-refresh via API route if cache is empty
      if (!Array.isArray(markets) || markets.length === 0) {
        try {
          const base = (process.env.NEXT_PUBLIC_CHAT_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '')
          await fetch(`${base}/api/markets/polymarket`, { cache: 'no-store' })
          markets = await getPolymarketCache() || []
        } catch {}
      }

      // Improved categorization and filtering using tags+question with a scoring model
      const CATEGORY_SYNONYMS: Record<string, string[]> = {
        politics: ['politics', 'election', 'president', 'trump', 'biden', 'senate', 'congress', 'vote', 'policy', 'primary'],
        crypto: ['crypto', 'bitcoin', 'btc', 'ethereum', 'eth', 'token', 'nft', 'defi', 'solana', 'sol', 'altcoin', 'web3'],
        sports: ['sports', 'nfl', 'nba', 'mlb', 'soccer', 'football', 'basketball', 'baseball', 'tennis', 'golf', 'ufc', 'match', 'game', 'championship', 'world cup'],
        technology: ['technology', 'tech', 'ai', 'gpt', 'apple', 'google', 'microsoft', 'tesla', 'spacex', 'openai'],
        economics: ['economics', 'market', 'stock', 'gdp', 'inflation', 'recession', 'fed', 'federal reserve', 'interest rate', 'cpi', 'unemployment'],
        science: ['science', 'climate', 'weather', 'hurricane', 'earthquake', 'temperature', 'global warming', 'space', 'biology'],
        entertainment: ['entertainment', 'movie', 'oscar', 'celebrity', 'music', 'album', 'netflix', 'award', 'tv', 'series']
      }

      const allSynonyms = Object.entries(CATEGORY_SYNONYMS).reduce<Record<string, string>>((acc, [cat, list]) => {
        for (const term of list) acc[term] = cat
        return acc
      }, {})

      const normalize = (s?: string) => (s || '').toLowerCase()
      const safeNum = (n: any) => (typeof n === 'number' && Number.isFinite(n)) ? n : (parseFloat(n) || 0)
      const scoreMarket = (m: any) => safeNum(m.volume24h) * 1.0 + safeNum(m.totalVolume) * 0.5 + safeNum(m.liquidity) * 0.3
      const hasTag = (m: any, term: string) => Array.isArray(m.tags) && m.tags.some((t: any) => normalize(String(t)).includes(term))
      const textIncludes = (m: any, term: string) => normalize(m.question).includes(term) || normalize(m.description).includes(term)

      const matchesCategory = (m: any, catKey: string) => {
        const synonyms = CATEGORY_SYNONYMS[catKey] || []
        // Match by explicit category label if present
        if (normalize(m.category) === catKey) return true
        // Match by tags
        if (synonyms.some(s => hasTag(m, s))) return true
        // Match by question/description text
        if (synonyms.some(s => textIncludes(m, s))) return true
        return false
      }

      // Filter markets based on query
      let filteredMarkets = markets
      const queryLower = query.toLowerCase().trim()

      if (queryLower === 'trending') {
        filteredMarkets = markets
          .filter((m: any) => m.status === 'active')
          .sort((a: any, b: any) => scoreMarket(b) - scoreMarket(a))
          .slice(0, effLimit)
      } else if (queryLower === 'active') {
        filteredMarkets = markets
          .filter((m: any) => m.status === 'active')
          .slice(0, effLimit)
      } else if (CATEGORY_SYNONYMS[queryLower] || allSynonyms[queryLower]) {
        const targetCat = CATEGORY_SYNONYMS[queryLower] ? queryLower : allSynonyms[queryLower]
        filteredMarkets = markets
          .filter((m: any) => matchesCategory(m, targetCat))
          .sort((a: any, b: any) => scoreMarket(b) - scoreMarket(a))
          .slice(0, effLimit)
      } else {
        // Search markets by question content
        filteredMarkets = markets
          .map((m: any) => ({
            m,
            score:
              (textIncludes(m, queryLower) ? 5 : 0) +
              (hasTag(m, queryLower) ? 5 : 0) +
              scoreMarket(m) / 1e5 // scale down to keep contribution reasonable
          }))
          .filter(({ m, score }: any) => m.status === 'active' && score > 0)
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, effLimit)
          .map(({ m }: any) => m)
      }

      const formattedData = filteredMarkets.map((market: any) => ({
        id: market.id,
        question: market.question,
        category: market.category,
        yesPrice: market.yesPrice,
        noPrice: market.noPrice,
        impliedOdds: market.impliedOdds,
        volume24h: market.volume24h,
        totalVolume: market.totalVolume,
        liquidity: market.liquidity,
        status: market.status,
        resolutionDate: market.resolutionDate,
        marketUrl: `https://polymarket.com/market/${market.id}`,
        dashboardUrl: `/dashboard/polymarket/${market.id}`
      }))

      console.log(`📊 [AGENT] Found ${formattedData.length} Polymarket markets`)

      return JSON.stringify({
        markets: formattedData,
        totalFound: filteredMarkets.length,
        query,
        timestamp: new Date().toISOString(),
        summary: `Found ${formattedData.length} markets for "${query}". Top market: ${formattedData[0]?.question || 'None'}`
      })
    } catch (error) {
      console.error('[AGENT] Polymarket data error:', error)
      return JSON.stringify({
        markets: [],
        error: 'No cached Polymarket data',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
})

// Hyperliquid Data Tool
export const getHyperliquidDataTool = new DynamicStructuredTool({
  name: 'getHyperliquidData',
  description: 'Get real-time Hyperliquid perpetual and spot market data including prices, funding rates, volumes, and trading opportunities. Use this for crypto derivatives analysis.',
  schema: z.object({
    query: z.string().describe('What data you want: "trending", "funding", "btc", "eth", "perp", "spot", or specific symbol like "BTC-USD"'),
    limit: z.number().optional().nullable().describe('Number of markets to return (default 10, max 50)')
  }),
  func: async ({ query, limit }) => {
    try {
      console.log(`⚡ [AGENT] Fetching Hyperliquid data for: "${query}"`)

      const effLimit = typeof limit === 'number' && Number.isFinite(limit) ? limit : 10

      // Read from our Redis cache only (no external fetch from tool)
      let markets = await getHyperliquidCache() || []
      // Auto-refresh via API route if cache is empty
      if (!Array.isArray(markets) || markets.length === 0) {
        try {
          const base = (process.env.NEXT_PUBLIC_CHAT_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '')
          await fetch(`${base}/api/markets/hyperliquid`, { cache: 'no-store' })
          markets = await getHyperliquidCache() || []
        } catch {}
      }

      // Filter markets based on query
      let filteredMarkets = markets
      const queryLower = query.toLowerCase()

      if (queryLower === 'trending') {
        filteredMarkets = markets
          .sort((a: any, b: any) => b.volume24h - a.volume24h)
          .slice(0, effLimit)
      } else if (queryLower === 'funding') {
        filteredMarkets = markets
          .filter((m: any) => m.marketType === 'perp' && m.fundingRate !== undefined)
          .sort((a: any, b: any) => Math.abs(b.fundingRate || 0) - Math.abs(a.fundingRate || 0))
          .slice(0, effLimit)
      } else if (queryLower === 'perp') {
        filteredMarkets = markets
          .filter((m: any) => m.marketType === 'perp')
          .slice(0, effLimit)
      } else if (queryLower === 'spot') {
        filteredMarkets = markets
          .filter((m: any) => m.marketType === 'spot')
          .slice(0, effLimit)
      } else {
        // Search by symbol or asset name
        filteredMarkets = markets
          .filter((m: any) =>
            m.symbol.toLowerCase().includes(queryLower) ||
            m.baseAsset.toLowerCase().includes(queryLower)
          )
          .slice(0, effLimit)
      }

      const formattedData = filteredMarkets.map((market: any) => ({
        symbol: market.symbol,
        baseAsset: market.baseAsset,
        quoteAsset: market.quoteAsset,
        marketType: market.marketType,
        markPrice: market.markPrice,
        lastPrice: market.lastPrice,
        priceChange24h: market.priceChange24h,
        priceChangePercent24h: market.priceChangePercent24h,
        volume24h: market.volume24h,
        openInterest: market.openInterest,
        fundingRate: market.fundingRate,
        nextFunding: market.nextFunding,
        maxLeverage: market.maxLeverage,
        status: market.status,
        dashboardUrl: `/dashboard/hyperliquid/${encodeURIComponent(market.symbol)}`
      }))

      console.log(`🚀 [AGENT] Found ${formattedData.length} Hyperliquid markets (cache)`)

      return JSON.stringify({
        markets: formattedData,
        totalFound: filteredMarkets.length,
        query,
        cached: true,
        timestamp: new Date().toISOString(),
        summary: `Found ${formattedData.length} markets for "${query}". Top market: ${formattedData[0]?.symbol || 'None'}`
      })
    } catch (error) {
      console.error('[AGENT] Hyperliquid data error:', error)
      return JSON.stringify({
        markets: [],
        error: 'No cached Hyperliquid data',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
})

// Market Analysis Tool
export const analyzeMarketOpportunityTool = new DynamicStructuredTool({
  name: 'analyzeMarketOpportunity',
  description: 'Analyze trading opportunities across Polymarket and Hyperliquid markets. Identifies high-volume, high-volatility, or arbitrage opportunities.',
  schema: z.object({
    analysisType: z.enum(['volume', 'volatility', 'funding', 'arbitrage', 'trending']).describe('Type of analysis to perform'),
    timeframe: z.enum(['1h', '4h', '24h']).optional().nullable().describe('Timeframe for analysis (default 24h)')
  }),
  func: async ({ analysisType, timeframe }) => {
    try {
      const effectiveTimeframe = (timeframe ?? '24h') as '1h' | '4h' | '24h'
      console.log(`🔍 [AGENT] Analyzing market opportunities: ${analysisType} (${effectiveTimeframe})`)

      // Read directly from Redis cache (no external fetch)
      const [polyMarkets, hyperMarkets] = await Promise.all([
        getPolymarketCache().then(m => m || []),
        getHyperliquidCache().then(m => m || []),
      ])

      let opportunities: any[] = []

      switch (analysisType) {
        case 'volume':
          // High volume opportunities
          const highVolumePolymarkets = polyMarkets
            .filter((m: any) => m.volume24h > 10000)
            .sort((a: any, b: any) => b.volume24h - a.volume24h)
            .slice(0, 5)
            .map((m: any) => ({
              platform: 'Polymarket',
              type: 'High Volume Prediction Market',
              market: m.question,
              volume24h: m.volume24h,
              opportunity: `High activity market with $${m.volume24h.toLocaleString()} daily volume`,
              url: `/dashboard/polymarket/${m.id}`
            }))

          const highVolumeHypermarkets = hyperMarkets
            .filter((m: any) => m.volume24h > 1000000)
            .sort((a: any, b: any) => b.volume24h - a.volume24h)
            .slice(0, 5)
            .map((m: any) => ({
              platform: 'Hyperliquid',
              type: 'High Volume Perpetual',
              market: m.symbol,
              volume24h: m.volume24h,
              opportunity: `High liquidity ${m.marketType} with $${m.volume24h.toLocaleString()} daily volume`,
              url: `/dashboard/hyperliquid/${encodeURIComponent(m.symbol)}`
            }))

          opportunities = [...highVolumePolymarkets, ...highVolumeHypermarkets]
          break

        case 'funding':
          // Funding rate opportunities
          opportunities = hyperMarkets
            .filter((m: any) => m.marketType === 'perp' && Math.abs(m.fundingRate || 0) > 0.0001)
            .sort((a: any, b: any) => Math.abs(b.fundingRate || 0) - Math.abs(a.fundingRate || 0))
            .slice(0, 10)
            .map((m: any) => ({
              platform: 'Hyperliquid',
              type: 'Funding Rate Opportunity',
              market: m.symbol,
              fundingRate: (m.fundingRate * 100).toFixed(4) + '%',
              opportunity: `${m.fundingRate > 0 ? 'Receive' : 'Pay'} funding rate of ${Math.abs(m.fundingRate * 100).toFixed(4)}%`,
              url: `/dashboard/hyperliquid/${encodeURIComponent(m.symbol)}`
            }))
          break

        case 'trending':
          // Trending opportunities based on price movement and volume
          const trendingPoly = polyMarkets
            .filter((m: any) => m.volume24h > 5000)
            .sort((a: any, b: any) => b.volume24h - a.volume24h)
            .slice(0, 3)
            .map((m: any) => ({
              platform: 'Polymarket',
              type: 'Trending Prediction Market',
              market: m.question,
              trend: `${(m.impliedOdds * 100).toFixed(1)}% implied probability`,
              opportunity: `Active betting on: ${m.question.substring(0, 80)}...`,
              url: `/dashboard/polymarket/${m.id}`
            }))

          const trendingHyper = hyperMarkets
            .filter((m: any) => Math.abs(m.priceChangePercent24h) > 5)
            .sort((a: any, b: any) => Math.abs(b.priceChangePercent24h) - Math.abs(a.priceChangePercent24h))
            .slice(0, 3)
            .map((m: any) => ({
              platform: 'Hyperliquid',
              type: 'High Volatility Asset',
              market: m.symbol,
              trend: `${m.priceChangePercent24h > 0 ? '+' : ''}${m.priceChangePercent24h.toFixed(2)}% (24h)`,
              opportunity: `High volatility trading opportunity`,
              url: `/dashboard/hyperliquid/${encodeURIComponent(m.symbol)}`
            }))

          opportunities = [...trendingPoly, ...trendingHyper]
          break

        default:
          opportunities = []
      }

      console.log(`💰 [AGENT] Found ${opportunities.length} market opportunities`)

      return JSON.stringify({
        opportunities,
        analysisType,
        timeframe: effectiveTimeframe,
        totalOpportunities: opportunities.length,
        timestamp: new Date().toISOString(),
        summary: `Found ${opportunities.length} ${analysisType} opportunities across Polymarket and Hyperliquid`
      })
    } catch (error) {
      console.error('[AGENT] Market analysis error:', error)
      return JSON.stringify({
        opportunities: [],
        error: 'Failed to analyze market opportunities',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
})

// Portfolio Analysis Tool (if we have position data)
export const getPortfolioInsightsTool = new DynamicStructuredTool({
  name: 'getPortfolioInsights',
  description: 'Analyze user portfolio performance and provide insights on Polymarket positions and Hyperliquid trades. Requires user to be connected.',
  schema: z.object({
    platform: z.enum(['polymarket', 'hyperliquid', 'both']).describe('Which platform to analyze'),
    analysisType: z.enum(['performance', 'risk', 'opportunities']).describe('Type of portfolio analysis')
  }),
  func: async ({ platform, analysisType }) => {
    try {
      console.log(`📊 [AGENT] Analyzing portfolio: ${platform} (${analysisType})`)

      const insights: any[] = []

      if (platform === 'polymarket' || platform === 'both') {
        try {
          const base = (process.env.NEXT_PUBLIC_CHAT_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3002').replace(/\/$/, '')
          const response = await fetch(`${base}/api/markets/polymarket/positions`, {
            cache: 'no-store'
          })
          if (response.ok) {
            const data = await response.json()
            const positions = data.positions || []

            if (positions.length > 0) {
              const totalValue = positions.reduce((sum: number, pos: any) => sum + pos.marketValue, 0)
              const totalPnL = positions.reduce((sum: number, pos: any) => sum + pos.unrealizedPnl, 0)

              insights.push({
                platform: 'Polymarket',
                analysis: analysisType,
                totalPositions: positions.length,
                totalValue: totalValue,
                totalPnL: totalPnL,
                profitability: totalPnL > 0 ? 'Profitable' : 'Unprofitable',
                recommendations: totalPnL < 0 ?
                  ['Consider diversifying across different categories', 'Review position sizing strategy'] :
                  ['Maintain current strategy', 'Consider taking profits on winning positions']
              })
            }
          }
        } catch (error) {
          console.log('No Polymarket positions available')
        }
      }

      if (platform === 'hyperliquid' || platform === 'both') {
        // Note: This would require actual Hyperliquid position data
        insights.push({
          platform: 'Hyperliquid',
          analysis: analysisType,
          message: 'Portfolio analysis requires wallet connection and position data',
          recommendation: 'Connect wallet to view Hyperliquid portfolio insights'
        })
      }

      console.log(`📈 [AGENT] Generated ${insights.length} portfolio insights`)

      return JSON.stringify({
        insights,
        platform,
        analysisType,
        timestamp: new Date().toISOString(),
        hasData: insights.some(i => i.totalPositions > 0),
        summary: insights.length > 0 ?
          `Portfolio analysis complete for ${platform}` :
          'No portfolio data available - connect wallet to view insights'
      })
    } catch (error) {
      console.error('[AGENT] Portfolio analysis error:', error)
      return JSON.stringify({
        insights: [],
        error: 'Failed to analyze portfolio',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
})
