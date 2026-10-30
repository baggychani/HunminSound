'use client'

import { useSyncExternalStore } from 'react'
import { PHONE_MQ } from '@/lib/viewportLayout'

/** 폰 레이아웃 — 창이 640px 미만이거나, 크롬 데스크톱 사이트로 연 폰 */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PHONE_MQ)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(PHONE_MQ).matches
}

function getServerSnapshot() {
  return false
}

export function useMaxSm(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
