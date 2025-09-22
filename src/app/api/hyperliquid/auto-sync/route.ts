import { NextRequest, NextResponse } from 'next/server'
import { getLastUpdate } from '@/lib/redis'

const STALE_MS = 60_000 // 1 minute

export async function GET(_req: NextRequest) {
  try {
    const last = await getLastUpdate()
    const lastMs = last ? Number(last) : 0
    const now = Date.now()
    const stale = !lastMs || (now - lastMs > STALE_MS)

    if (stale) {
      const base = (process.env.NEXT_PUBLIC_CHAT_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3002').replace(/\/$/, '')
      // fire-and-forget sync; don't block
      fetch(`${base}/api/hyperliquid/sync`, { cache: 'no-store' }).catch(() => {})
    }

    return NextResponse.json({ ok: true, stale, lastUpdate: lastMs || null })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'auto-sync failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) { return GET(req) }

