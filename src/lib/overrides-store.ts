'use client'

/**
 * 관리자 번역 오버라이드 전역 스토어 (클라이언트 모듈 싱글톤)
 * TranslationDrawer 와 관리자 행 컴포넌트가 함께 사용합니다.
 */

import { useEffect, useState } from 'react'
import type { OverridesStore } from '@/lib/i18n-overrides'

let _globalStore: OverridesStore | null = null
let _loadError: string | null = null
let _pending: Promise<void> | null = null
const _listeners: Set<() => void> = new Set()

function notify() { _listeners.forEach((fn) => fn()) }

async function fetchStore(): Promise<OverridesStore> {
  const res = await fetch('/api/admin/i18n-overrides', { cache: 'no-store' })
  if (!res.ok) throw new Error('현재 내용을 불러오지 못했습니다. 다시 시도해 주세요.')
  return res.json() as Promise<OverridesStore>
}

export async function patchOverride(body: { key: string; [key: string]: unknown }): Promise<OverridesStore> {
  if (!_globalStore) throw new Error('현재 내용을 먼저 불러와야 합니다.')
  const res = await fetch('/api/admin/i18n-overrides', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, expectedVersion: _globalStore[body.key]?.updatedAt || null }),
  })
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean
    store?: OverridesStore
    error?: string
    message?: string
  }
  if (res.status === 401) {
    throw new Error('로그인이 만료되었습니다. 이 탭은 그대로 두고 새 탭에서 다시 로그인한 뒤, 여기서 저장을 다시 눌러 주세요.')
  }
  if (!res.ok) {
    if (res.status === 409) await refreshAdminOverrides()
    throw new Error(data.message ?? `저장하지 못했습니다(${res.status}). 입력한 내용을 복사해 두고 다시 시도해 주세요.`)
  }
  _globalStore = data.store ?? {}
  notify()
  notifyCmsSaved()
  try {
    const { resetPublicOverridesCache } = await import('@/hooks/useSiteMessages')
    resetPublicOverridesCache()
  } catch {}
  return _globalStore
}

export function useOverridesStore() {
  const [store, setStore] = useState<OverridesStore>(_globalStore ?? {})
  useEffect(() => {
    if (_globalStore === null) void refreshAdminOverrides()
    const listener = () => setStore({ ..._globalStore! })
    _listeners.add(listener)
    return () => { _listeners.delete(listener) }
  }, [])
  return store
}

export const CMS_CONTENT_CHANGED = 'hunmin-cms-content-changed'

export function notifyCmsContentChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CMS_CONTENT_CHANGED))
}

/** 편집 화면에서 저장한 뒤 상단 막대가 수정 내역과 코드 반영 상태를 다시 읽게 한다. */
export const CMS_SAVED = 'hunmin-cms-saved'

export function notifyCmsSaved() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CMS_SAVED))
}

export function refreshAdminOverrides(): Promise<void> {
  if (!_pending) {
    _pending = fetchStore().then((s) => { _globalStore = s; _loadError = null })
      .catch((e) => { _loadError = e instanceof Error ? e.message : '불러오기에 실패했습니다.' })
      .finally(() => { _pending = null; notify() })
  }
  return _pending
}

export function useOverridesStatus() {
  const [, tick] = useState(0)
  useEffect(() => {
    const listener = () => tick((n) => n + 1)
    _listeners.add(listener)
    return () => { _listeners.delete(listener) }
  }, [])
  return { ready: _globalStore !== null, error: _loadError }
}

/** 한국어 오버라이드 키 */
export function makeKoreanKey(type: 'consonant' | 'vowel' | 'home', id: string) {
  return `${type}:${id}:description:ko`
}

export function makeHomeKoreanKey(id: string) {
  return makeKoreanKey('home', id)
}

/** 현재 한국어 텍스트 (오버라이드 있으면 우선) */
export function getCurrentKorean(
  store: OverridesStore,
  type: 'consonant' | 'vowel' | 'home',
  id: string,
  baseKorean: string,
): string {
  return store[makeKoreanKey(type, id)]?.value ?? baseKorean
}
