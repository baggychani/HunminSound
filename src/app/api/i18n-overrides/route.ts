import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { OverridesStore } from '@/lib/i18n-overrides'

export const runtime = 'nodejs'

const OVERRIDES_PATH = path.join(process.cwd(), 'src', 'data', 'i18n-overrides.json')

function readStore(): OverridesStore {
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8')) as OverridesStore
  } catch {
    return {}
  }
}

/** 공개 사이트 — i18n 오버라이드 읽기 전용 */
export async function GET() {
  return NextResponse.json(readStore(), {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
  })
}
