/**
 * /api/admin/i18n-overrides
 *
 * GET   → 전체 오버라이드 반환
 * PATCH → 단일 항목 저장·삭제·staleDismissed 처리 + 수정 내역 기록
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import type { TranslationOverride } from '@/lib/i18n-overrides'
import {
  makeHistoryEntry, parseOverrideKey, MAX_HISTORY,
  type HistoryEntry,
} from '@/lib/admin-history'
import {
  readOverridesStore,
  writeOverridesStore,
  readAdminHistory,
  writeAdminHistory,
} from '@/lib/cms-storage'

export const runtime = 'nodejs'

async function getAuthUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const secret = getAdminSessionSecret()
  return verifyAdminSessionToken(secret, token)
}

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
  console.error('[cms] overrides write failed:', err)
  return NextResponse.json({ error: 'write_failed', message: '저장에 실패했습니다.' }, { status: 500 })
}

/* ── GET ──────────────────────────────────────────────────────────────────── */
export async function GET() {
  if (!(await getAuthUser())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await readOverridesStore())
}

/* ── PATCH ────────────────────────────────────────────────────────────────── */
interface PatchBody {
  key: string
  value?: string
  sourceSnapshot?: string
  staleDismissed?: boolean
  remove?: boolean
  displayName?: string
  lang?: string
  type?: string
}

export async function PATCH(req: NextRequest) {
  const username = await getAuthUser()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: PatchBody
  try { body = (await req.json()) as PatchBody }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { key, value, sourceSnapshot, staleDismissed, remove, displayName } = body
  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'key required' }, { status: 400 })
  }

  try {
    const store = await readOverridesStore()
    const parsed = parseOverrideKey(key)
    const existing = store[key]

    if (remove) {
      if (parsed) {
        const history = [
          makeHistoryEntry({
            username, action: 'remove', key,
            type: parsed.type, itemId: parsed.itemId,
            itemName: displayName ?? parsed.itemId,
            lang: parsed.lang,
            oldValue: existing?.value,
          }),
          ...(await readAdminHistory()),
        ].slice(0, MAX_HISTORY)
        await writeAdminHistory(history)
      }
      delete store[key]
    } else if (staleDismissed === true) {
      if (existing) {
        store[key] = { ...existing, staleDismissed: true, updatedAt: new Date().toISOString() }
        if (parsed) {
          const history = [
            makeHistoryEntry({
              username, action: 'dismiss', key,
              type: parsed.type, itemId: parsed.itemId,
              itemName: displayName ?? parsed.itemId,
              lang: parsed.lang,
            }),
            ...(await readAdminHistory()),
          ].slice(0, MAX_HISTORY)
          await writeAdminHistory(history)
        }
      }
    } else {
      if (typeof value !== 'string' || typeof sourceSnapshot !== 'string') {
        return NextResponse.json({ error: 'value and sourceSnapshot required' }, { status: 400 })
      }
      const entry: TranslationOverride = {
        value,
        sourceSnapshot,
        staleDismissed: false,
        updatedAt: new Date().toISOString(),
      }
      store[key] = entry
      if (parsed) {
        const history = [
          makeHistoryEntry({
            username, action: 'save', key,
            type: parsed.type, itemId: parsed.itemId,
            itemName: displayName ?? parsed.itemId,
            lang: parsed.lang,
            oldValue: existing?.value,
            newValue: value,
          }),
          ...(await readAdminHistory()),
        ].slice(0, MAX_HISTORY)
        await writeAdminHistory(history)
      }
    }

    await writeOverridesStore(store)
    return NextResponse.json({ ok: true, store })
  } catch (err) {
    return cmsErrorResponse(err)
  }
}
