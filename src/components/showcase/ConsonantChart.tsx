'use client'

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useScrollToSymbolDetail } from '@/hooks/useScrollToSymbolDetail'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import {
  HUNMIN_CONSONANT_ROWS,
  hunminRowContainsSymbol,
  type HunminRow,
  type HunminSegment,
} from '@/data/hunminConsonantLayout'
import type { Consonant } from '@/types'

const CATEGORY_ORDER = ['파열음', '마찰음', '파찰음', '비음', '유음']

// 모핑 연출 공통 제어값: 여기만 바꾸면 전체 타이밍/이징이 함께 변경된다.
const MORPH_DURATION_SECONDS = 1.5
const MORPH_EASE_BEZIER = [0.65, 0.0, 0.35, 1.0] as const
const GLYPH_FLIP_MS = MORPH_DURATION_SECONDS * 1000
const GLYPH_FLIP_EASING = 'cubic-bezier(0.65, 0.0, 0.35, 1.0)'

/** 같은 슬롯(row-slot) 행이 모드 전환 시에도 DOM이 유지되어 layout 보간이 먹도록 */
const ROW_LAYOUT_TRANSITION = {
  type: 'tween' as const,
  duration: MORPH_DURATION_SECONDS,
  ease: MORPH_EASE_BEZIER,
}

type GlyphSnapshot = {
  rect: DOMRect
  scrollX: number
  scrollY: number
}

function captureGlyphRects(root: HTMLElement, mode: ChartViewMode) {
  const map = new Map<string, GlyphSnapshot>()
  root.querySelectorAll<HTMLElement>(`[data-glyph-flip][data-view-mode="${mode}"]`).forEach((el) => {
    const s = el.dataset.glyphFlip
    if (s) {
      map.set(s, {
        rect: el.getBoundingClientRect(),
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      })
    }
  })
  return map
}

