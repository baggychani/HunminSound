'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export interface SectionRailItem {
  /** 스크롤 대상 요소 id */
  id: string
  /** 표기 (예: '01') */
  num: string
  /** 접근성 라벨 */
  label: string
}

interface SectionRailProps {
  items: SectionRailItem[]
  /** layoutId 충돌 방지용 — 페이지마다 고유하게 */
  railId: string
  ariaLabel: string
}

/**
 * 우측 고정 섹션 레일 — mix-blend-difference로 배경에 따라 자동 반전. 데스크톱 전용.
 */
export function SectionRail({ items, railId, ariaLabel }: SectionRailProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const idx = items.findIndex(({ id }) => id === entry.target.id)
          if (idx >= 0) setActive(idx)
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )

    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  const goTo = (idx: number) => {
    document.getElementById(items[idx].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label={ariaLabel}
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference lg:flex xl:right-7"
    >
      <ul className="pointer-events-auto flex flex-col items-center gap-1.5">
        {items.map(({ id, num, label }, idx) => {
          const isActive = idx === active
          return (
            <li key={id} className="flex flex-col items-center gap-1.5">
              {idx > 0 && <span aria-hidden className="h-5 w-px bg-white/30" />}
              <button
                type="button"
                onClick={() => goTo(idx)}
                aria-label={label}
                aria-current={isActive ? 'true' : undefined}
                className="group relative flex h-9 w-9 items-center justify-center transition-all duration-300"
              >
                {isActive && (
                  <motion.span
                    layoutId={`section-rail-ring-${railId}`}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="absolute inset-0 rounded-full border border-white/70"
                    aria-hidden
                  />
                )}
                <span
                  className={`relative font-serif text-[13px] leading-none transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-white/40 group-hover:text-white/75'
                  }`}
                >
                  {num}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
