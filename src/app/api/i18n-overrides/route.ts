import { NextResponse } from 'next/server'
import { readOverridesStore } from '@/lib/cms-storage'
import { noStore, cmsError } from '@/lib/cms-api'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
/** 공개 조회는 콘텐츠를 수정하지 않는다. */
export async function GET() {
  try { return NextResponse.json(await readOverridesStore(), { headers: noStore }) }
  catch (e) { return cmsError(e) }
}
