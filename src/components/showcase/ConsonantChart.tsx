'use client'

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useScrollToSymbolDetail } from '@/hooks/useScrollToSymbolDetail'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import { JamoText } from '@/components/ui/JamoText'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import {
  consonantSegmentSeparatorKind,
  HUNMIN_GLYPH_RAIL_CLASS,
  HUNMIN_LABEL_BLOCK_CLASS,
  HunminBetweenSeparator,
  HunminZoneHeading,
} from '@/components/showcase/hunmin/HunminChartParts'
import {
  HUNMIN_CONSONANT_ROWS,
  hunminRowContainsSymbol,
  type HunminRow,
  type HunminSegment,
} from '@/data/hunminConsonantLayout'
import type { Consonant } from '@/types'

const CATEGORY_ORDER = ['파열음', '마찰음', '파찰음', '비음', '유음']

/** 해례 오음 행 id → 한자 부제 (현대 모드의 영문 부제와 같은 위치) */
const HUNMIN_CLASSIC_LABEL_BY_ROW_ID: Record<string, string> = {
  aram: '牙音',
  seol: '舌音',
  sun: '唇音',
  chi: '齒音',
  hu: '喉音',
}

/** 토글 시 차트 전체: 먼저 사라졌다가 새 모드로 나타남 (ms) */
const CHART_FADE_OUT_MS = 220
const CHART_FADE_IN_MS = 220

interface GlyphButtonProps {
  consonant: Consonant
  isActive: boolean
  onClick: () => void
  symbolFontClass: string
}

function consonantButtonSubLabel(name: string): string | null {
  const paren = name.match(/\(([^)]*)\)/)
  const raw = (paren?.[1] ?? name.split(' ').slice(1).join(' ')).replace(/[()]/g, '').trim()
  if (!raw) return null
  if (/^[\-—–.]+$/.test(raw)) return null
  return raw
}

function GlyphButton({ consonant, isActive, onClick, symbolFontClass }: GlyphButtonProps) {
  const sub = consonantButtonSubLabel(consonant.name)
  return (
    <span className="inline-block align-top">
      <button
        type="button"
        onClick={onClick}
        className={`symbol-btn transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
          isActive ? 'active bg-hanji-hover' : 'hover:bg-hanji-hover'
        }`}
        aria-expanded={isActive}
        aria-label={`${consonant.name} 상세 보기`}
      >
        <span
          className={`symbol-char ${symbolFontClass} text-4xl leading-none transition-colors ${
            isActive ? 'text-ink-accent' : 'text-ink'
          }`}
        >
          {consonant.symbol}
        </span>
        <span
          className={`symbol-sub ${sub ? '' : 'invisible'}`}
          aria-hidden={sub ? undefined : true}
        >
          {sub ?? '\u00a0'}
        </span>
      </button>
    </span>
  )
}

function GlyphPlaceholder({ symbol, symbolFontClass }: { symbol: string; symbolFontClass: string }) {
  return (
    <span className="symbol-btn cursor-not-allowed bg-hanji/50 opacity-50" aria-disabled>
      <span className={`symbol-char ${symbolFontClass} text-4xl leading-none text-ink-muted`}>{symbol}</span>
      <span className="symbol-sub invisible select-none" aria-hidden>
        {'\u00a0'}
      </span>
    </span>
  )
}

function groupByArticulation(items: Consonant[]): { group: string; items: Consonant[] }[] {
  const result: { group: string; items: Consonant[] }[] = []
  for (const item of items) {
    const key = item.articulationGroup ?? ''
    const existing = result.find((g) => g.group === key)
    if (existing) existing.items.push(item)
    else result.push({ group: key, items: [item] })
  }
  return result
}

function findConsonantBySymbol(consonants: Consonant[], symbol: string): Consonant | undefined {
  return consonants.find((c) => c.symbol === symbol)
}

interface HunminRowBodyProps {
  row: HunminRow
  rowIndex: number
  consonants: Consonant[]
  activeId: string | null
  activeItem: Consonant | null
  activeHunminRowTitle: string
  detailScrollRef: RefObject<HTMLDivElement>
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  onToggle: (id: string) => void
  /** 기본자 열 너비 보고 → 다섯 줄에서 확장자 시작 세로 정렬 */
  onBasicColumnWidth: (rowIndex: number, widthPx: number) => void
  /** 측정된 최대 기본자 열 너비(모든 행 동일 min-width) */
  basicColumnMinWidthPx: number
}

