/**
 * POST /api/admin/contact
 *
 * 관리자 대시보드 문의 폼에서 실제 이메일을 발송합니다.
 * multipart/form-data 로 이름, 답장메일, 제목, 내용, 첨부파일(선택) 수신.
 *
 * 환경변수 (.env.local):
 *   SMTP_HOST   기본값 smtp.gmail.com
 *   SMTP_PORT   기본값 587
 *   SMTP_USER   발신 Gmail 주소 (예: yourname@gmail.com)
 *   SMTP_PASS   Gmail 앱 비밀번호 (16자리)
 *   CONTACT_TO  수신 주소, 기본값 baggychani@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import nodemailer from 'nodemailer'
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

  /* ── SMTP 설정 확인 ── */
  const smtpUser = process.env.SMTP_USER?.trim()
  const smtpPass = process.env.SMTP_PASS?.trim()
  if (!smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: 'SMTP_NOT_CONFIGURED', message: 'SMTP_USER 또는 SMTP_PASS 환경변수가 설정되지 않았습니다.' },
      { status: 503 },
    )
  }

  /* ── 폼 데이터 파싱 ── */
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const name    = (formData.get('name')    as string | null)?.trim() ?? ''
  const replyTo = (formData.get('email')   as string | null)?.trim() ?? ''
  const subject = (formData.get('subject') as string | null)?.trim() ?? '(제목 없음)'
  const body    = (formData.get('body')    as string | null)?.trim() ?? ''
  const files   = formData.getAll('attachments') as File[]

  /* ── 첨부 파일 버퍼 변환 ── */
  const attachments = await Promise.all(
    files
      .filter((f) => f.size > 0)
      .map(async (f) => ({
        filename: f.name,
        content: Buffer.from(await f.arrayBuffer()),
        contentType: f.type || 'application/octet-stream',
      })),
  )

  /* ── 트랜스포터 생성 ── */
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  })

  const to = process.env.CONTACT_TO ?? 'baggychani@gmail.com'

  try {
    await transporter.sendMail({
      from: `"세종말소리 관리자 문의" <${smtpUser}>`,
      to,
      replyTo: replyTo || undefined,
      subject: `[세종말소리 문의] ${subject}`,
      text: `보낸 분: ${name}\n답장 메일: ${replyTo}\n\n${body}`,
      html: `<p><strong>보낸 분:</strong> ${name}</p><p><strong>답장 메일:</strong> ${replyTo}</p><hr/><p style="white-space:pre-wrap">${body}</p>`,
      attachments,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] sendMail error:', err)
    return NextResponse.json({ error: 'SEND_FAILED', message: String(err) }, { status: 500 })
  }
}
