import { NextResponse } from 'next/server'
import { readOverridesStore, writeOverridesStore } from '@/lib/cms-storage'
import type { OverridesStore } from '@/lib/i18n-overrides'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HINDI_HOME_INTRO_KEY = 'home:homeIntro:description:hi'
/** 배포 저장소에만 남아 있던 한글 음절. 파일과 달리 사이트가 이 값을 읽는다. */
const HANGUL_O = 'हुनमिंजे\uC624ंगम'
const HINDI_HUNMIN = 'हुनमिनजोंगम'

async function repairHindiHomeIntro(store: OverridesStore): Promise<OverridesStore> {
  const entry = store[HINDI_HOME_INTRO_KEY]
  if (!entry?.value.includes('\uC624')) return store
  let value = entry.value.replaceAll(HANGUL_O, HINDI_HUNMIN)
  if (value.includes('\uC624')) value = value.replaceAll('\uC624', '')
  if (value === entry.value) return store
  const next: OverridesStore = {
    ...store,
    [HINDI_HOME_INTRO_KEY]: {
      ...entry,
      value,
      updatedAt: new Date().toISOString(),
    },
  }
  await writeOverridesStore(next)
  return next
}

/** 공개 사이트 — i18n 오버라이드 읽기 전용 */
export async function GET() {
  const store = await repairHindiHomeIntro(await readOverridesStore())
  return NextResponse.json(store, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
