import { NextResponse } from 'next/server'
import { flushCodeOutbox } from '@/lib/cms-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 매일 09:00 KST. Vercel cron은 UTC라 0 0 * * * 이다. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  try {
    await flushCodeOutbox()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[cms] daily code sync failed:', error)
    return NextResponse.json({ ok: false }, { status: 503 })
  }
}
