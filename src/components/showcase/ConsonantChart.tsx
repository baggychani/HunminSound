'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useScrollToSymbolDetail } from '@/hooks/useScrollToSymbolDetail'
import { usePhoneticsDeepLink } from '@/hooks/usePhoneticsDeepLink'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { CompareCatalogProvider, toCompareLetter } from '@/components/showcase/phonetics/CompareOverlay'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import { PhoneticsHaeryeSource } from '@/components/showcase/phonetics/PhoneticsHaeryeSource'
import { SymbolDetailCard } from '@/components/showcase/phonetics/SymbolDetailCard'
import { SymbolDetailName } from '@/components/showcase/phonetics/SymbolDetailName'
import { HunminConsonantTable } from '@/components/showcase/hunmin/HunminConsonantTable'
import { HUNMIN_CONSONANT_ROWS, hunminRowContainsSymbol } from '@/data/hunminConsonantLayout'
import { hunminChartLabel } from '@/data/hunminChart-i18n'
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
  const { activeId, toggle } = usePhoneticsDeepLink(consonants)
  const detailScrollRef = useScrollToSymbolDetail(activeId)
  const { lang } = useLang()
  const m = getMessages(lang)

  /** 실제로 그리는 모드 — 페이드아웃 끝난 뒤에만 viewMode와 동기 */
  const [displayMode, setDisplayMode] = useState<ChartViewMode>(viewMode)
  const [chartOpacity, setChartOpacity] = useState(1)
  const fadeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    // 페이드 도중 원래 보기로 돌아오면 타이머가 지워지고, 투명도 0인 채로 이 분기에 걸린다
    if (viewMode === displayMode) {
      setChartOpacity(1)
      return
    }

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
    return hunminChartLabel(lang, row?.title ?? '')
  }, [activeItem, lang])

  const chartFadeStyle = {
    opacity: chartOpacity,
    transition: `opacity ${chartOpacity === 0 ? CHART_FADE_OUT_MS : CHART_FADE_IN_MS}ms ease-out`,
  }

  const compareLetters = useMemo(() => consonants.map(toCompareLetter), [consonants])

  return (
    <CompareCatalogProvider letters={compareLetters}>
    <div>
      {displayMode === 'hunmin' ? (
        <div style={chartFadeStyle}>
          <HunminConsonantTable
            consonants={consonants}
            activeId={activeId}
            onToggle={toggle}
            detailScrollRef={detailScrollRef}
            lang={lang}
            classicLabelByRowId={HUNMIN_CLASSIC_LABEL_BY_ROW_ID}
            renderDetail={() =>
              activeItem ? (
                <DetailPanel
                  item={activeItem}
                  lang={lang}
                  animationLabel={m.animationVideo}
                  mriLabel={m.mriVideo}
                  pictogramLabel={m.pictogramVideo}
                  type="consonants"
                  categoryLabel={activeHunminRowTitle}
                  categoryEnLabel=""
                  symbolFontClass="font-jamo"
                />
              ) : null
            }
          />
          <PhoneticsHaeryeSource kind="consonants" />
        </div>
      ) : (
        <>
          <div className="space-y-16" style={chartFadeStyle}>
            {CATEGORY_ORDER.map((category) => {
              const items = grouped[category]
              const categoryLabel = m.categories[category] ?? category
              const categoryEnLabel = m.categoriesEn[category] ?? ''
              const isEmpty = !items || items.length === 0

              return (
                <section key={category} className="relative">
                  <div className="mb-4">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className={`font-serif text-xl ${isEmpty ? 'text-ink-muted' : 'text-ink'}`}>
                        {categoryLabel}
                      </h3>
                      {!isEmpty && categoryEnLabel && categoryEnLabel !== categoryLabel ? (
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
                </section>
              )
            })}
          </div>
          <div
            aria-hidden
            className={`overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.04,0.62,0.23,0.98)] ${
              activeItem?.category === CATEGORY_ORDER[CATEGORY_ORDER.length - 1] ? 'h-0' : 'h-24'
            }`}
          />
        </>
      )}
    </div>
    </CompareCatalogProvider>
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
            <SymbolDetailName name={item.name} />
          </p>
          <p className="mt-1.5 flex flex-wrap items-baseline gap-1.5 font-sans text-[13px]">
            <span className="font-medium text-gold">{categoryLabel}</span>
            {categoryEnLabel && categoryEnLabel !== categoryLabel ? (
              <>
                <span aria-hidden className="text-ink-muted/40">·</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                  {categoryEnLabel}
                </span>
              </>
            ) : null}
          </p>
        </>
      }
    >
      <DualVideoPlayer
        key={item._id}
        animationFileName={item.animationFileName}
        mriFileName={item.mriFileName}
        pictogramFileName={item.pictogramFileName}
        type={type}
        animationLabel={animationLabel}
        mriLabel={mriLabel}
        pictogramLabel={pictogramLabel}
        compareLetter={toCompareLetter(item)}
      />
      <div className="mt-6 rounded-[3px] border border-[#e3d5c0] bg-[#f4ecdf] px-4 py-4 dark:border-white/10 dark:bg-white/[0.05] sm:px-5 sm:py-4">
        <TranslatedDescription
          item={item as unknown as { description: string; [key: string]: unknown }}
          lang={lang}
          phonemeType="consonant"
          className="font-sans text-sm leading-loose text-ink-soft"
        />
      </div>
    </SymbolDetailCard>
  )
}
