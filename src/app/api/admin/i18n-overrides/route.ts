/**
 * /api/admin/i18n-overrides
 *
 * GET   → 전체 오버라이드 반환
 * PATCH → 단일 항목 저장·삭제·staleDismissed 처리 + 수정 내역 기록
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import type { OverridesStore, TranslationOverride } from '@/lib/i18n-overrides'
import {
  makeHistoryEntry, parseOverrideKey, MAX_HISTORY,
  type HistoryEntry,
} from '@/lib/admin-history'

export const runtime = 'nodejs'

const OVERRIDES_PATH = path.join(process.cwd(), 'src', 'data', 'i18n-overrides.json')
const HISTORY_PATH   = path.join(process.cwd(), 'src', 'data', 'admin-history.json')

function readStore(): OverridesStore {
  try { return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8')) as OverridesStore }
  catch { return {} }
}
function writeStore(store: OverridesStore) {
  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(store, null, 2), 'utf8')
}

function readHistory(): HistoryEntry[] {
  try { return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8')) as HistoryEntry[] }
  catch { return [] }
}
function appendHistory(entry: HistoryEntry) {
  const history = [entry, ...readHistory()].slice(0, MAX_HISTORY)
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf8')
}

async function getAuthUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const secret = getAdminSessionSecret()
  return verifyAdminSessionToken(secret, token)
}

/* ── GET ──────────────────────────────────────────────────────────────────── */
export async function GET() {
  if (!(await getAuthUser())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(readStore())
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

  const store = readStore()
  const parsed = parseOverrideKey(key)
  const existing = store[key]

  if (remove) {
    if (parsed) {
      appendHistory(makeHistoryEntry({
        username, action: 'remove', key,
        type: parsed.type, itemId: parsed.itemId,
        itemName: displayName ?? parsed.itemId,
        lang: parsed.lang,
        oldValue: existing?.value,
      }))
    }
    delete store[key]
  } else if (staleDismissed === true) {
    if (existing) {
      store[key] = { ...existing, staleDismissed: true, updatedAt: new Date().toISOString() }
      if (parsed) {
        appendHistory(makeHistoryEntry({
          username, action: 'dismiss', key,
          type: parsed.type, itemId: parsed.itemId,
          itemName: displayName ?? parsed.itemId,
          lang: parsed.lang,
        }))
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
      appendHistory(makeHistoryEntry({
        username, action: 'save', key,
        type: parsed.type, itemId: parsed.itemId,
        itemName: displayName ?? parsed.itemId,
        lang: parsed.lang,
        oldValue: existing?.value,
        newValue: value,
      }))
    }
  }

  writeStore(store)
  return NextResponse.json({ ok: true, store })
}
