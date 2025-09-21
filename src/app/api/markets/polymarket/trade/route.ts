import { NextRequest } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Trade request interface
interface TradeRequest {
  marketId: string
  tokenId: string  // Specific token ID for YES/NO outcome
  side: 'YES' | 'NO'
  action: 'buy' | 'sell'
  orderType: 'market' | 'limit'
  price: number    // Price per share (0.01 to 0.99)
  size: number     // Number of shares
  walletAddress: string
  signature?: string  // Wallet signature for the order
}

// Polymarket trading simulation with database persistence
const executePolymarketTrade = async (request: TradeRequest, userId: string): Promise<any> => {
  // Simulate processing delay for realism
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

  // Calculate trade details
  const totalCost = request.size * request.price
  const orderId = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Simulate order execution with realistic fill behavior
  const fillPrice = request.orderType === 'market'
    ? request.price + (Math.random() - 0.5) * 0.005 // Small slippage for market orders
    : request.price

  const filledSize = request.size // Assume full fill for simplicity
  const actualCost = filledSize * fillPrice

  // Save order to database
  const order = await prisma.polymarketOrder.create({
    data: {
      userId,
      orderId,
      marketId: request.marketId,
      tokenId: request.tokenId,
      side: request.side,
      action: request.action,
      orderType: request.orderType,
      price: request.price,
      size: request.size,
      filledSize,
      avgFillPrice: fillPrice,
      totalCost: actualCost,
      status: 'filled',
      signature: request.signature,
      walletAddress: request.walletAddress,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Simulate tx hash
      blockNumber: Math.floor(Math.random() * 1000000) + 50000000,
      gasUsed: Math.floor(Math.random() * 100000) + 21000,
      gasFee: Math.random() * 0.01 + 0.001
    }
  })

  return {
    success: true,
    orderId: order.orderId,
    transactionHash: order.transactionHash,
    blockNumber: order.blockNumber,
    gasUsed: order.gasUsed,
    gasFee: order.gasFee,
    filledSize: order.filledSize,
    avgFillPrice: order.avgFillPrice,
    totalCost: order.totalCost,
    status: order.status,
    timestamp: order.createdAt.toISOString()
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get session for user authentication
    const authUser = await authenticateUser(req)
    if (!authUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as TradeRequest

    // Validate required fields
    if (!body.marketId || !body.tokenId || !body.side || !body.action || !body.price || !body.size || !body.walletAddress) {
      return Response.json({
        error: 'Missing required fields: marketId, tokenId, side, action, price, size, walletAddress'
      }, { status: 400 })
    }

    // Validate trade parameters
    if (!['YES', 'NO'].includes(body.side)) {
      return Response.json({ error: 'Side must be YES or NO' }, { status: 400 })
    }

    if (!['buy', 'sell'].includes(body.action)) {
      return Response.json({ error: 'Action must be buy or sell' }, { status: 400 })
    }

    if (!['market', 'limit'].includes(body.orderType)) {
      return Response.json({ error: 'Order type must be market or limit' }, { status: 400 })
    }

    if (body.price < 0.01 || body.price > 0.99) {
      return Response.json({ error: 'Price must be between 0.01 and 0.99' }, { status: 400 })
    }

    if (body.size <= 0) {
      return Response.json({ error: 'Size must be positive' }, { status: 400 })
    }

    // Find or create user
    const user = await prisma.user.findFirst({
      where: { id: authUser.userId }
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's private key for trading (in production, this would be more secure)
    // For now, we'll require users to provide their private key or use a secure key management system
    const privateKey = process.env.USER_PRIVATE_KEY || body.privateKey

    if (!privateKey) {
      return Response.json({
        error: 'Private key required for trading. This is a demo - in production, use secure key management.'
      }, { status: 400 })
    }

    // Execute trade with database persistence
    const tradeResult = await executePolymarketTrade(body, authUser.userId)

    if (!tradeResult.success) {
      return Response.json({
        error: tradeResult.error || 'Trade execution failed',
        details: tradeResult.details
      }, { status: 500 })
    }

    // Create order record in database
    const order = await prisma.polymarketOrder.create({
      data: {
        userId: user.id,
        marketId: body.marketId,
        polymarketOrderId: tradeResult.order_id,
        clientOrderId: `client_${Date.now()}`,
        side: body.side,
        orderType: body.orderType,
        action: body.action,
        price: body.price,
        size: body.size,
        filledSize: tradeResult.filled_amount || 0,
        avgFillPrice: tradeResult.avg_price || body.price,
        status: tradeResult.status || 'submitted',
        fees: tradeResult.fees || 0,
        txHash: tradeResult.tx_hash,
        walletAddress: body.walletAddress,
        tokenId: body.tokenId,
        marketData: {
          timestamp: new Date().toISOString(),
          real_trade: true,
          condition_id: body.marketId
        }
      }
    })

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: user.id,
        platform: 'polymarket',
        type: body.action,
        status: 'completed',
        amount: body.size * body.price,
        fees: tradeResult.fees || 0,
        txHash: tradeResult.tx_hash,
        fromToken: 'USDC',
        toToken: `${body.marketId}-${body.side}`,
        fromAmount: body.action === 'buy' ? body.size * body.price : body.size,
        toAmount: body.action === 'buy' ? body.size : body.size * body.price,
        metadata: {
          marketId: body.marketId,
          side: body.side,
          price: body.price,
          orderId: tradeResult.order_id
        }
      }
    })

    return Response.json({
      success: true,
      orderId: tradeResult.order_id,
      status: tradeResult.status,
      filledSize: tradeResult.filled_amount || body.size,
      avgFillPrice: tradeResult.avg_price || body.price,
      fees: tradeResult.fees || 0,
      txHash: tradeResult.tx_hash,
      totalCost: (body.size * body.price) + (tradeResult.fees || 0),
      order: {
        id: order.id,
        marketId: body.marketId,
        side: body.side,
        action: body.action,
        price: body.price,
        size: body.size
      }
    })

  } catch (error: any) {
    console.error('Trade execution error:', error)
    return Response.json({
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

// Get user's orders
export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateUser(req)
    if (!authUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const marketId = searchParams.get('marketId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const user = await prisma.user.findFirst({
      where: { id: authUser.userId }
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const whereClause: any = { userId: user.id }
    if (marketId) whereClause.marketId = marketId
    if (status) whereClause.status = status

    const orders = await prisma.polymarketOrder.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        marketId: true,
        polymarketOrderId: true,
        side: true,
        orderType: true,
        action: true,
        price: true,
        size: true,
        filledSize: true,
        avgFillPrice: true,
        status: true,
        fees: true,
        txHash: true,
        tokenId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return Response.json({ orders })

  } catch (error: any) {
    console.error('Get orders error:', error)
    return Response.json({
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}