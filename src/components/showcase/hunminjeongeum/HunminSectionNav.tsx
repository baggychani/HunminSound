'use client'

import { useCallback, useEffect, useState } from 'react'
import type { HunminPassageSectionId } from '@/data/hunminjeongeumPassages'

const SECTION_IDS = ['hunmin-initial', 'hunmin-medial', 'hunmin-appraisal'] as const
type HunminNavId = (typeof SECTION_IDS)[number]

const ID_TO_KEY: Record<HunminNavId, HunminPassageSectionId> = {
  'hunmin-initial': 'initial',
  'hunmin-medial': 'medial',
  'hunmin-appraisal': 'appraisal',
}

function readHeaderGap(): number {
  if (typeof document === 'undefined') return 96
  const header = document.querySelector('header')
  const h = header ? header.getBoundingClientRect().height : 0
  return Math.ceil(h) + 12
}

function scrollToHunminSection(id: string): void {
  const section = document.getElementById(id)
  const title = document.getElementById(`${id}-title`)
  const target = title ?? section
  if (!target) return

  const scrollOnce = (): void => {
    const headerGap = readHeaderGap()
    const scrollMt =
      parseFloat(getComputedStyle(section ?? target).scrollMarginTop) || 0
    const rect = target.getBoundingClientRect()
    const y = window.scrollY + rect.top - headerGap - scrollMt
    window.scrollTo({ top: Math.max(0, y), left: 0, behavior: 'instant' })
  }

  scrollOnce()
  requestAnimationFrame(() => {
    scrollOnce()
    requestAnimationFrame(scrollOnce)
  })
}

interface HunminSectionNavProps {
  labels: Record<HunminPassageSectionId, string>
}

export function HunminSectionNav({ labels }: HunminSectionNavProps) {
  const [active, setActive] = useState<HunminNavId>('hunmin-initial')

  useEffect(() => {
    const headerGap = readHeaderGap()
    const visible = new Map<HunminNavId, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as HunminNavId
          if (!SECTION_IDS.includes(id)) continue
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio)
          } else {
            visible.delete(id)
          }
        }

        if (visible.size === 0) return

        let best: HunminNavId = 'hunmin-initial'
        let bestRatio = -1
        for (const id of SECTION_IDS) {
          const ratio = visible.get(id)
          if (ratio !== undefined && ratio >= bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        setActive(best)
      },
      {
        root: null,
        rootMargin: `-${headerGap}px 0px -45% 0px`,
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    )

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const onNavigate = useCallback((id: HunminNavId) => {
    scrollToHunminSection(id)
    setActive(id)
  }, [])

  return (
    <nav
      className="fixed start-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-0.5 lg:start-4 lg:flex xl:start-[max(1.5rem,calc((100vw-min(100vw,1480px))/2-11rem))]"
      aria-label="훈민정음 본문 목차"
    >
      <div className="rounded-xl border border-hanji-border/80 bg-hanji/88 px-2 py-2.5 shadow-sm backdrop-blur-sm dark:bg-hanji/75">
        {SECTION_IDS.map((id) => {
          const isActive = active === id
          const label = labels[ID_TO_KEY[id]]
          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onNavigate(id)}
              className={`group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start transition-colors ${
                isActive
                  ? 'bg-ink/[0.06] text-ink dark:bg-ink/[0.1]'
                  : 'text-ink-muted hover:bg-ink/[0.04] hover:text-ink-soft'
              }`}
            >
              <span
                aria-hidden
                className={`h-4 w-0.5 shrink-0 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-ink/15 group-hover:bg-ink/25'
                }`}
              />
              <span className="font-sans text-[11px] leading-snug tracking-[0.04em] sm:text-xs">
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
