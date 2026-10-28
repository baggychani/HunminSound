import { NextRequest, NextResponse } from 'next/server'
import { readOverridesStore, saveText } from '@/lib/cms-storage'
import { cmsUser, cmsError, noStore } from '@/lib/cms-api'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET() {
  if (!(await cmsUser())) return NextResponse.json({}, { status: 401 })
  try { return NextResponse.json(await readOverridesStore(), { headers: noStore }) }
  catch (e) { return cmsError(e) }
}
export async function PATCH(req: NextRequest) {
  const user = await cmsUser()
  if (!user) return NextResponse.json({}, { status: 401 })
  let body
  try { body = await req.json() } catch { return NextResponse.json({}, { status: 400 }) }
  if (!body || typeof body.key !== 'string' || body.key.length > 200 ||
      !(body.expectedVersion === null || typeof body.expectedVersion === 'string') ||
      (body.remove !== undefined && typeof body.remove !== 'boolean') ||
      (body.staleDismissed !== undefined && typeof body.staleDismissed !== 'boolean') ||
      (body.displayName !== undefined && (typeof body.displayName !== 'string' || body.displayName.length > 300)) ||
      (!body.remove && !body.staleDismissed && (typeof body.value !== 'string' || body.value.length > 20000 ||
        typeof body.sourceSnapshot !== 'string' || body.sourceSnapshot.length > 20000))) {
    return NextResponse.json({ message: '저장할 내용이 올바르지 않습니다.' }, { status: 400 })
  }
  try { return NextResponse.json({ ok: true, store: await saveText(body, user) }, { headers: noStore }) }
  catch (e) { return cmsError(e) }
}
