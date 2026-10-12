'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useScrollToSymbolDetail } from '@/hooks/useScrollToSymbolDetail'
import { usePhoneticsDeepLink } from '@/hooks/usePhoneticsDeepLink'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import { TranslatedVowelArticulation } from '@/components/showcase/TranslatedVowelArticulation'
import { VOWEL_ARTICULATION_KO } from '@/lib/vowelArticulation'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import { HUNMIN_VOWEL_CARD_CHAR_CLASS } from '@/components/showcase/hunmin/HunminVowelZone'
import { HunminCheonJiInBanner } from '@/components/showcase/hunmin/HunminCheonJiInBanner'
import { HunminVowelTable } from '@/components/showcase/hunmin/HunminVowelTable'
import { PhoneticsHaeryeSource } from '@/components/showcase/phonetics/PhoneticsHaeryeSource'
import { SymbolDetailCard } from '@/components/showcase/phonetics/SymbolDetailCard'
import { SymbolDetailName } from '@/components/showcase/phonetics/SymbolDetailName'
import {
  HUNMIN_VOWEL_ROWS,
  hunminVowelRowContainsSymbol,
} from '@/data/hunminVowelLayout'
import type { Vowel } from '@/types'

/** ??? ?? ?? ? ?? ?: ???, ???? */
const VOWEL_CAT_MONO = '\uB2E8\uBAA8\uC74C'
const VOWEL_CAT_DIPHTH = '\uC774\uC911\uBAA8\uC74C'
const CATEGORY_ORDER = [VOWEL_CAT_MONO, VOWEL_CAT_DIPHTH] as const
const CHART_FADE_OUT_MS = 220
const CHART_FADE_IN_MS = 220

interface VowelChartProps {
  vowels: Vowel[]
  viewMode?: ChartViewMode
}

interface GlyphButtonProps {
  vowel: Vowel
  isActive: boolean
  onClick: () => void
  symbolFontClass: string
  variant?: 'default' | 'card'
  /** 훈민 차트 — 중세 IPA 등. 없으면 vowel.name에서 추출 */
  subLabel?: string | null
}

function vowelButtonSubLabel(name: string): string | null {
  const paren = name.match(/\(([^)]*)\)/)
  const raw = (paren?.[1] ?? name.split(' ').slice(1).join(' ')).replace(/[()]/g, '').trim()
  if (raw && !/^[\-?.]+$/.test(raw)) return raw
  const beforeParen = name.replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (beforeParen && beforeParen !== name) return beforeParen
  return null
}

function GlyphButton({
  vowel,
  isActive,
  onClick,
  symbolFontClass,
  variant = 'card',
  subLabel: subLabelOverride,
}: GlyphButtonProps) {
  const sub = subLabelOverride ?? vowelButtonSubLabel(vowel.name)
  const isCard = variant === 'card'
  const cardClass = isCard ? 'symbol-btn-card' : 'symbol-btn-hunmin'
  return (
    <span className="inline-block align-top">
      <button
        type="button"
        onClick={onClick}
        className={`symbol-btn transition-transform duration-200 ease-out hover:-translate-y-px active:translate-y-0 ${cardClass} ${
          isActive ? 'active' : ''
        } ${isActive && !isCard ? 'bg-hanji-hover' : ''} ${!isCard ? 'hover:bg-hanji-hover' : ''}`}
        aria-expanded={isActive}
        aria-label={`${vowel.name} \uC0C1\uC138 \uBCF4\uAE30`}
      >
        {isCard ? <span aria-hidden className="symbol-card-dot" /> : null}
        <span
          className={`symbol-char ${symbolFontClass} leading-none ${
            isCard ? '' : 'transition-colors'
          } ${isCard ? HUNMIN_VOWEL_CARD_CHAR_CLASS : 'text-4xl'} ${
            isCard ? '' : isActive ? 'text-ink-accent' : 'text-ink'
          }`}
        >
          {vowel.symbol}
        </span>
        <span className={`symbol-sub ${sub ? '' : 'invisible'} ${subLabelOverride ? 'hunmin-vowel-ipa' : ''}`} aria-hidden={sub ? undefined : true}>
          {sub ?? '\u00a0'}
        </span>
      </button>
    </span>
  )
}


