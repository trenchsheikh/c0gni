import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

const GECKOTERMINAL_BASE_URL = 'https://api.geckoterminal.com/api/v2'

// Helper function to make API requests with error handling
async function geckoterminalFetch(endpoint: string, params: Record<string, any> = {}) {
  try {
    const url = new URL(`${GECKOTERMINAL_BASE_URL}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })

    console.log(`[GeckoTerminal API] Fetching: ${url.toString()}`)
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'c0gni-ai-chat/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[GeckoTerminal API] Success: ${endpoint}`)
    return data
  } catch (error) {
    console.error(`[GeckoTerminal API] Error: ${endpoint}`, error)
    throw error
  }
}

export const listSupportedNetworksTool = new DynamicStructuredTool({
  name: "listSupportedNetworks",
  description: "Get a list of all supported blockchain networks on GeckoTerminal. Use this to discover which chains are available for analysis.",
  schema: z.object({
    page: z.number().optional().describe("Page number for pagination (default: 1)")
  }),
  func: async ({ page = 1 }) => {
    const data = await geckoterminalFetch('/networks', { page })
    return JSON.stringify(data)
  }
})

export const searchPoolsTool = new DynamicStructuredTool({
  name: "searchPools",
  description: "Search for trading pools across multiple networks. Useful for finding specific tokens or trading pairs.",
  schema: z.object({
    query: z.string().describe("Search query (token name, symbol, or address)"),
    network: z.string().optional().describe("Specific network to search in (e.g., 'eth', 'solana')"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ query, network, page = 1 }) => {
    const params: any = { query, page }
    if (network) params.network = network
    
    const data = await geckoterminalFetch('/search/pools', params)
    return JSON.stringify(data)
  }
})

export const getPoolDetailsTool = new DynamicStructuredTool({
  name: "getPoolDetails",
  description: "Get detailed information about a specific trading pool including price, volume, liquidity, and metadata.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    poolAddress: z.string().describe("Pool contract address")
  }),
  func: async ({ network, poolAddress }) => {
    const data = await geckoterminalFetch(`/networks/${network}/pools/${poolAddress}`)
    return JSON.stringify(data)
  }
})

export const getSimpleTokenPriceTool = new DynamicStructuredTool({
  name: "getSimpleTokenPrice",
  description: "Get current price of a token on a specific network. Quick way to check token prices.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    addresses: z.string().describe("Comma-separated token addresses")
  }),
  func: async ({ network, addresses }) => {
    const data = await geckoterminalFetch(`/simple/networks/${network}/token_price/${addresses}`)
    return JSON.stringify(data)
  }
})

export const getDexesOnNetworkTool = new DynamicStructuredTool({
  name: "getDexesOnNetwork",
  description: "Get list of decentralized exchanges (DEXs) available on a specific network.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ network, page = 1 }) => {
    const data = await geckoterminalFetch(`/networks/${network}/dexes`, { page })
    return JSON.stringify(data)
  }
})

export const getTrendingPoolsTool = new DynamicStructuredTool({
  name: "getTrendingPools",
  description: "Get trending pools across all networks or on a specific network. Great for discovering hot trading pairs.",
  schema: z.object({
    network: z.string().optional().describe("Network identifier (e.g., 'eth', 'solana'). If not specified, returns trending across all networks"),
    include: z.string().optional().describe("Additional data to include (e.g., 'base_token,quote_token')")
  }),
  func: async ({ network, include }) => {
    const endpoint = network ? `/networks/${network}/trending_pools` : '/trending_pools'
    const params: any = {}
    if (include) params.include = include
    
    const data = await geckoterminalFetch(endpoint, params)
    return JSON.stringify(data)
  }
})

export const getMultiplePoolDetailsTool = new DynamicStructuredTool({
  name: "getMultiplePoolDetails",
  description: "Get details for multiple pools at once. Efficient way to compare multiple trading pairs.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    addresses: z.string().describe("Comma-separated pool addresses (max 30)")
  }),
  func: async ({ network, addresses }) => {
    const data = await geckoterminalFetch(`/networks/${network}/pools/multi/${addresses}`)
    return JSON.stringify(data)
  }
})

