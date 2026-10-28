import { NextResponse } from 'next/server'
import { readResearchContent, readResearchContentForAdmin, restoreResearchBaseline, writeResearchContent } from '@/lib/cms-storage'
import { validateResearchContent } from '@/lib/research-content'
import { cmsUser, cmsError, noStore } from '@/lib/cms-api'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET() {
  if (!(await cmsUser())) return NextResponse.json({}, { status: 401 })
  try { return NextResponse.json(await readResearchContentForAdmin(), { headers: noStore }) }
  catch (e) { return cmsError(e) }
}
export async function PUT(req: Request) {
  const user = await cmsUser()
  if (!user) return NextResponse.json({}, { status: 401 })
  let body
  try { body = await req.json() } catch { return NextResponse.json({}, { status: 400 }) }
  if (!body || typeof body.sha !== 'string') {
    return NextResponse.json({ message: '저장할 내용이 올바르지 않습니다.' }, { status: 400 })
  }
  try {
    if (body.baseline === true) {
      const sha = await restoreResearchBaseline(body.sha, user)
      return NextResponse.json({ ok: true, sha, data: await readResearchContent() }, { headers: noStore })
    }
    if (validateResearchContent(body.data) !== true) {
      return NextResponse.json({ message: '저장할 내용이 올바르지 않습니다.' }, { status: 400 })
    }
    const sha = await writeResearchContent(body.data, body.sha, user)
    return NextResponse.json({ ok: true, sha, data: body.data }, { headers: noStore })
  } catch (e) { return cmsError(e) }
}
