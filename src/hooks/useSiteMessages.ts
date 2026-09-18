'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { getV2Messages } from '@/lib/v2-i18n'
import type { OverridesStore } from '@/lib/i18n-overrides'
import {
  applyHomeOverridesToMessages,
  applyHomeOverridesToV2,
} from '@/lib/apply-home-overrides'

let _store: OverridesStore | null = null
let _fetchPromise: Promise<OverridesStore> | null = null
const _listeners = new Set<() => void>()
let _generation = 0
const CMS_UPDATE_KEY = 'sejong-cms-updated'

function notify() {
  _listeners.forEach((fn) => fn())
}

async function fetchPublicOverrides(): Promise<OverridesStore> {
  if (!_fetchPromise) {
    const generation = _generation
    _fetchPromise = fetch('/api/i18n-overrides', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load content')
        return res.json()
      })
      .then((data: OverridesStore) => {
        if (generation === _generation) {
          _store = data
          notify()
        }
        return data
      })
      .catch(() => _store ?? {})
      .finally(() => {
        if (generation === _generation) _fetchPromise = null
      })
  }
  return _fetchPromise
}

export function usePublicOverridesStore(): OverridesStore {
  const [store, setStore] = useState<OverridesStore>(_store ?? {})

  useEffect(() => {
    const listener = () => setStore({ ...(_store ?? {}) })
    const refresh = () => { void fetchPublicOverrides() }
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === CMS_UPDATE_KEY) {
        _generation += 1
        _fetchPromise = null
        refresh()
      }
    }
    _listeners.add(listener)
    listener()
    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('storage', onStorage)
    return () => {
      _listeners.delete(listener)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return store
}

/** 홈 CMS 오버라이드가 반영된 메시지 */
export function useSiteMessages() {
  const { lang } = useLang()
  const store = usePublicOverridesStore()

  const m = useMemo(
    () => applyHomeOverridesToMessages(getMessages(lang), lang, store),
    [lang, store],
  )
  const v2 = useMemo(
    () => applyHomeOverridesToV2(getV2Messages(lang), lang, store),
    [lang, store],
  )

  return { m, v2, lang }
}

/** 관리자 저장 후 공개 사이트 번역 캐시 갱신 */
export function resetPublicOverridesCache() {
  _generation += 1
  _fetchPromise = null
  void fetchPublicOverrides()
  try {
    localStorage.setItem(CMS_UPDATE_KEY, String(Date.now()))
  } catch {}
}
