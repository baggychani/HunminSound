'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useScrollToSymbolDetail } from '@/hooks/useScrollToSymbolDetail'
import { usePhoneticsDeepLink } from '@/hooks/usePhoneticsDeepLink'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import { JamoText } from '@/components/ui/JamoText'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import { PhoneticsHaeryeSource } from '@/components/showcase/phonetics/PhoneticsHaeryeSource'
import { SymbolDetailCard } from '@/components/showcase/phonetics/SymbolDetailCard'
import { HunminConsonantZone } from '@/components/showcase/hunmin/HunminConsonantZone'
import { HunminJejahaeRow, HunminJejahaeRowHeading } from '@/components/showcase/hunmin/HunminJejahaeLayout'
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
  variant?: 'default' | 'card'
}

function consonantButtonSubLabel(name: string): string | null {
  const paren = name.match(/\(([^)]*)\)/)
  const raw = (paren?.[1] ?? name.split(' ').slice(1).join(' ')).replace(/[()]/g, '').trim()
  if (!raw) return null
  if (/^[\-—–.]+$/.test(raw)) return null
  return raw
}

function GlyphButton({
  consonant,
  isActive,
  onClick,
  symbolFontClass,
  variant = 'card',
}: GlyphButtonProps) {
  const sub = consonantButtonSubLabel(consonant.name)
  const isCard = variant === 'card'
  const cardClass = isCard ? 'symbol-btn-card' : ''
  return (
    <span className="inline-block align-top">
      <button
        type="button"
        onClick={onClick}
        className={`symbol-btn transition-transform duration-200 ease-out hover:-translate-y-px active:translate-y-0 ${cardClass} ${
          isActive ? 'active' : ''
        } ${isActive && !isCard ? 'bg-hanji-hover' : ''} ${!isCard ? 'hover:bg-hanji-hover' : ''}`}
        aria-expanded={isActive}
        aria-label={`${consonant.name} 상세 보기`}
      >
        {isCard ? <span aria-hidden className="symbol-card-dot" /> : null}
        <span
          className={`symbol-char ${symbolFontClass} leading-none ${
            isCard ? '' : 'transition-colors'
          } ${isCard ? 'text-[1.85rem] sm:text-[2rem]' : 'text-4xl'} ${
            isCard ? '' : isActive ? 'text-ink-accent' : 'text-ink'
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
    <span
      className="symbol-btn symbol-btn-card is-disabled is-muted cursor-not-allowed"
      aria-disabled
    >
      <span className={`symbol-char ${symbolFontClass} text-4xl leading-none`}>{symbol}</span>
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
  pictogramLabel: string
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
  pictogramLabel,
  onToggle,
  onBasicColumnWidth,
  basicColumnMinWidthPx,
}: HunminRowBodyProps) {
  const hasActive = !!activeItem && hunminRowContainsSymbol(row, activeItem.symbol)
  const hasExtended = row.extendedSegments.length > 0

  return (
    <div>
      <HunminJejahaeRow
        scrollRef={hasActive ? detailScrollRef : undefined}
        dir={lang === 'ar' ? 'ltr' : undefined}
        lang={lang === 'ar' ? 'ko' : undefined}
        basicColumnMinWidthPx={basicColumnMinWidthPx}
        rowIndex={rowIndex}
        onBasicColumnWidth={onBasicColumnWidth}
        showSecondaryZone={hasExtended}
        basicLabel="기본자"
        secondaryLabel="확장자"
        basic={
          <HunminConsonantZone
            row={row}
            zoneKey="b"
            segments={row.basicSegments}
            renderGlyphs={(seg, segIdx, groupKey) => (
              <>
                {seg.symbols.map((sym) => {
                  const c = findConsonantBySymbol(consonants, sym)
                  if (!c)
                    return <GlyphPlaceholder key={`${groupKey}-${sym}`} symbol={sym} symbolFontClass="font-jamo" />
                  return (
                    <GlyphButton
                      key={c._id}
                      consonant={c}
                      isActive={activeId === c._id}
                      onClick={() => onToggle(c._id)}
                      symbolFontClass="font-jamo"
                    />
                  )
                })}
              </>
            )}
          />
        }
        secondary={
          hasExtended ? (
            <HunminConsonantZone
              row={row}
              zoneKey="x"
              segments={row.extendedSegments}
              renderGlyphs={(seg, segIdx, groupKey) => (
                <>
                  {seg.symbols.map((sym) => {
                    const c = findConsonantBySymbol(consonants, sym)
                    if (!c)
                      return <GlyphPlaceholder key={`${groupKey}-${sym}`} symbol={sym} symbolFontClass="font-jamo" />
                    return (
                      <GlyphButton
                        key={c._id}
                        consonant={c}
                        isActive={activeId === c._id}
                        onClick={() => onToggle(c._id)}
                        symbolFontClass="font-jamo"
                      />
                    )
                  })}
                </>
              )}
            />
          ) : null
        }
      />
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
              pictogramLabel={pictogramLabel}
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
  pictogramLabel: string
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
  pictogramLabel,
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
              <span className="mx-3 block h-[4.625rem] w-px shrink-0 bg-hanji-border sm:h-[4.875rem]" aria-hidden="true" />
            )}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {subGroup.items.map((consonant) => (
                <GlyphButton
                  key={consonant._id}
                  consonant={consonant}
                  isActive={activeId === consonant._id}
                  onClick={() => onToggle(consonant._id)}
                  symbolFontClass="font-serif"
                  variant="card"
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
              pictogramLabel={pictogramLabel}
              type="consonants"
              categoryLabel={categoryLabel}
              categoryEnLabel={categoryEnLabel}
              symbolFontClass="font-serif"
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
  usePhoneticsDeepLink(consonants, setActiveId)
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

  const chartFadeStyle = {
    opacity: chartOpacity,
    transition: `opacity ${chartOpacity === 0 ? CHART_FADE_OUT_MS : CHART_FADE_IN_MS}ms ease-out`,
  }

  return (
    <div>
      <div
        className={displayMode === 'hunmin' ? 'space-y-24' : 'space-y-16'}
        style={chartFadeStyle}
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
            {displayMode === 'hunmin' ? (
              <HunminJejahaeRowHeading
                title={titleText}
                index={rowIndex}
                classicLabel={hunminClassicLabel}
              />
            ) : (
            <div className="mb-4">
              {!isEmpty ? (
                <p
                  aria-hidden
                  className="mb-2 flex items-center gap-2.5 font-sans text-[10.5px] tracking-[0.28em] text-gold"
                >
                  <span className="h-px w-5 bg-gold/50" />
                  {String(rowIndex + 1).padStart(2, '0')}
                </p>
              ) : null}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3
                  className={`font-serif text-xl tracking-wide ${isEmpty ? 'text-ink-muted' : 'text-ink'}`}
                >
                  {titleText}
                </h3>
                {!isEmpty && categoryEnLabel ? (
                  <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">
                    {categoryEnLabel}
                  </span>
                ) : null}
              </div>
              <div
                aria-hidden
                className="mt-2.5 h-px w-full bg-gradient-to-r from-gold/40 via-hanji-border to-hanji-border/30"
              />
            </div>
            )}

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
                pictogramLabel={m.pictogramVideo}
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
                pictogramLabel={m.pictogramVideo}
                onToggle={toggle}
              />
            )}
          </section>
        )
      })}
      </div>
      {displayMode === 'hunmin' ? (
        <div style={chartFadeStyle}>
          <PhoneticsHaeryeSource kind="consonants" />
        </div>
      ) : null}
    </div>
  )
}

interface DetailPanelProps {
  item: Consonant
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  pictogramLabel: string
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
  pictogramLabel,
  type,
  categoryLabel,
  categoryEnLabel,
  symbolFontClass,
}: DetailPanelProps) {
  return (
    <SymbolDetailCard
      symbol={item.symbol}
      symbolFontClass={symbolFontClass}
      header={
        <>
          <p className="font-serif text-lg leading-snug text-ink sm:text-xl">
            <JamoText text={item.name} />
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/[0.07] px-3 py-1 font-sans text-[11px] uppercase tracking-[0.14em] text-gold">
              <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />
              {categoryLabel}
            </span>
            {categoryEnLabel && categoryEnLabel !== categoryLabel ? (
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-ink-muted/80">
                {categoryEnLabel}
              </span>
            ) : null}
          </p>
        </>
      }
    >
      <TranslatedDescription
        item={item as unknown as { description: string; [key: string]: unknown }}
        lang={lang}
        phonemeType="consonant"
      />
      <div className="mt-6">
        <DualVideoPlayer
          animationFileName={item.animationFileName}
          mriFileName={item.mriFileName}
          pictogramFileName={item.pictogramFileName}
          type={type}
          animationLabel={animationLabel}
          mriLabel={mriLabel}
          pictogramLabel={pictogramLabel}
        />
      </div>
    </SymbolDetailCard>
  )
}
