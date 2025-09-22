import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  try {
    const base = (process.env.NEXT_PUBLIC_CHAT_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3002').replace(/\/$/, '')

    const [hl, pm] = await Promise.allSettled([
      fetch(`${base}/api/hyperliquid/sync`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`${base}/api/polymarket/sync`, { cache: 'no-store' }).then(r => r.json()),
    ])

    return NextResponse.json({
      success: true,
      hyperliquid: hl.status === 'fulfilled' ? hl.value : { error: (hl as any).reason?.message },
      polymarket: pm.status === 'fulfilled' ? pm.value : { error: (pm as any).reason?.message },
      timestamp: new Date().toISOString()
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'preload failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) { return GET(req) }