export const getTopPoolsOnNetworkTool = new DynamicStructuredTool({
  name: "getTopPoolsOnNetwork",
  description: "Get top pools by volume or other metrics on a specific network.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ network, page = 1 }) => {
    const data = await geckoterminalFetch(`/networks/${network}/pools`, { page })
    return JSON.stringify(data)
  }
})

export const getTopPoolsOnDexTool = new DynamicStructuredTool({
  name: "getTopPoolsOnDex",
  description: "Get top pools on a specific DEX (decentralized exchange).",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    dex: z.string().describe("DEX identifier (e.g., 'uniswap_v3', 'sushiswap')"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ network, dex, page = 1 }) => {
    const data = await geckoterminalFetch(`/networks/${network}/dexes/${dex}/pools`, { page })
    return JSON.stringify(data)
  }
})

export const getNewPoolsTool = new DynamicStructuredTool({
  name: "getNewPools",
  description: "Get recently created pools on a network. Useful for finding new trading opportunities.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ network, page = 1 }) => {
    const data = await geckoterminalFetch(`/networks/${network}/new_pools`, { page })
    return JSON.stringify(data)
  }
})

export const getTopPoolsForTokenTool = new DynamicStructuredTool({
  name: "getTopPoolsForToken",
  description: "Get top pools for a specific token address. Shows where a token is most actively traded.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    tokenAddress: z.string().describe("Token contract address"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ network, tokenAddress, page = 1 }) => {
    const data = await geckoterminalFetch(`/networks/${network}/tokens/${tokenAddress}/pools`, { page })
    return JSON.stringify(data)
  }
})

export const getTokenDetailsTool = new DynamicStructuredTool({
  name: "getTokenDetails",
  description: "Get detailed information about a specific token including market data and metadata.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    tokenAddress: z.string().describe("Token contract address")
  }),
  func: async ({ network, tokenAddress }) => {
    const data = await geckoterminalFetch(`/networks/${network}/tokens/${tokenAddress}`)
    return JSON.stringify(data)
  }
})

export const getMultipleTokenDetailsTool = new DynamicStructuredTool({
  name: "getMultipleTokenDetails",
  description: "Get details for multiple tokens at once. Efficient for comparing multiple tokens.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    addresses: z.string().describe("Comma-separated token addresses (max 30)")
  }),
  func: async ({ network, addresses }) => {
    const data = await geckoterminalFetch(`/networks/${network}/tokens/multi/${addresses}`)
    return JSON.stringify(data)
  }
})

export const getTokenInfoTool = new DynamicStructuredTool({
  name: "getTokenInfo",
  description: "Get basic information about a token including name, symbol, and decimals.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    tokenAddress: z.string().describe("Token contract address")
  }),
  func: async ({ network, tokenAddress }) => {
    const data = await geckoterminalFetch(`/networks/${network}/tokens/${tokenAddress}/info`)
    return JSON.stringify(data)
  }
})

export const getPoolTokenInfoTool = new DynamicStructuredTool({
  name: "getPoolTokenInfo",
  description: "Get token information for tokens in a specific pool.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    poolAddress: z.string().describe("Pool contract address")
  }),
  func: async ({ network, poolAddress }) => {
    const data = await geckoterminalFetch(`/networks/${network}/pools/${poolAddress}/info`)
    return JSON.stringify(data)
  }
})

export const getRecentlyUpdatedTokenInfoTool = new DynamicStructuredTool({
  name: "getRecentlyUpdatedTokenInfo",
  description: "Get information about tokens that were recently updated on a network.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ network, page = 1 }) => {
    const data = await geckoterminalFetch(`/networks/${network}/tokens/info`, { page })
    return JSON.stringify(data)
  }
})

export const getPoolTradesTool = new DynamicStructuredTool({
  name: "getPoolTrades",
  description: "Get recent trades for a specific pool. Shows trading activity and price movements.",
  schema: z.object({
    network: z.string().describe("Network identifier (e.g., 'eth', 'solana')"),
    poolAddress: z.string().describe("Pool contract address"),
    page: z.number().optional().describe("Page number (default: 1)")
  }),
  func: async ({ network, poolAddress, page = 1 }) => {
    const data = await geckoterminalFetch(`/networks/${network}/pools/${poolAddress}/trades`, { page })
    return JSON.stringify(data)
  }
})