interface ModernVowelSectionProps {
  category: (typeof CATEGORY_ORDER)[number]
  items: Vowel[] | undefined
  categoryLabel: string
  categoryEnLabel: string
  categoryDesc: string
  activeId: string | null
  activeItem: Vowel | null
  detailScrollRef: RefObject<HTMLDivElement>
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  pictogramLabel: string
  onToggle: (id: string) => void
}

function ModernVowelSection({
  category,
  items,
  categoryLabel,
  categoryEnLabel,
  categoryDesc,
  activeId,
  activeItem,
  detailScrollRef,
  lang,
  animationLabel,
  mriLabel,
  pictogramLabel,
  onToggle,
}: ModernVowelSectionProps) {
  if (!items || items.length === 0) return null

  const hasActive = items.some((v) => v._id === activeId)

  return (
    <section>
      <div className="mb-8">
        <div className="flex items-baseline gap-4">
          <h3 className="font-serif text-xl text-ink">{categoryLabel}</h3>
          {categoryEnLabel && categoryEnLabel !== categoryLabel ? (
            <span className="font-sans text-xs text-ink-muted tracking-widest uppercase">{categoryEnLabel}</span>
          ) : null}
        </div>
        <p className="font-sans text-xs text-ink-muted mt-2.5">{categoryDesc}</p>
        <div
          aria-hidden
          className="mt-3 h-px w-full bg-gradient-to-r from-gold/40 via-hanji-border to-hanji-border/30"
        />
      </div>

      <div
        ref={hasActive ? detailScrollRef : undefined}
        className="flex flex-wrap gap-2 sm:gap-3"
        dir={lang === 'ar' ? 'ltr' : undefined}
        lang={lang === 'ar' ? 'ko' : undefined}
      >
        {items.map((vowel) => (
          <GlyphButton
            key={vowel._id}
            vowel={vowel}
            isActive={activeId === vowel._id}
            onClick={() => onToggle(vowel._id)}
            symbolFontClass="font-serif"
            variant="card"
          />
        ))}
      </div>

      <ScrollSection isOpen={hasActive}>
        {activeItem && hasActive && (
          <div>
            <VowelDetailPanel
              item={activeItem}
              lang={lang}
              animationLabel={animationLabel}
              mriLabel={mriLabel}
              pictogramLabel={pictogramLabel}
              categoryLabel={categoryLabel}
              vowelArticulationSymbol={
                category === VOWEL_CAT_MONO && activeItem.symbol in VOWEL_ARTICULATION_KO
                  ? activeItem.symbol
                  : undefined
              }
            />
          </div>
        )}
      </ScrollSection>
    </section>
  )
}

