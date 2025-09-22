import { NextResponse } from 'next/server'
import { ethers } from 'ethers'

// Common token addresses across different chains
const TOKEN_ADDRESSES = {
  // Ethereum Mainnet
  1: {
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USD Coin
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7', // Tether USD
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f'   // MakerDAO DAI
  },
  // Polygon
  137: {
    USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USD Coin (PoS)
    USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // Tether USD (PoS)
    DAI: '0x8f3cf7ad23cd3cadbD9735aff958023239c6a063'   // Dai Stablecoin (PoS)
  },
  // Base
  8453: {
    USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USD Coin
    DAI: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb'   // Dai Stablecoin
  }
}

// RPC endpoints for different chains - using free public endpoints with fallbacks
const RPC_URLS = {
  1: process.env.ETHEREUM_RPC_URL || 'https://ethereum.publicnode.com',
  137: process.env.POLYGON_RPC_URL || 'https://polygon.drpc.org',
  8453: process.env.BASE_RPC_URL || 'https://base.drpc.org'
}

// Fallback RPC URLs if primary ones fail
const FALLBACK_RPC_URLS = {
  1: ['https://eth.llamarpc.com', 'https://rpc.flashbots.net', 'https://virginia.rpc.blxrbdn.com'],
  137: ['https://polygon.llamarpc.com', 'https://polygon.drpc.org', 'https://rpc.ankr.com/polygon'],
  8453: ['https://base.llamarpc.com', 'https://base.drpc.org', 'https://mainnet.base.org']
}

// ERC20 ABI for balance checking
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
]

interface TokenBalance {
  symbol: string;
  balance: string;
  address: string;
  decimals: number;
  raw: string;
}

interface WalletBalance {
  chainId: number;
  chainName: string;
  native: {
    symbol: string;
    balance: string;
    raw: string;
  };
  tokens: TokenBalance[];
  totalUsdValue?: number;
}

async function getChainBalance(address: string, chainId: number): Promise<WalletBalance | null> {
  const primaryUrl = RPC_URLS[chainId as keyof typeof RPC_URLS]
  const fallbackUrls = FALLBACK_RPC_URLS[chainId as keyof typeof FALLBACK_RPC_URLS] || []
  const allUrls = [primaryUrl, ...fallbackUrls].filter(Boolean)

  let provider: ethers.JsonRpcProvider | null = null

  // Try primary and fallback URLs until one works
  for (const rpcUrl of allUrls) {
    try {
      provider = new ethers.JsonRpcProvider(rpcUrl, chainId, {
        staticNetwork: true,
        timeout: 8000
      })

      // Test provider connection
      await provider.getNetwork()
      console.log(`Connected to chain ${chainId} via ${rpcUrl}`)
      break
    } catch (error) {
      console.warn(`Failed to connect to ${rpcUrl} for chain ${chainId}:`, error)
      provider = null
      continue
    }
  }

  if (!provider) {
    console.error(`All RPC endpoints failed for chain ${chainId}`)
    return null
  }

  try {

    const tokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || {}

    // Get native balance
    const nativeBalance = await provider.getBalance(address)
    const nativeDecimals = 18
    const nativeFormatted = ethers.formatUnits(nativeBalance, nativeDecimals)

    // Determine chain name and native symbol
    const chainInfo = {
      1: { name: 'Ethereum', symbol: 'ETH' },
      137: { name: 'Polygon', symbol: 'MATIC' },
      8453: { name: 'Base', symbol: 'ETH' }
    }[chainId] || { name: 'Unknown', symbol: 'ETH' }

    // Get token balances
    const tokenBalances: TokenBalance[] = []

    for (const [symbol, tokenAddress] of Object.entries(tokens)) {
      try {
        // Ensure token address is properly checksummed - handle potential errors
        let checksummedAddress: string
        try {
          checksummedAddress = ethers.getAddress(tokenAddress.toLowerCase())
        } catch (checksumError) {
          console.warn(`Invalid token address for ${symbol} on chain ${chainId}: ${tokenAddress}`)
          continue // Skip this token if address is invalid
        }

        const contract = new ethers.Contract(checksummedAddress, ERC20_ABI, provider)

        // Add timeout for individual token calls
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Token call timeout')), 5000)
        )

        const [balance, decimals] = await Promise.race([
          Promise.all([
            contract.balanceOf(address),
            contract.decimals()
          ]),
          timeoutPromise
        ]) as [bigint, number]

        const formatted = ethers.formatUnits(balance, decimals)

        // Only include tokens with non-zero balance
        if (parseFloat(formatted) > 0) {
          tokenBalances.push({
            symbol,
            balance: parseFloat(formatted).toFixed(6),
            address: checksummedAddress,
            decimals: Number(decimals),
            raw: balance.toString()
          })
        }
      } catch (error) {
        console.warn(`Failed to fetch ${symbol} balance on chain ${chainId}:`, error)
      }
    }

    return {
      chainId,
      chainName: chainInfo.name,
      native: {
        symbol: chainInfo.symbol,
        balance: parseFloat(nativeFormatted).toFixed(6),
        raw: nativeBalance.toString()
      },
      tokens: tokenBalances
    }
  } catch (error) {
    console.error(`Failed to fetch balance for chain ${chainId}:`, error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const chainIdParam = searchParams.get('chainId')

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }

    // If chainId is specified, fetch balance for that chain only
    if (chainIdParam) {
      const chainId = parseInt(chainIdParam)
      if (![1, 137, 8453].includes(chainId)) {
        return NextResponse.json(
          { error: 'Unsupported chain ID. Supported: 1 (Ethereum), 137 (Polygon), 8453 (Base)' },
          { status: 400 }
        )
      }

      const balance = await getChainBalance(address, chainId)
      if (!balance) {
        return NextResponse.json(
          { error: 'Failed to fetch balance for the specified chain' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        address,
        ...balance
      })
    }

    // Fetch balances from all supported chains with timeout
    const chainIds = [1, 137, 8453] // Ethereum, Polygon, Base
    const balancePromises = chainIds.map(async (chainId) => {
      try {
        // Add timeout for each chain
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 15000) // 15 second timeout per chain
        )

        return await Promise.race([
          getChainBalance(address, chainId),
          timeoutPromise
        ])
      } catch (error) {
        console.warn(`Chain ${chainId} failed:`, error)
        return null
      }
    })

    const balances = await Promise.all(balancePromises)

    // Filter out failed requests
    const validBalances = balances.filter(Boolean) as WalletBalance[]

    if (validBalances.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch balances from any supported chain' },
        { status: 500 }
      )
    }

    // Calculate total portfolio value (simplified - would need price feeds for accurate USD values)
    const allTokens = validBalances.flatMap(b => b.tokens)
    const totalTokens = allTokens.length
    const hasPositiveBalance = validBalances.some(b =>
      parseFloat(b.native.balance) > 0 || b.tokens.length > 0
    )

    return NextResponse.json({
      success: true,
      address,
      chains: validBalances,
      summary: {
        totalChains: validBalances.length,
        totalTokenTypes: totalTokens,
        hasPositiveBalance,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet balance' },
      { status: 500 }
    )
  }
}