/** 이전 뷰 좌표 → 새 DOM: 직선 translate (Framer layoutId 대신) */
function applyGlyphFlip(
  root: HTMLElement,
  firstRects: Map<string, GlyphSnapshot>,
  targetMode: ChartViewMode,
) {
  root.querySelectorAll<HTMLElement>(`[data-glyph-flip][data-view-mode="${targetMode}"]`).forEach((el) => {
    const sym = el.dataset.glyphFlip
    if (!sym) return
    const first = firstRects.get(sym)
    if (!first) return
    const lastRect = el.getBoundingClientRect()
    const firstLeft = first.rect.left + first.scrollX
    const firstTop = first.rect.top + first.scrollY
    const lastLeft = lastRect.left + window.scrollX
    const lastTop = lastRect.top + window.scrollY
    const dx = firstLeft - lastLeft
    const dy = firstTop - lastTop
    if (Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25) return

    el.style.willChange = 'transform'
    el.style.transform = `translate(${dx}px, ${dy}px)`
    el.style.transition = 'transform 0s'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${GLYPH_FLIP_MS}ms ${GLYPH_FLIP_EASING}`
        el.style.transform = 'translate(0px, 0px)'
        window.setTimeout(() => {
          if (!el.isConnected) return
          el.style.transform = ''
          el.style.transition = ''
          el.style.willChange = ''
        }, GLYPH_FLIP_MS + 40)
      })
    })
  })
}

/** 훈민 행 안 기본자·확장자 — 세그먼트 라벨과 동일 타이포, 아래 얇은 선 */
function HunminZoneHeading({ title }: { title: string }) {
  return (
    <div className="mb-4 w-full">
      <span className="block text-left font-sans text-xs leading-snug tracking-wide text-ink-muted sm:text-[13px]">
        {title}
      </span>
      <div className="mt-2.5 h-px w-full bg-hanji-border/80" aria-hidden />
    </div>
  )
}

interface ConsonantChartProps {
  consonants: Consonant[]
  viewMode?: ChartViewMode
}

function groupByArticulation(
  items: Consonant[],
): { group: string; items: Consonant[] }[] {
  const result: { group: string; items: Consonant[] }[] = []
  for (const item of items) {
    const key = item.articulationGroup ?? ''
    const existing = result.find((g) => g.group === key)
    if (existing) {
      existing.items.push(item)
    } else {
      result.push({ group: key, items: [item] })
    }
  }
  return result
}

function findConsonantBySymbol(consonants: Consonant[], symbol: string): Consonant | undefined {
  return consonants.find((c) => c.symbol === symbol)
}

export function ConsonantChart({ consonants, viewMode = 'modern' }: ConsonantChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const detailScrollRef = useScrollToSymbolDetail(activeId)
  const { lang } = useLang()
  const m = getMessages(lang)
  const chartRootRef = useRef<HTMLDivElement>(null)
  const glyphRectsRef = useRef<Map<string, GlyphSnapshot>>(new Map())
  const prevViewModeRef = useRef<ChartViewMode>(viewMode)
  const [shouldAnimateGlyphs, setShouldAnimateGlyphs] = useState(false)
  const [shouldCrossfadeContent, setShouldCrossfadeContent] = useState(true)

  const captureCurrentGlyphRects = useCallback(() => {
    if (!chartRootRef.current) return
    glyphRectsRef.current = captureGlyphRects(chartRootRef.current, viewMode)
  }, [viewMode])

  useEffect(() => {
    setActiveId(null)
  }, [viewMode])

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia('(min-width: 1024px)'),
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ]

    const updateAnimationAvailability = () => {
      const isDesktop = mediaQueries[0].matches && mediaQueries[1].matches && mediaQueries[2].matches
      const reduceMotion = mediaQueries[3].matches
      setShouldAnimateGlyphs(isDesktop && !reduceMotion)
      setShouldCrossfadeContent(!reduceMotion)
    }

    updateAnimationAvailability()
    mediaQueries.forEach((mq) => mq.addEventListener('change', updateAnimationAvailability))
    return () => mediaQueries.forEach((mq) => mq.removeEventListener('change', updateAnimationAvailability))
  }, [])

  useEffect(() => {
    const onScrollOrResize = () => {
      requestAnimationFrame(captureCurrentGlyphRects)
    }
    const onWillChange = () => {
      captureCurrentGlyphRects()
    }

    captureCurrentGlyphRects()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('phonetics-view-will-change', onWillChange)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('phonetics-view-will-change', onWillChange)
    }
  }, [captureCurrentGlyphRects])

  useLayoutEffect(() => {
    const root = chartRootRef.current
    if (!root) return

    const prevMode = prevViewModeRef.current
    const modeChanged = prevMode !== viewMode
    const snapshot = new Map(glyphRectsRef.current)

    if (shouldAnimateGlyphs && modeChanged && snapshot.size > 0) {
      applyGlyphFlip(root, snapshot, viewMode)
    }

    prevViewModeRef.current = viewMode

    const delayMs = shouldAnimateGlyphs && modeChanged ? GLYPH_FLIP_MS + 50 : 0
    const tid = window.setTimeout(() => {
      captureCurrentGlyphRects()
    }, delayMs)

    return () => clearTimeout(tid)
  }, [viewMode, consonants, activeId, lang, shouldAnimateGlyphs, captureCurrentGlyphRects])

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.reduce<Record<string, Consonant[]>>(
        (acc, cat) => {
          acc[cat] = consonants.filter((c) => c.category === cat)
          return acc
        },
        {},
      ),
    [consonants],
  )

  const activeItem = consonants.find((c) => c._id === activeId) ?? null

  const activeHunminRowTitle = useMemo(() => {
    if (!activeItem) return ''
    const row = HUNMIN_CONSONANT_ROWS.find((r) => hunminRowContainsSymbol(r, activeItem.symbol))
    return row?.title ?? ''
  }, [activeItem])

  function toggle(id: string) {
    setActiveId((prev) => (prev === id ? null : id))
  }

  function renderChartBody() {
    function hunminRenderZone(row: HunminRow, zoneKey: string, segments: HunminSegment[]) {
      return (
        <div className="flex flex-wrap items-end">
          {segments.map((seg, segIdx) => (
            <Fragment key={`${row.id}-${zoneKey}-${seg.label}-${segIdx}`}>
              {segIdx > 0 ? (
                <span
                  className="flex shrink-0 items-center self-stretch px-1.5 text-base text-ink-muted/45 sm:px-2 sm:text-lg"
                  aria-hidden
                >
                  |
                </span>
              ) : null}
              <div className="flex min-w-0 flex-col items-center gap-2">
                {seg.label ? (
                  <span className="w-full px-1 text-center font-sans text-xs leading-snug tracking-wide text-ink-muted sm:text-[13px]">
                    {seg.label}
                  </span>
                ) : null}
                <div className="flex flex-wrap justify-center gap-1">
                  {seg.symbols.map((sym, symIdx) => {
                    const c = findConsonantBySymbol(consonants, sym)
                    const isActive = !!c && activeId === c._id
                    if (!c) {
                      return (
                        <motion.span
                          key={sym}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: Math.min(MORPH_DURATION_SECONDS * 0.65, 1.0),
                            delay: Math.min(symIdx * 0.05, 0.18),
                            ease: MORPH_EASE_BEZIER,
                          }}
                          className="symbol-btn cursor-not-allowed bg-hanji/50 opacity-50"
                          aria-disabled
                        >
                          <span className="symbol-char font-serif text-4xl leading-none text-ink-muted">
                            {sym}
                          </span>
                          <span className="symbol-sub text-ink-muted/60">—</span>
                        </motion.span>
                      )
                    }
                    return (
                      <span
                        key={c._id}
                        data-glyph-flip={sym}
                        data-view-mode="hunmin"
                        className="inline-block align-top"
                      >
                        <motion.button
                          type="button"
                          onClick={() => toggle(c._id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className={`symbol-btn ${isActive ? 'active bg-hanji-hover' : 'hover:bg-hanji-hover'}`}
                          aria-expanded={isActive}
                          aria-label={`${c.name} 상세 보기`}
                        >
                          <span
                            className={`symbol-char font-serif text-4xl leading-none transition-colors ${
                              isActive ? 'text-ink-accent' : 'text-ink'
                            }`}
                          >
                            {c.symbol}
                          </span>
                          <span className="symbol-sub">
                            {c.name.split(' ')[1]?.replace(/[()]/g, '') ?? ''}
                          </span>
                        </motion.button>
                      </span>
                    )
                  })}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )
    }

    function hunminSlotBody(row: HunminRow) {
      const hasActiveInGroup = !!activeItem && hunminRowContainsSymbol(row, activeItem.symbol)
      return (
        <>
          <div
            ref={hasActiveInGroup ? detailScrollRef : undefined}
            className="flex flex-wrap items-end gap-y-5"
            dir={lang === 'ar' ? 'ltr' : undefined}
            lang={lang === 'ar' ? 'ko' : undefined}
          >
            <div className="min-w-0 shrink">
              <HunminZoneHeading title="기본자" />
              {hunminRenderZone(row, 'b', row.basicSegments)}
            </div>
            {row.extendedSegments.length > 0 ? (
              <>
                <div
                  className="mx-10 shrink-0 self-stretch sm:mx-14 md:mx-20"
                  aria-hidden
                />
                <div className="min-w-0 shrink">
                  <HunminZoneHeading title="확장자" />
                  {hunminRenderZone(row, 'x', row.extendedSegments)}
                </div>
              </>
            ) : null}
          </div>

          {row.footnote ? (
            <p className="mt-3 max-w-3xl font-sans text-xs leading-relaxed text-ink-muted">
              {row.footnote}
            </p>
          ) : null}

          <ScrollSection isOpen={hasActiveInGroup}>
            {activeItem && hasActiveInGroup && (
              <div>
                <DetailPanel
                  item={activeItem}
                  lang={lang}
                  animationLabel={m.animationVideo}
                  mriLabel={m.mriVideo}
                  type="consonants"
                  categoryLabel={activeHunminRowTitle}
                  categoryEnLabel=""
                />
              </div>
            )}
          </ScrollSection>
        </>
      )
    }

    function modernSlotBody(category: string) {
      const items = grouped[category]
      const categoryLabel = m.categories[category] ?? category
      const categoryEnLabel = m.categoriesEn[category] ?? ''

      if (!items || items.length === 0) {
        return <p className="font-sans text-sm text-ink-muted">—</p>
      }

      const subGroups = groupByArticulation(items)
      const hasActiveInGroup = items.some((c) => c._id === activeId)

      return (
        <>
          <div
            ref={hasActiveInGroup ? detailScrollRef : undefined}
            className="flex flex-wrap items-center gap-y-3"
            dir={lang === 'ar' ? 'ltr' : undefined}
            lang={lang === 'ar' ? 'ko' : undefined}
          >
            {subGroups.map((subGroup, idx) => (
              <Fragment key={subGroup.group || idx}>
                {idx > 0 && subGroups.length > 1 && (
                  <span
                    className="mx-3 block h-20 w-px shrink-0 bg-hanji-border"
                    aria-hidden="true"
                  />
                )}

                <div className="flex gap-1">
                  {subGroup.items.map((consonant) => {
                    const isActive = activeId === consonant._id
                    return (
                      <span
                        key={consonant._id}
                        data-glyph-flip={consonant.symbol}
                        data-view-mode="modern"
                        className="inline-block align-top"
                      >
                        <motion.button
                          type="button"
                          onClick={() => toggle(consonant._id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className={`symbol-btn ${isActive ? 'active bg-hanji-hover' : 'hover:bg-hanji-hover'}`}
                          aria-expanded={isActive}
                          aria-label={`${consonant.name} 상세 보기`}
                        >
                          <span
                            className={`symbol-char font-serif text-4xl leading-none transition-colors ${
                              isActive ? 'text-ink-accent' : 'text-ink'
                            }`}
                          >
                            {consonant.symbol}
                          </span>
                          <span className="symbol-sub">
                            {consonant.name.split(' ')[1]?.replace(/[()]/g, '') ?? ''}
                          </span>
                        </motion.button>
                      </span>
                    )
                  })}
                </div>
              </Fragment>
            ))}
          </div>

          <ScrollSection isOpen={hasActiveInGroup}>
            {activeItem && hasActiveInGroup && (
              <div>
                <DetailPanel
                  item={activeItem}
                  lang={lang}
                  animationLabel={m.animationVideo}
                  mriLabel={m.mriVideo}
                  type="consonants"
                  categoryLabel={categoryLabel}
                  categoryEnLabel={categoryEnLabel}
                />
              </div>
            )}
          </ScrollSection>
        </>
      )
    }

    return (
      <div ref={chartRootRef} className="space-y-16">
        {[0, 1, 2, 3, 4].map((rowIndex) => {
          const hunminRow = HUNMIN_CONSONANT_ROWS[rowIndex]
          const category = CATEGORY_ORDER[rowIndex]
          const items = grouped[category]
          const categoryLabel = m.categories[category] ?? category
          const categoryEnLabel = m.categoriesEn[category] ?? ''
          const showEnSub = lang !== 'ko' && categoryLabel !== categoryEnLabel
          const isModernEmpty = viewMode === 'modern' && (!items || items.length === 0)

          return (
            <motion.section
              key={`row-slot-${rowIndex}`}
              layout
              transition={ROW_LAYOUT_TRANSITION}
            >
              <motion.div
                layout={false}
                className="mb-4 flex items-baseline gap-4 border-b border-hanji-border pb-2"
              >
                <h3
                  key={`${viewMode}-${rowIndex}`}
                  className={`font-serif text-lg tracking-wide ${
                    viewMode === 'hunmin'
                      ? 'text-ink'
                      : isModernEmpty
                        ? 'text-ink-muted'
                        : 'text-ink'
                  }`}
                >
                  {viewMode === 'hunmin' ? hunminRow.title : categoryLabel}
                </h3>
                {viewMode === 'modern' && items && items.length > 0 ? (
                  showEnSub ? (
                    <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">
                      {categoryEnLabel}
                    </span>
                  ) : (
                    <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">
                      {categoryEnLabel}
                    </span>
                  )
                ) : null}
              </motion.div>

              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={`${viewMode}-row-${rowIndex}`}
                  initial={shouldCrossfadeContent ? { opacity: 0 } : { opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={shouldCrossfadeContent ? { opacity: 0 } : { opacity: 1 }}
                  transition={
                    shouldCrossfadeContent
                      ? {
                          duration: MORPH_DURATION_SECONDS,
                          ease: MORPH_EASE_BEZIER,
                        }
                      : { duration: 0 }
                  }
                >
                  {viewMode === 'hunmin'
                    ? hunminSlotBody(hunminRow)
                    : modernSlotBody(category)}
                </motion.div>
              </AnimatePresence>
            </motion.section>
          )
        })}
      </div>
    )
  }

  return <LayoutGroup id="consonant-chart-layout">{renderChartBody()}</LayoutGroup>
}

interface DetailPanelProps {
  item: Consonant
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  type: 'consonants' | 'vowels'
  categoryLabel: string
  categoryEnLabel: string
}

function DetailPanel({
  item,
  lang,
  animationLabel,
  mriLabel,
  type,
  categoryLabel,
  categoryEnLabel,
}: DetailPanelProps) {
  return (
    <div className="mt-8 pt-8 border-t border-hanji-border">
      <div className="flex items-baseline gap-4 mb-5">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="font-serif text-6xl text-ink leading-none">{item.symbol}</span>
          <div className="h-px w-full bg-hanji-border" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-xl text-ink leading-snug">{item.name}</p>
          <p className="font-sans text-xs text-gold uppercase tracking-widest mt-3">
            {categoryLabel}
            {categoryEnLabel && categoryEnLabel !== categoryLabel ? ` · ${categoryEnLabel}` : ''}
          </p>
        </div>
      </div>

      <TranslatedDescription
        item={item as unknown as { description: string; [key: string]: unknown }}
        lang={lang}
      />

      <div className="mt-6">
        <DualVideoPlayer
          animationFileName={item.animationFileName}
          mriFileName={item.mriFileName}
          type={type}
          animationLabel={animationLabel}
          mriLabel={mriLabel}
        />
      </div>
    </div>
  )
}
