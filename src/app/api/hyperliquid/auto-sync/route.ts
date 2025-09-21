import { NextRequest, NextResponse } from 'next/server'
import { getLastUpdate } from '@/lib/redis'

// Auto-sync endpoint that only syncs if data is stale
export async function GET(req: NextRequest) {
  try {
    // Check if data is stale (older than 4 minutes)
    const lastUpdate = await getLastUpdate()
    const now = Date.now()
    const STALE_THRESHOLD = 4 * 60 * 1000 // 4 minutes

    let shouldSync = true
    if (lastUpdate) {
      const timeSinceUpdate = now - Number(lastUpdate)
      shouldSync = timeSinceUpdate > STALE_THRESHOLD
    }

    if (!shouldSync) {
      return NextResponse.json({
        success: true,
        message: 'Data is fresh, no sync needed',
        lastUpdate: lastUpdate ? new Date(Number(lastUpdate)).toISOString() : null,
        nextSyncIn: lastUpdate ? Math.max(0, STALE_THRESHOLD - (now - Number(lastUpdate))) : 0
      })
    }

    // Trigger sync by calling the sync endpoint
    const syncUrl = new URL('/api/hyperliquid/sync', req.url)
    const syncResponse = await fetch(syncUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!syncResponse.ok) {
      throw new Error(`Sync failed: ${syncResponse.status}`)
    }

    const syncResult = await syncResponse.json()

    return NextResponse.json({
      success: true,
      message: 'Auto-sync completed',
      syncResult,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Auto-sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Auto-sync failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}