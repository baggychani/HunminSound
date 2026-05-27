import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import type { ResearchContent } from '@/lib/research-content'
import { readResearchContent, writeResearchContent } from '@/lib/cms-storage'

export const runtime = 'nodejs'

function cmsErrorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : '저장 실패'
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
    return NextResponse.json(await readResearchContent())
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
    return NextResponse.json({ ok: true })
  } catch (err) {
    return cmsErrorResponse(err)
  }
}