function HunminRowBody({
  row,
  rowIndex,
  consonants,
  activeId,
  activeItem,
  activeHunminRowTitle,
  detailScrollRef,
  lang,
  animationLabel,
  mriLabel,
  onToggle,
  onBasicColumnWidth,
  basicColumnMinWidthPx,
}: HunminRowBodyProps) {
  const hasActive = !!activeItem && hunminRowContainsSymbol(row, activeItem.symbol)
  const basicColRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = basicColRef.current
    if (!el) return
    const report = () => onBasicColumnWidth(rowIndex, el.getBoundingClientRect().width)
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [rowIndex, onBasicColumnWidth, row.basicSegments, row.extendedSegments, consonants])

  return (
    <div>
      <div
        ref={hasActive ? detailScrollRef : undefined}
        className="flex flex-wrap items-end gap-y-5"
        dir={lang === 'ar' ? 'ltr' : undefined}
        lang={lang === 'ar' ? 'ko' : undefined}
      >
        <div
          ref={basicColRef}
          className="min-w-0 shrink"
          style={basicColumnMinWidthPx > 0 ? { minWidth: basicColumnMinWidthPx } : undefined}
        >
          <HunminZoneHeading title="기본자" />
          <HunminZone
            row={row}
            zoneKey="b"
            segments={row.basicSegments}
            consonants={consonants}
            activeId={activeId}
            onToggle={onToggle}
            symbolFontClass="font-jamo"
          />
        </div>
        {row.extendedSegments.length > 0 && (
          <>
            <div className="mx-10 shrink-0 sm:mx-14 md:mx-20" aria-hidden />
            <div className="min-w-0 shrink">
              <HunminZoneHeading title="확장자" />
              <HunminZone
                row={row}
                zoneKey="x"
                segments={row.extendedSegments}
                consonants={consonants}
                activeId={activeId}
                onToggle={onToggle}
                symbolFontClass="font-jamo"
              />
            </div>
          </>
        )}
      </div>
      {row.footnote && (
        <p className="mt-3 max-w-3xl font-sans text-xs leading-relaxed text-ink-muted">
          <JamoText text={row.footnote} />
        </p>
      )}
      <ScrollSection isOpen={hasActive}>
        {activeItem && hasActive && (
          <div>
            <DetailPanel
              item={activeItem}
              lang={lang}
              animationLabel={animationLabel}
              mriLabel={mriLabel}
              type="consonants"
              categoryLabel={activeHunminRowTitle}
              categoryEnLabel=""
              symbolFontClass="font-jamo"
            />
          </div>
        )}
      </ScrollSection>
    </div>
  )
}

interface HunminZoneProps {
  row: HunminRow
  zoneKey: string
  segments: HunminSegment[]
  consonants: Consonant[]
  activeId: string | null
  onToggle: (id: string) => void
  symbolFontClass: string
}

