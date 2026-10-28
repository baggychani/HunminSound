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

/** 예전 스크롤 보정용 빈칸. 더 이상 넣지 않고, 남아 있으면 지운다. */
const ROOM_VAR = '--symbol-detail-room'

function clearRoomBelow(): void {
  document.documentElement.style.removeProperty(ROOM_VAR)
}

function scrollWindowAlignTop(el: HTMLElement): void {
  clearRoomBelow()
  const headerGap = readHeaderBelowGapPx()
  const scrollMt = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  const rect = el.getBoundingClientRect()
  const desired = Math.max(0, window.scrollY + rect.top - headerGap - scrollMt)
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const top = Math.min(desired, maxScroll)
  if (Math.abs(top - window.scrollY) < 2) return
  window.scrollTo({ top, behavior: 'instant' })
}

/**
 * 자모/모음 버튼 줄을 헤더 아래로 올린다.
 * 페이지가 짧으면 빈 높이를 만들지 않고, 실제 문서 끝에서 스크롤을 멈춘다.
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

    // 라우터가 로드 직후 스크롤을 맨 위로 되돌리는 경우가 있어, 빈 높이를 만들지 않고 잠시 다시 맞춘다.
    const later = [50, 300, 700].map((ms) => window.setTimeout(scrollOnce, ms))

    // 상세 패널은 높이 0에서 펼쳐진다(ScrollSection, 0.55s).
    // 펼쳐지는 동안 문서가 길어지면 그 범위 안에서만 다시 맞춘다. 사용자가 직접 스크롤하면 즉시 중단.
    const stopFollowing = () => {
      observer.disconnect()
      later.forEach((id) => window.clearTimeout(id))
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
