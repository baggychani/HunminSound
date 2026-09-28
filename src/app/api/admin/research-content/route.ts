import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import type { ResearchContent } from '@/lib/research-content'
import { readResearchContent, writeResearchContent } from '@/lib/cms-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function cmsErrorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : '저장 실패'
  if (message.includes('RESEARCH_CONTENT_IS_CODE')) {
    return NextResponse.json(
      {
        error: 'research_content_is_code',
        message: '연구 소개 관리자 저장은 점검 중입니다(10월 중 재개). 수정이 필요하면 개발자에게 요청해 주세요.',
      },
      { status: 409 },
    )
  }
  if (message.includes('CMS_CLOUD_STORAGE_REQUIRED')) {
    return NextResponse.json(
      {
        error: 'storage_not_configured',
        message:
          'Vercel 프로덕션에서 CMS 저장하려면 Upstash Redis 연동이 필요합니다. ' +
          'Vercel 대시보드 → Storage → Upstash Redis를 이 프로젝트에 연결한 뒤 재배포하세요.',
      },
      { status: 503 },
    )
  }
  console.error('[cms] research write failed:', err)
  return NextResponse.json({ error: 'write_failed', message: '저장에 실패했습니다.' }, { status: 500 })
}

export async function GET() {
  try {
    return NextResponse.json(await readResearchContent(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifyAdminSessionToken(getAdminSessionSecret(), token)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await req.json()) as ResearchContent
    await writeResearchContent(body)
    revalidatePath('/research')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return cmsErrorResponse(err)
  }
}
