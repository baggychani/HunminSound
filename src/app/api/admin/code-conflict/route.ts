import { NextResponse } from 'next/server'
import { resolveCodeConflict } from '@/lib/cms-storage'
import { cmsUser, cmsError, noStore } from '@/lib/cms-api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const user = await cmsUser()
  if (!user) return NextResponse.json({}, { status: 401 })
  let body: { kind?: string; key?: string; choice?: string; revision?: string }
  try { body = await req.json() } catch { return NextResponse.json({}, { status: 400 }) }
  if ((body.kind !== 'text' && body.kind !== 'research') || (body.choice !== 'code' && body.choice !== 'keep') || typeof body.revision !== 'string') {
    return NextResponse.json({ message: '어느 글을 현재 글로 둘지 확인할 수 없습니다.' }, { status: 400 })
  }
  try {
    await resolveCodeConflict({ kind: body.kind, key: body.key, choice: body.choice }, body.revision, user)
    return NextResponse.json({ ok: true }, { headers: noStore })
  } catch (error) {
    if (error instanceof Error && error.message === 'CMS_INVALID_CONFLICT') {
      return NextResponse.json({ message: '이미 선택이 끝났거나 고를 문장이 없습니다. 수정 내역을 다시 열어 주세요.' }, { status: 409 })
    }
    return cmsError(error)
  }
}
