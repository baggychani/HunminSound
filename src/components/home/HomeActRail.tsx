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
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference lg:flex xl:right-8"
    >
      <ul className="pointer-events-auto flex flex-col items-center">
        {ACTS.map(({ id }, idx) => {
          const isActive = idx === active
          return (
            <li key={id} className="flex flex-col items-center">
              {idx > 0 && <span aria-hidden className="h-4 w-px bg-white/30" />}
              <button
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`${idx + 1}막으로 이동`}
                aria-current={isActive ? 'true' : undefined}
                className="group relative flex h-5 w-5 items-center justify-center"
              >
                <motion.span
                  aria-hidden
                  animate={{
                    scale: isActive ? 1 : 0.6,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="h-1.5 w-1.5 rounded-full bg-white group-hover:opacity-80"
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
