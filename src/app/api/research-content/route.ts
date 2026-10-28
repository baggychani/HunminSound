import { NextResponse } from 'next/server'
import { readResearchContent } from '@/lib/cms-storage'
import { noStore, cmsError } from '@/lib/cms-api'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
/** 공개 /research 페이지와 같은 내용. 코드 쪽에서 현재 글을 받아 갈 때 쓴다. */
export async function GET() {
  try { return NextResponse.json(await readResearchContent(), { headers: noStore }) }
  catch (e) { return cmsError(e) }
}
