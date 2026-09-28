'use client'

import { useLayoutEffect, useRef } from 'react'

/** 상세 패널 펼침(0.55s) + 여유 */
const FOLLOW_EXPAND_MS = 900

/** sticky 헤더 아래로 앵커(자모/모음 줄) 상단이 오도록 window 기준 스크롤 */
function readHeaderBelowGapPx(): number {
  if (typeof document === 'undefined') return 96
  const header = document.querySelector('header')
  const h = header ? header.getBoundingClientRect().height : 0
  return Math.ceil(h) + 12
}

/** main 아래 여백(globals.css) — 페이지 끝쪽 줄도 헤더 아래까지 올릴 수 있게 모자란 만큼만 */
const ROOM_VAR = '--symbol-detail-room'

function ensureRoomBelow(targetY: number): void {
  const root = document.documentElement
  const current = parseFloat(root.style.getPropertyValue(ROOM_VAR)) || 0
  const maxScrollWithoutRoom = root.scrollHeight - current - window.innerHeight
  const need = Math.max(0, Math.ceil(targetY - maxScrollWithoutRoom))
  if (need !== current) root.style.setProperty(ROOM_VAR, `${need}px`)
}

function clearRoomBelow(): void {
  document.documentElement.style.removeProperty(ROOM_VAR)
}

function scrollWindowAlignTop(el: HTMLElement): void {
  const headerGap = readHeaderBelowGapPx()
  const scrollMt = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  const rect = el.getBoundingClientRect()
  const y = Math.max(0, window.scrollY + rect.top - headerGap - scrollMt)
  ensureRoomBelow(y)
  window.scrollTo({ top: y, left: 0, behavior: 'instant' })
}

/**
 * 자모/모음 **버튼 줄** 기준: sticky 헤더 바로 아래에 그 줄 상단이 오도록 window 스크롤.
 * 상세 패널(높이 가변)이 아니라 줄을 기준으로 해 비음 등에서도 일관됩니다.
 */
export function useScrollToSymbolDetail(activeId: string | null) {
  const detailRef = useRef<HTMLDivElement>(null)

  // 패널을 닫거나 페이지를 떠나면 임시 여백 제거
  useLayoutEffect(() => {
    if (!activeId) clearRoomBelow()
    return undefined
  }, [activeId])
  useLayoutEffect(() => clearRoomBelow, [])

  useLayoutEffect(() => {
    if (!activeId) return undefined

    let cancelled = false
    let raf1 = 0
    let raf2 = 0

    const scrollOnce = (): boolean => {
      if (cancelled) return false
      const el = detailRef.current
      if (!el) return false
      scrollWindowAlignTop(el)
      return true
    }

    scrollOnce()
    raf1 = requestAnimationFrame(() => {
      if (cancelled) return
      scrollOnce()
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return
        scrollOnce()
      })
    })

    // 상세 패널은 높이 0에서 펼쳐진다(ScrollSection, 0.55s). 클릭 순간엔 페이지가 짧아서
    // (특히 아래 내용이 적은 모음 페이지) 브라우저가 스크롤을 끝에서 멈춰 버리므로,
    // 펼쳐지는 동안 페이지 높이가 늘 때마다 다시 맞춘다. 사용자가 직접 스크롤하면 즉시 중단.
    const stopFollowing = () => {
      observer.disconnect()
      window.clearTimeout(followTimer)
      window.removeEventListener('wheel', stopFollowing)
      window.removeEventListener('touchstart', stopFollowing)
      window.removeEventListener('keydown', stopFollowing)
    }
    const observer = new ResizeObserver(() => {
      if (!cancelled) scrollOnce()
    })
    observer.observe(document.body)
    const followTimer = window.setTimeout(stopFollowing, FOLLOW_EXPAND_MS)
    window.addEventListener('wheel', stopFollowing, { passive: true })
    window.addEventListener('touchstart', stopFollowing, { passive: true })
    window.addEventListener('keydown', stopFollowing)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      stopFollowing()
    }
  }, [activeId])

  return detailRef
}