export function VowelChart({ vowels, viewMode = 'modern' }: VowelChartProps) {
  const { activeId, toggle } = usePhoneticsDeepLink(vowels)
  const detailScrollRef = useScrollToSymbolDetail(activeId)
  const { lang } = useLang()
  const m = getMessages(lang)

  const [displayMode, setDisplayMode] = useState<ChartViewMode>(viewMode)
  const [chartOpacity, setChartOpacity] = useState(1)
  const fadeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (viewMode === displayMode) return

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
      CATEGORY_ORDER.reduce<Record<string, Vowel[]>>((acc, cat) => {
        acc[cat] = vowels.filter((v) => v.category === cat)
        return acc
      }, {}),
    [vowels],
  )

  const activeItem = vowels.find((v) => v._id === activeId) ?? null

  const activeHunminRowTitle = useMemo(() => {
    if (!activeItem) return ''
    const row = HUNMIN_VOWEL_ROWS.find((r) => hunminVowelRowContainsSymbol(r, activeItem.symbol))
    return row?.title ?? ''
  }, [activeItem])

  const categoryDesc: Record<(typeof CATEGORY_ORDER)[number], string> = {
    [VOWEL_CAT_MONO]: m.monophthongDesc,
    [VOWEL_CAT_DIPHTH]: m.diphthongDesc,
  }

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
      {displayMode === 'hunmin' ? (
        <div>
          <HunminCheonJiInBanner />
          <div className="mt-12">
            <HunminVowelTable
              vowels={vowels}
              activeId={activeId}
              onToggle={toggle}
              detailScrollRef={detailScrollRef}
              lang={lang}
              renderDetail={() =>
                activeItem ? (
                  <VowelDetailPanel
                    item={activeItem}
                    lang={lang}
                    animationLabel={m.animationVideo}
                    mriLabel={m.mriVideo}
                    pictogramLabel={m.pictogramVideo}
                    categoryLabel={activeHunminRowTitle}
                  />
                ) : null
              }
            />
          </div>
        </div>
      ) : (
        CATEGORY_ORDER.map((category) => {
            const items = grouped[category]
            if (!items || items.length === 0) return null
            const categoryLabel = m.categories[category] ?? category
            const categoryEnLabel = m.categoriesEn[category] ?? ''

            return (
              <ModernVowelSection
                key={category}
                category={category}
                items={items}
                categoryLabel={categoryLabel}
                categoryEnLabel={categoryEnLabel}
                categoryDesc={categoryDesc[category]}
                activeId={activeId}
                activeItem={activeItem}
                detailScrollRef={detailScrollRef}
                lang={lang}
                animationLabel={m.animationVideo}
                mriLabel={m.mriVideo}
                pictogramLabel={m.pictogramVideo}
                onToggle={toggle}
              />
            )
          })
      )}
      </div>
      {displayMode === 'modern' ? (
        <div
          aria-hidden
          className={`overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.04,0.62,0.23,0.98)] ${
            activeItem?.category === VOWEL_CAT_DIPHTH ? 'h-0' : 'h-24'
          }`}
        />
      ) : null}
      {displayMode === 'hunmin' ? (
        <div style={chartFadeStyle}>
          <PhoneticsHaeryeSource kind="vowels" />
        </div>
      ) : null}
    </div>
  )
}

interface VowelDetailPanelProps {
  item: Vowel
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  pictogramLabel: string
  categoryLabel: string
  vowelArticulationSymbol?: string
}

function VowelDetailPanel({
  item,
  lang,
  animationLabel,
  mriLabel,
  pictogramLabel,
  categoryLabel,
  vowelArticulationSymbol,
}: VowelDetailPanelProps) {
  return (
    <SymbolDetailCard
      symbol={item.symbol}
      symbolFontClass="font-serif"
      header={
        <>
          <p className="font-serif text-lg leading-snug text-ink sm:text-xl">
            <SymbolDetailName name={item.name} />
          </p>
          {vowelArticulationSymbol ? (
            <TranslatedVowelArticulation
              symbol={vowelArticulationSymbol}
              lang={lang}
              className="mt-1.5 font-sans text-xs tracking-wide text-gold normal-case"
            />
          ) : (
            <p className="mt-1.5 font-sans text-[13px] font-medium text-gold">{categoryLabel}</p>
          )}
        </>
      }
    >
      <DualVideoPlayer
        animationFileName={item.animationFileName}
        mriFileName={item.mriFileName}
        pictogramFileName={item.pictogramFileName}
        type="vowels"
        animationLabel={animationLabel}
        mriLabel={mriLabel}
        pictogramLabel={pictogramLabel}
      />
      <div className="mt-6 rounded-[3px] border border-[#e3d5c0] bg-[#f4ecdf] px-4 py-4 dark:border-white/10 dark:bg-white/[0.05] sm:px-5 sm:py-4">
        <TranslatedDescription
          item={item as unknown as { description: string; [key: string]: unknown }}
          lang={lang}
          phonemeType="vowel"
          className="font-sans text-sm leading-loose text-ink-soft"
        />
      </div>
    </SymbolDetailCard>
  )
}
