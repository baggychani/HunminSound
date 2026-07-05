'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ACTS = [
  { id: 'home-act1' },
  { id: 'home-act2' },
  { id: 'home-act3' },
  { id: 'home-act4' },
] as const

/**
 * 홈 우측 고정 막(act) 내비 — 데스크톱 전용.
 * mix-blend-difference 로 밝은 한지 위에서는 먹색, 3막 다크 위에서는 흰색으로 자동 반전.
 */
export function HomeActRail() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const sections = ACTS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (sections.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const idx = ACTS.findIndex(({ id }) => id === entry.target.id)
          if (idx >= 0) setActive(idx)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const goTo = (idx: number) => {
    if (idx === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(ACTS[idx].id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      aria-label="페이지 구간 이동"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference lg:flex xl:right-7"
    >
      <ul className="pointer-events-auto flex flex-col items-center gap-1.5">
        {ACTS.map(({ id }, idx) => {
          const isActive = idx === active
          return (
            <li key={id} className="flex flex-col items-center gap-1.5">
              {idx > 0 && (
                <span aria-hidden className="h-5 w-px bg-white/30" />
              )}
              <button
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`${idx + 1}막으로 이동`}
                aria-current={isActive ? 'true' : undefined}
                className="group relative flex h-8 w-8 items-center justify-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="home-act-rail-ring"
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="absolute inset-0 rounded-full border border-white/70"
                    aria-hidden
                  />
                )}
                <span
                  aria-hidden
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'h-2 w-2 bg-white'
                      : 'h-1.5 w-1.5 bg-white/40 group-hover:bg-white/70'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
