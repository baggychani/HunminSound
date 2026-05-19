'use client'

import { useSyncExternalStore } from 'react'

/** Tailwind `sm` 미만 (640px 미만) — 모바일 전용 스타일 분기용 */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia('(max-width: 639px)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia('(max-width: 639px)').matches
}

function getServerSnapshot() {
  return false
}

export function useMaxSm(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
