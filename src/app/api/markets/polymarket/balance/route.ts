import { NextRequest } from 'next/server'

// Simulate getting user's USDC balance
const getUserBalance = async (walletAddress: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

  // Generate a consistent balance based on wallet address
  const addressHash = walletAddress.slice(2).toLowerCase()
  const hashNumber = parseInt(addressHash.slice(0, 8), 16)
  const baseBalance = 5000 + (hashNumber % 20000) // Consistent balance between 5K-25K USDC
  const balance = Math.floor(baseBalance * 100) / 100 // Round to 2 decimal places

  return {
    success: true,
    balance: {
      USDC: balance,
      token: '0xa0b86a33e6441c8c0de1a0b0ce3b9a5b67ba1b9', // USDC on Polygon
      decimals: 6
    },
    network: 'polygon',
    timestamp: new Date().toISOString()
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('address')

    if (!walletAddress) {
      return Response.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return Response.json({ error: 'Invalid wallet address format' }, { status: 400 })
    }

    // Get balance using Python service
    const balanceResult = await getUserBalance(walletAddress)

    if (!balanceResult.success) {
      return Response.json({
        error: balanceResult.error || 'Failed to get balance',
        details: balanceResult.details
      }, { status: 500 })
    }

    return Response.json({
      success: true,
      address: walletAddress,
      balance: balanceResult.balance,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Balance check error:', error)
    return Response.json({
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}