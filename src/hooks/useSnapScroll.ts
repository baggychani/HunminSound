'use client'

import { useCallback, useEffect } from 'react'
import type { SectionId } from '@/lib/v2-i18n'

/** 네비 클릭 시에만 섹션으로 이동. 스크롤 중 자동 스냅은 하지 않음. */
export function useSnapScroll(_activeSection: SectionId, onSectionChange: (id: SectionId) => void) {
  const scrollToSection = useCallback(
    (id: SectionId) => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      onSectionChange(id)
    },
    [onSectionChange],
  )

  return { scrollToSection }
}

export function useSectionObserver(onSectionChange: (id: SectionId) => void) {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[data-snap]')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          onSectionChange(visible[0].target.id as SectionId)
        }
      },
      { threshold: [0.2, 0.35, 0.5], rootMargin: '-5% 0px -5% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [onSectionChange])
}
