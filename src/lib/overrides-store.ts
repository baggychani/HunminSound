'use client'

/**
 * 관리자 번역 오버라이드 전역 스토어 (클라이언트 모듈 싱글톤)
 * TranslationDrawer 와 관리자 행 컴포넌트가 함께 사용합니다.
 */

import { useEffect, useState } from 'react'
import type { OverridesStore } from '@/lib/i18n-overrides'

let _globalStore: OverridesStore | null = null
const _listeners: Set<() => void> = new Set()

function notify() { _listeners.forEach((fn) => fn()) }

async function fetchStore(): Promise<OverridesStore> {
  const res = await fetch('/api/admin/i18n-overrides', { cache: 'no-store' })
  if (!res.ok) return {}
  return res.json() as Promise<OverridesStore>
}

export async function patchOverride(body: object): Promise<OverridesStore> {
  const res = await fetch('/api/admin/i18n-overrides', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('저장 실패')
  const data = (await res.json()) as { ok: boolean; store: OverridesStore }
  _globalStore = data.store
  notify()
  return data.store
}

export function useOverridesStore() {
  const [store, setStore] = useState<OverridesStore>(_globalStore ?? {})
  useEffect(() => {
    if (_globalStore === null) {
      fetchStore().then((s) => {
        _globalStore = s
        setStore(s)
        notify()
      })
    }
    const listener = () => setStore({ ..._globalStore! })
    _listeners.add(listener)
    return () => { _listeners.delete(listener) }
  }, [])
  return store
}

/** 한국어 오버라이드 키 */
export function makeKoreanKey(type: 'consonant' | 'vowel', id: string) {
  return `${type}:${id}:description:ko`
}

/** 현재 한국어 텍스트 (오버라이드 있으면 우선) */
export function getCurrentKorean(
  store: OverridesStore,
  type: 'consonant' | 'vowel',
  id: string,
  baseKorean: string,
): string {
  return store[makeKoreanKey(type, id)]?.value ?? baseKorean
}
