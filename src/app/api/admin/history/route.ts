import { NextResponse } from 'next/server'
import { currentCodeConflicts, readCmsState, readCodeOutbox, restoreCmsEntry } from '@/lib/cms-storage'
import { cmsUser, cmsError, noStore } from '@/lib/cms-api'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET() {
  if (!(await cmsUser())) return NextResponse.json({}, { status: 401 })
  try {
    const [state, outbox] = await Promise.all([readCmsState(), readCodeOutbox()])
    const codeOutbox = outbox.map(({ key, label, username, at, status, error }) => ({ key, label, username, at, status, error }))
    return NextResponse.json({ history: state.history, revision: state.revision, conflicts: currentCodeConflicts(state), codeOutbox }, { headers: noStore })
  } catch (e) { return cmsError(e) }
}
export async function POST(req: Request) {
  const user = await cmsUser()
  if (!user) return NextResponse.json({}, { status: 401 })
  let body
  try { body = await req.json() } catch { return NextResponse.json({}, { status: 400 }) }
  if (!body || typeof body.id !== 'string' || typeof body.revision !== 'string') return NextResponse.json({}, { status: 400 })
  try {
    await restoreCmsEntry(body.id, body.revision, user)
    return NextResponse.json({ ok: true }, { headers: noStore })
  } catch (e) { return cmsError(e) }
}
