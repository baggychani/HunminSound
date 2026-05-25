import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sendContactEmail } from '@/lib/sendContactEmail'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'

export const runtime = 'nodejs'

async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  return !!(await verifyAdminSessionToken(getAdminSessionSecret(), token))
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const replyTo = (formData.get('email') as string | null)?.trim() ?? ''
  const subject = (formData.get('subject') as string | null)?.trim() ?? '(제목 없음)'
  const body = (formData.get('body') as string | null)?.trim() ?? ''

  try {
    await sendContactEmail({
      name,
      replyTo,
      subject,
      body,
      prefix: '[세종말소리 관리자 문의]',
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact/admin]', err)
    const message = err instanceof Error ? err.message : String(err)
    if (message === 'SMTP_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'SMTP_NOT_CONFIGURED' }, { status: 503 })
    }
    return NextResponse.json({ error: 'SEND_FAILED' }, { status: 500 })
  }
}
