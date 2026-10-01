import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import type { ResearchContent } from '@/lib/research-content'
import { validateResearchContent } from '@/lib/research-content'
import { readResearchContentForAdmin, writeResearchContent } from '@/lib/cms-storage'
import { GithubConflictError } from '@/lib/githubContent'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function cmsErrorResponse(err: unknown) {
  if (err instanceof GithubConflictError) {
    return NextResponse.json(
      {
        error: 'conflict',
        message:
          '그 사이 다른 곳(코드 수정 또는 다른 관리자)에서 연구 소개가 바뀌었습니다. ' +
          '지금 편집한 내용을 따로 복사해 두고, 새로고침한 뒤 다시 저장해 주세요.',
      },
      { status: 409 },
    )
  }
  const message = err instanceof Error ? err.message : '저장 실패'
  if (message.includes('GITHUB_NOT_CONFIGURED')) {
    return NextResponse.json(
      {
        error: 'storage_not_configured',
        message: '저장 설정(GITHUB_CONTENT_TOKEN)이 되어 있지 않습니다. 개발자에게 문의해 주세요.',
      },
      { status: 503 },
    )
  }
  console.error('[cms] research write failed:', err)
  return NextResponse.json({ error: 'write_failed', message: '저장에 실패했습니다.' }, { status: 500 })
}

async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(getAdminSessionSecret(), token)
}

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json(await readResearchContentForAdmin(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[cms] research read failed:', err)
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await req.json()) as { data: ResearchContent; sha: string | null }
    const valid = validateResearchContent(body.data)
    if (valid !== true) {
      return NextResponse.json(
        { error: 'invalid_data', message: `저장할 내용의 모양이 올바르지 않습니다(${valid}).` },
        { status: 400 },
      )
    }
    const sha = await writeResearchContent(body.data, body.sha, session)
    return NextResponse.json({ ok: true, sha })
  } catch (err) {
    return cmsErrorResponse(err)
  }
}
