'use client'

import { useLayoutEffect, useRef } from 'react'

/** sticky 헤더 아래로 앵커(자모/모음 줄) 상단이 오도록 window 기준 스크롤 */
function readHeaderBelowGapPx(): number {
  if (typeof document === 'undefined') return 96
  const header = document.querySelector('header')
  const h = header ? header.getBoundingClientRect().height : 0
  return Math.ceil(h) + 12
}

function scrollWindowAlignTop(el: HTMLElement): void {
  const headerGap = readHeaderBelowGapPx()
  const scrollMt = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  const rect = el.getBoundingClientRect()
  const y = window.scrollY + rect.top - headerGap - scrollMt
  window.scrollTo({ top: Math.max(0, y), left: 0, behavior: 'instant' })
}

/**
 * 자모/모음 **버튼 줄** 기준: sticky 헤더 바로 아래에 그 줄 상단이 오도록 window 스크롤.
 * 상세 패널(높이 가변)이 아니라 줄을 기준으로 해 비음 등에서도 일관됩니다.
 */
export function useScrollToSymbolDetail(activeId: string | null) {
  const detailRef = useRef<HTMLDivElement>(null)

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

    return () => {
      cancelled = true
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [activeId])

  return detailRef
}
