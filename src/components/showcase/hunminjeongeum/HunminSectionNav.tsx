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

const NAV_WIDTH_PX = 148
const NAV_MARGIN_PX = 16

function scrollToHunminSection(id: string): void {
  const section = document.getElementById(id)
  if (!section) return

  const run = () => section.scrollIntoView({ behavior: 'instant', block: 'start' })
  run()
  requestAnimationFrame(() => {
    run()
    requestAnimationFrame(run)
  })
}

function readHeaderGap(): number {
  if (typeof document === 'undefined') return 64
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-h').trim()
  const parsed = parseFloat(raw)
  if (Number.isFinite(parsed) && parsed > 0) return parsed
  const header = document.querySelector('header')
  return header ? Math.ceil(header.getBoundingClientRect().height) : 64
}

/** 본문 컨테이너 왼쪽에 목차가 들어갈 여백이 있는지 (좁은 노트북에서는 숨김) */
function useSideNavPlacement() {
  const [visible, setVisible] = useState(false)
  const [insetStart, setInsetStart] = useState(NAV_MARGIN_PX)

  useEffect(() => {
    const update = () => {
      const container = document.querySelector('.site-container')
      if (!container) {
        setVisible(false)
        return
      }
      const left = container.getBoundingClientRect().left
      const minLeft = NAV_WIDTH_PX + NAV_MARGIN_PX
      setVisible(left >= minLeft)
      setInsetStart(Math.max(NAV_MARGIN_PX, left - NAV_WIDTH_PX - 12))
    }

    update()
    window.addEventListener('resize', update)
    const container = document.querySelector('.site-container')
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
    if (container) ro?.observe(container)

    return () => {
      window.removeEventListener('resize', update)
      ro?.disconnect()
    }
  }, [])

  return { visible, insetStart }
}

interface HunminSectionNavProps {
  labels: Record<HunminPassageSectionId, string>
}

export function HunminSectionNav({ labels }: HunminSectionNavProps) {
  const [active, setActive] = useState<HunminNavId>('hunmin-initial')
  const { visible, insetStart } = useSideNavPlacement()

  useEffect(() => {
    const headerGap = readHeaderGap()

    const visibleSections = new Map<HunminNavId, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as HunminNavId
          if (!SECTION_IDS.includes(id)) continue
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio)
          } else {
            visibleSections.delete(id)
          }
        }

        if (visibleSections.size === 0) return

        let best: HunminNavId = 'hunmin-initial'
        let bestRatio = -1
        for (const id of SECTION_IDS) {
          const ratio = visibleSections.get(id)
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

  if (!visible) return null

  return (
    <nav
      className="fixed top-1/2 z-40 flex -translate-y-1/2 flex-col gap-0.5"
      style={{ insetInlineStart: insetStart }}
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