function HunminZone({
  row,
  zoneKey,
  segments,
  consonants,
  activeId,
  onToggle,
  symbolFontClass,
}: HunminZoneProps) {
  return (
    <div className="flex flex-wrap items-end">
      {segments.map((seg, segIdx) => (
        <Fragment key={`${row.id}-${zoneKey}-${seg.label}-${segIdx}`}>
          {segIdx > 0 && (
            <HunminBetweenSeparator
              kind={consonantSegmentSeparatorKind(segments[segIdx - 1], seg)}
            />
          )}
          <div className="flex min-w-0 flex-col items-center">
            <div className={HUNMIN_LABEL_BLOCK_CLASS}>
              {seg.label ? (
                <span className="font-sans text-xs leading-snug tracking-wide text-ink-muted sm:text-[13px]">
                  {seg.label}
                </span>
              ) : null}
            </div>
            <div className={`${HUNMIN_GLYPH_RAIL_CLASS} flex-wrap justify-center gap-1`}>
              {seg.symbols.map((sym) => {
                const c = findConsonantBySymbol(consonants, sym)
                if (!c) return <GlyphPlaceholder key={sym} symbol={sym} symbolFontClass={symbolFontClass} />
                return (
                  <GlyphButton
                    key={c._id}
                    consonant={c}
                    isActive={activeId === c._id}
                    onClick={() => onToggle(c._id)}
                    symbolFontClass={symbolFontClass}
                  />
                )
              })}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

interface ModernRowBodyProps {
  category: string
  items: Consonant[] | undefined
  categoryLabel: string
  categoryEnLabel: string
  activeId: string | null
  activeItem: Consonant | null
  detailScrollRef: RefObject<HTMLDivElement>
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  onToggle: (id: string) => void
}

function ModernRowBody({
  items,
  categoryLabel,
  categoryEnLabel,
  activeId,
  activeItem,
  detailScrollRef,
  lang,
  animationLabel,
  mriLabel,
  onToggle,
}: ModernRowBodyProps) {
  if (!items || items.length === 0) {
    return <p className="font-sans text-sm text-ink-muted">—</p>
  }

  const subGroups = groupByArticulation(items)
  const hasActive = items.some((c) => c._id === activeId)

  return (
    <div>
      <div
        ref={hasActive ? detailScrollRef : undefined}
        className="flex flex-wrap items-center gap-y-3"
        dir={lang === 'ar' ? 'ltr' : undefined}
        lang={lang === 'ar' ? 'ko' : undefined}
      >
        {subGroups.map((subGroup, idx) => (
          <Fragment key={subGroup.group || idx}>
            {idx > 0 && subGroups.length > 1 && (
              <span className="mx-3 block h-20 w-px shrink-0 bg-hanji-border" aria-hidden="true" />
            )}
            <div className="flex gap-1">
              {subGroup.items.map((consonant) => (
                <GlyphButton
                  key={consonant._id}
                  consonant={consonant}
                  isActive={activeId === consonant._id}
                  onClick={() => onToggle(consonant._id)}
                  symbolFontClass="font-dogseo-text"
                />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
      <ScrollSection isOpen={hasActive}>
        {activeItem && hasActive && (
          <div>
            <DetailPanel
              item={activeItem}
              lang={lang}
              animationLabel={animationLabel}
              mriLabel={mriLabel}
              type="consonants"
              categoryLabel={categoryLabel}
              categoryEnLabel={categoryEnLabel}
              symbolFontClass="font-dogseo-text"
            />
          </div>
        )}
      </ScrollSection>
    </div>
  )
}

interface ConsonantChartProps {
  consonants: Consonant[]
  viewMode?: ChartViewMode
}

export function ConsonantChart({ consonants, viewMode = 'modern' }: ConsonantChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const detailScrollRef = useScrollToSymbolDetail(activeId)
  const { lang } = useLang()
  const m = getMessages(lang)

  /** 실제로 그리는 모드 — 페이드아웃 끝난 뒤에만 viewMode와 동기 */
  const [displayMode, setDisplayMode] = useState<ChartViewMode>(viewMode)
  const [chartOpacity, setChartOpacity] = useState(1)
  const fadeTimerRef = useRef<number | null>(null)
  /** 훈민 모드: 각 행 기본자 열 너비 → max를 모든 행에 min-width로 적용해 확장자 시작선 정렬 */
  const hunminBasicWidthsRef = useRef<[number, number, number, number, number]>([0, 0, 0, 0, 0])
  const [hunminBasicColMinPx, setHunminBasicColMinPx] = useState(0)

  const onHunminBasicColumnWidth = useCallback((rowIndex: number, widthPx: number) => {
    if (rowIndex < 0 || rowIndex > 4) return
    const next = [...hunminBasicWidthsRef.current] as [number, number, number, number, number]
    next[rowIndex] = widthPx
    hunminBasicWidthsRef.current = next
    setHunminBasicColMinPx(Math.max(...next))
  }, [])

  useEffect(() => {
    if (displayMode !== 'hunmin') {
      hunminBasicWidthsRef.current = [0, 0, 0, 0, 0]
      setHunminBasicColMinPx(0)
    }
  }, [displayMode])

  useEffect(() => {
    if (viewMode === displayMode) return

    setActiveId(null)

    if (typeof window === 'undefined') return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplayMode(viewMode)
      setChartOpacity(1)
      return
    }

    if (fadeTimerRef.current !== null) window.clearTimeout(fadeTimerRef.current)

    setChartOpacity(0)

    fadeTimerRef.current = window.setTimeout(() => {
      fadeTimerRef.current = null
      setDisplayMode(viewMode)
      window.requestAnimationFrame(() => {
        setChartOpacity(1)
      })
    }, CHART_FADE_OUT_MS)

    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }
  }, [viewMode, displayMode])

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.reduce<Record<string, Consonant[]>>((acc, cat) => {
        acc[cat] = consonants.filter((c) => c.category === cat)
        return acc
      }, {}),
    [consonants],
  )

  const activeItem = consonants.find((c) => c._id === activeId) ?? null

  const activeHunminRowTitle = useMemo(() => {
    if (!activeItem) return ''
    const row = HUNMIN_CONSONANT_ROWS.find((r) => hunminRowContainsSymbol(r, activeItem.symbol))
    return row?.title ?? ''
  }, [activeItem])

  const toggle = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div
      className="space-y-16"
      style={{
        opacity: chartOpacity,
        transition: `opacity ${chartOpacity === 0 ? CHART_FADE_OUT_MS : CHART_FADE_IN_MS}ms ease-out`,
      }}
    >
      {[0, 1, 2, 3, 4].map((rowIndex) => {
        const hunminRow = HUNMIN_CONSONANT_ROWS[rowIndex]
        const category = CATEGORY_ORDER[rowIndex]
        const items = grouped[category]
        const categoryLabel = m.categories[category] ?? category
        const categoryEnLabel = m.categoriesEn[category] ?? ''
        const isEmpty = displayMode === 'modern' && (!items || items.length === 0)
        const titleText = displayMode === 'hunmin' ? hunminRow.title : categoryLabel
        const hunminClassicLabel = HUNMIN_CLASSIC_LABEL_BY_ROW_ID[hunminRow.id]

        return (
          <section key={`row-${rowIndex}`} className="relative">
            <div className="mb-4">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3
                  className={`text-lg tracking-wide ${
                    displayMode === 'hunmin' ? 'font-jamo' : 'font-serif'
                  } ${isEmpty ? 'text-ink-muted' : 'text-ink'}`}
                >
                  {titleText}
                </h3>
                {displayMode === 'hunmin' && hunminClassicLabel ? (
                  <span className="font-serif text-sm tracking-wide text-ink-muted sm:text-[15px]">
                    {hunminClassicLabel}
                  </span>
                ) : null}
                {displayMode === 'modern' && !isEmpty && categoryEnLabel ? (
                  <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">
                    {categoryEnLabel}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 h-px w-full bg-hanji-border" aria-hidden />
            </div>

            {displayMode === 'hunmin' ? (
              <HunminRowBody
                row={hunminRow}
                rowIndex={rowIndex}
                consonants={consonants}
                activeId={activeId}
                activeItem={activeItem}
                activeHunminRowTitle={activeHunminRowTitle}
                detailScrollRef={detailScrollRef}
                lang={lang}
                animationLabel={m.animationVideo}
                mriLabel={m.mriVideo}
                onToggle={toggle}
                onBasicColumnWidth={onHunminBasicColumnWidth}
                basicColumnMinWidthPx={hunminBasicColMinPx}
              />
            ) : (
              <ModernRowBody
                category={category}
                items={items}
                categoryLabel={categoryLabel}
                categoryEnLabel={categoryEnLabel}
                activeId={activeId}
                activeItem={activeItem}
                detailScrollRef={detailScrollRef}
                lang={lang}
                animationLabel={m.animationVideo}
                mriLabel={m.mriVideo}
                onToggle={toggle}
              />
            )}
          </section>
        )
      })}
    </div>
  )
}

interface DetailPanelProps {
  item: Consonant
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  type: 'consonants' | 'vowels'
  categoryLabel: string
  categoryEnLabel: string
  symbolFontClass: string
}

function DetailPanel({
  item,
  lang,
  animationLabel,
  mriLabel,
  type,
  categoryLabel,
  categoryEnLabel,
  symbolFontClass,
}: DetailPanelProps) {
  return (
    <div className="mt-8 pt-8 border-t border-hanji-border">
      <div className="flex items-baseline gap-4 mb-5">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className={`${symbolFontClass} text-6xl text-ink leading-none`}>{item.symbol}</span>
          <div className="h-px w-full bg-hanji-border" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-xl text-ink leading-snug">
            <JamoText text={item.name} />
          </p>
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
