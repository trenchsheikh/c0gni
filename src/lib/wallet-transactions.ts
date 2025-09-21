import { useWallet } from './wallet'
import { parseUnits, formatUnits, type Address } from 'viem'
import { polygon } from 'viem/chains'
import { hyperliquid } from './wallet'

// Transaction types
export interface TransactionRequest {
  to: Address
  value?: bigint
  data?: `0x${string}`
  gas?: bigint
  gasPrice?: bigint
}

export interface PolymarketTradeParams {
  marketId: string
  side: 'buy' | 'sell'
  amount: string // Amount in USDC
  price: string  // Price per share
  outcomeIndex: number // 0 for No, 1 for Yes
}

export interface HyperliquidTradeParams {
  symbol: string
  side: 'buy' | 'sell'
  amount: string // Amount in base units
  price?: string // Limit price (optional for market orders)
  orderType: 'market' | 'limit'
  leverage?: number
}

// USDC contract addresses
const USDC_CONTRACTS = {
  [polygon.id]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' as Address,
  [hyperliquid.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address, // Placeholder
}

// Polymarket contract addresses (mainnet)
const POLYMARKET_CONTRACTS = {
  CTF_EXCHANGE: '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E' as Address,
  CONDITIONAL_TOKENS: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045' as Address,
}

export function useWalletTransactions() {
  const {
    address,
    chainId,
    isOnPolygon,
    isOnHyperliquid,
    signTransaction,
    switchToPolygon,
    switchToHyperliquid,
    walletClient,
  } = useWallet()

  // Get USDC contract address for current chain
  const getUSDCContract = () => {
    if (!chainId || !USDC_CONTRACTS[chainId]) {
      throw new Error('USDC not supported on current chain')
    }
    return USDC_CONTRACTS[chainId]
  }

  // Check USDC balance
  const checkUSDCBalance = async (): Promise<string> => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      const usdcContract = getUSDCContract()

      // ABI for USDC balanceOf function
      const balanceOfABI = [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: 'balance', type: 'uint256' }],
        },
      ] as const

      const balance = await walletClient.readContract({
        address: usdcContract,
        abi: balanceOfABI,
        functionName: 'balanceOf',
        args: [address],
      })

      return formatUnits(balance, 6) // USDC has 6 decimals
    } catch (error) {
      console.error('Failed to check USDC balance:', error)
      throw error
    }
  }

  // Approve USDC spending
  const approveUSDC = async (spender: Address, amount: string): Promise<string> => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      const usdcContract = getUSDCContract()
      const amountBN = parseUnits(amount, 6)

      // ABI for USDC approve function
      const approveABI = [
        {
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: 'success', type: 'bool' }],
        },
      ] as const

      const hash = await walletClient.writeContract({
        address: usdcContract,
        abi: approveABI,
        functionName: 'approve',
        args: [spender, amountBN],
      })

      return hash
    } catch (error) {
      console.error('Failed to approve USDC:', error)
      throw error
    }
  }

  // Execute Polymarket trade
  const executePolymarketTrade = async (params: PolymarketTradeParams): Promise<string> => {
    if (!isOnPolygon) {
      await switchToPolygon()
    }

    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      // First check USDC balance
      const balance = await checkUSDCBalance()
      const requiredAmount = (parseFloat(params.amount) * parseFloat(params.price)).toString()

      if (parseFloat(balance) < parseFloat(requiredAmount)) {
        throw new Error(`Insufficient USDC balance. Required: ${requiredAmount}, Available: ${balance}`)
      }

      // Approve USDC spending if needed
      await approveUSDC(POLYMARKET_CONTRACTS.CTF_EXCHANGE, requiredAmount)

      // This is a simplified example - in practice, you'd need to:
      // 1. Get the condition ID for the market
      // 2. Calculate the exact trade parameters
      // 3. Call the appropriate CTF Exchange function

      // For now, we'll return a placeholder
      console.log('Polymarket trade parameters:', params)
      throw new Error('Polymarket trading not yet implemented - requires market-specific condition IDs')

    } catch (error) {
      console.error('Failed to execute Polymarket trade:', error)
      throw error
    }
  }

  // Execute Hyperliquid trade
  const executeHyperliquidTrade = async (params: HyperliquidTradeParams): Promise<string> => {
    if (!isOnHyperliquid) {
      await switchToHyperliquid()
    }

    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      // Check USDC balance for collateral
      const balance = await checkUSDCBalance()
      const requiredCollateral = parseFloat(params.amount) / (params.leverage || 1)

      if (parseFloat(balance) < requiredCollateral) {
        throw new Error(`Insufficient USDC for collateral. Required: ${requiredCollateral}, Available: ${balance}`)
      }

      // This is a simplified example - in practice, you'd need to:
      // 1. Use the Hyperliquid API to place the order
      // 2. Sign the order with the wallet
      // 3. Submit to Hyperliquid's matching engine

      console.log('Hyperliquid trade parameters:', params)
      throw new Error('Hyperliquid trading not yet implemented - requires API integration')

    } catch (error) {
      console.error('Failed to execute Hyperliquid trade:', error)
      throw error
    }
  }

  // Generic transaction execution
  const executeTransaction = async (tx: TransactionRequest): Promise<string> => {
    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    try {
      const hash = await walletClient.sendTransaction({
        to: tx.to,
        value: tx.value || 0n,
        data: tx.data,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
      })

      return hash
    } catch (error) {
      console.error('Failed to execute transaction:', error)
      throw error
    }
  }

  // Get transaction status
  const getTransactionStatus = async (hash: string) => {
    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    try {
      const receipt = await walletClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
      })

      return {
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        effectiveGasPrice: receipt.effectiveGasPrice,
      }
    } catch (error) {
      console.error('Failed to get transaction status:', error)
      throw error
    }
  }

  return {
    // State
    address,
    chainId,
    isOnPolygon,
    isOnHyperliquid,

    // Balance checks
    checkUSDCBalance,

    // Trading functions
    executePolymarketTrade,
    executeHyperliquidTrade,

    // Generic transaction functions
    executeTransaction,
    getTransactionStatus,
    approveUSDC,

    // Chain switching
    switchToPolygon,
    switchToHyperliquid,
  }
}