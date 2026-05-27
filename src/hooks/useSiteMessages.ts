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

function notify() {
  _listeners.forEach((fn) => fn())
}

async function fetchPublicOverrides(): Promise<OverridesStore> {
  if (_store) return _store
  if (!_fetchPromise) {
    _fetchPromise = fetch('/api/i18n-overrides', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: OverridesStore) => {
        _store = data
        notify()
        return data
      })
      .catch(() => ({}))
  }
  return _fetchPromise
}

export function usePublicOverridesStore(): OverridesStore {
  const [store, setStore] = useState<OverridesStore>(_store ?? {})

  useEffect(() => {
    if (_store) {
      setStore(_store)
      return
    }
    fetchPublicOverrides().then(setStore)
    const listener = () => setStore({ ...(_store ?? {}) })
    _listeners.add(listener)
    return () => {
      _listeners.delete(listener)
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
  _store = null
  _fetchPromise = null
  notify()
}
