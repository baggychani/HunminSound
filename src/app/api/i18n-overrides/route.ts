import { NextResponse } from 'next/server'
import { readOverridesStore } from '@/lib/cms-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 공개 사이트 — i18n 오버라이드 읽기 전용 */
export async function GET() {
  const store = await readOverridesStore()
  return NextResponse.json(store, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
