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
    throw new Error(data.message ?? `저장하지 못했습니다(${res.status}). 입력한 내용을 복사해 두고 다시 시도해 주세요.`)
  }
  _globalStore = data.store ?? {}
  notify()
  try {
    const { resetPublicOverridesCache } = await import('@/hooks/useSiteMessages')
    resetPublicOverridesCache()
  } catch {}
  return _globalStore
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
