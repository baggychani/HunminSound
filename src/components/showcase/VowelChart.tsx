'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useScrollToSymbolDetail } from '@/hooks/useScrollToSymbolDetail'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import { TranslatedVowelArticulation } from '@/components/showcase/TranslatedVowelArticulation'
import { VOWEL_ARTICULATION_KO } from '@/lib/vowelArticulation'
import { JamoText } from '@/components/ui/JamoText'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import { HunminZoneHeading } from '@/components/showcase/hunmin/HunminChartParts'
import { PhoneticsHaeryeSource } from '@/components/showcase/phonetics/PhoneticsHaeryeSource'
import {
  HUNMIN_VOWEL_GLYPH_RAIL_CLASS,
  HunminVowelImageGlyph,
  HunminVowelJamoGlyph,
  HunminVowelZone,
} from '@/components/showcase/hunmin/HunminVowelZone'
import {
  HUNMIN_VOWEL_ROWS,
  hunminVowelRowContainsSymbol,
  type HunminVowelRow,
  type HunminVowelSegment,
  type HunminVowelSlot,
} from '@/data/hunminVowelLayout'
import type { Vowel } from '@/types'

/** ??? ?? ?? ? ?? ?: ???, ???? */
const VOWEL_CAT_MONO = '\uB2E8\uBAA8\uC74C'
const VOWEL_CAT_DIPHTH = '\uC774\uC911\uBAA8\uC74C'
const CATEGORY_ORDER = [VOWEL_CAT_MONO, VOWEL_CAT_DIPHTH] as const
const HUNMIN_ZONE_BASIC = '\uAE30\uBCF8\uC790'
const HUNMIN_ZONE_COMBINED = '\uD569\uC6A9\uC790'
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
}

function vowelButtonSubLabel(name: string): string | null {
  const paren = name.match(/\(([^)]*)\)/)
  const raw = (paren?.[1] ?? name.split(' ').slice(1).join(' ')).replace(/[()]/g, '').trim()
  if (!raw) return null
  if (/^[\-?.]+$/.test(raw)) return null
  return raw
}

function GlyphButton({ vowel, isActive, onClick, symbolFontClass }: GlyphButtonProps) {
  const sub = vowelButtonSubLabel(vowel.name)
  return (
    <span className="inline-block align-top">
      <button
        type="button"
        onClick={onClick}
        className={`symbol-btn symbol-btn-hunmin transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
          isActive ? 'active bg-hanji-hover' : 'hover:bg-hanji-hover'
        }`}
        aria-expanded={isActive}
        aria-label={`${vowel.name} \uC0C1\uC138 \uBCF4\uAE30`}
      >
        <span
          className={`symbol-char ${symbolFontClass} text-4xl leading-none transition-colors ${
            isActive ? 'text-ink-accent' : 'text-ink'
          }`}
        >
          {vowel.symbol}
        </span>
        <span className={`symbol-sub ${sub ? '' : 'invisible'}`} aria-hidden={sub ? undefined : true}>
          {sub ?? '\u00a0'}
        </span>
      </button>
    </span>
  )
}

function GlyphPlaceholder({ symbol, symbolFontClass }: { symbol: string; symbolFontClass: string }) {
  return (
    <span className="symbol-btn symbol-btn-hunmin cursor-not-allowed bg-hanji/50 opacity-50" aria-disabled>
      <span className={`symbol-char ${symbolFontClass} text-4xl leading-none text-ink-muted`}>
        {symbol}
      </span>
      <span className="symbol-sub invisible select-none" aria-hidden>
        {'\u00a0'}
      </span>
    </span>
  )
}

/** ???(?? ??): mapTo ??? ?? ??, ?? ?? ?? */
function VowelCompoundSlot({
  jamo,
  mapTo,
  vowels,
  isActive,
  onClick,
  symbolFontClass,
  interactive = true,
}: {
  jamo: string
  mapTo?: string
  vowels: Vowel[]
  isActive: boolean
  onClick: () => void
  symbolFontClass: string
  interactive?: boolean
}) {
  const mapped = mapTo ? findVowelBySymbol(vowels, mapTo) : undefined
  const glyph = (
    <span
      className={`symbol-char ${symbolFontClass} inline-flex items-baseline leading-none tracking-[-0.22em] transition-colors ${
        mapped
          ? isActive
            ? 'text-ink-accent'
            : 'text-ink'
          : 'text-ink-muted/75'
      } text-[1.65rem] sm:text-4xl`}
    >
      {Array.from(jamo).map((ch, i) => (
        <span key={`${ch}-${i}`} className="inline-block">
          {ch}
        </span>
      ))}
    </span>
  )

  if (mapped && interactive) {
    return (
      <span className="inline-block align-top">
        <button
          type="button"
          onClick={onClick}
          className={`symbol-btn transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
            isActive ? 'active bg-hanji-hover' : 'hover:bg-hanji-hover'
          }`}
          aria-expanded={isActive}
          aria-label={mapped.name}
        >
          {glyph}
          <span className="symbol-sub invisible select-none" aria-hidden>
            {'\u00a0'}
          </span>
        </button>
      </span>
    )
  }

  return (
    <span
      className={`symbol-btn cursor-default bg-hanji/30 ${interactive ? '' : 'pointer-events-none'}`}
      aria-disabled
      title={'\uBBF8\uC0AC\uC6A9 \uD569\uC6A9\uC790'}
    >
      {glyph}
      <span className="symbol-sub invisible select-none" aria-hidden>
        {'\u00a0'}
      </span>
    </span>
  )
}

function VowelReservedSlot() {
  return (
    <span className="symbol-btn cursor-default bg-transparent" aria-hidden>
      <span className="symbol-char invisible text-4xl leading-none">{'\u00a0'}</span>
      <span className="symbol-sub invisible select-none">{'\u00a0'}</span>
    </span>
  )
}

function findVowelBySymbol(vowels: Vowel[], symbol: string): Vowel | undefined {
  return vowels.find((v) => v.symbol === symbol)
}

function renderVowelSlot(
  slot: HunminVowelSlot,
  slotKey: string,
  vowels: Vowel[],
  activeId: string | null,
  onToggle: (id: string) => void,
  symbolFontClass: string,
  interactive: boolean,
) {
  if (slot.kind === 'reserved') {
    return <VowelReservedSlot key={slotKey} />
  }
  if (slot.kind === 'compound') {
    const mapped = slot.mapTo ? findVowelBySymbol(vowels, slot.mapTo) : undefined
    const active = mapped ? activeId === mapped._id : false
    return (
      <VowelCompoundSlot
        key={slotKey}
        jamo={slot.jamo}
        mapTo={slot.mapTo}
        vowels={vowels}
        isActive={!!active}
        onClick={() => {
          const v = slot.mapTo ? findVowelBySymbol(vowels, slot.mapTo) : undefined
          if (v) onToggle(v._id)
        }}
        symbolFontClass={symbolFontClass}
        interactive={interactive}
      />
    )
  }
  if (slot.kind === 'image') {
    return <HunminVowelImageGlyph key={slotKey} asset={slot.asset} ipa={slot.ipa} />
  }
  if (slot.ipa) {
    return <HunminVowelJamoGlyph key={slotKey} symbol={slot.value} ipa={slot.ipa} />
  }
  const vowel = findVowelBySymbol(vowels, slot.value)
  if (vowel) {
    return (
      <GlyphButton
        key={vowel._id}
        vowel={vowel}
        isActive={activeId === vowel._id}
        onClick={() => onToggle(vowel._id)}
        symbolFontClass={symbolFontClass}
      />
    )
  }
  return <GlyphPlaceholder key={slotKey} symbol={slot.value} symbolFontClass={symbolFontClass} />
}

interface HunminVowelRowBodyProps {
  row: HunminVowelRow
  rowIndex: number
  vowels: Vowel[]
  activeId: string | null
  activeItem: Vowel | null
  activeHunminRowTitle: string
  detailScrollRef: RefObject<HTMLDivElement>
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  onToggle: (id: string) => void
  onBasicColumnWidth: (rowIndex: number, widthPx: number) => void
  basicColumnMinWidthPx: number
}

function HunminVowelRowBody({
  row,
  rowIndex,
  vowels,
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
}: HunminVowelRowBodyProps) {
  const hasActive = !!activeItem && hunminVowelRowContainsSymbol(row, activeItem.symbol)
  const hasCombinedZone = row.combinedSegments.length > 0
  const basicColRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = basicColRef.current
    if (!el) return
    const report = () => onBasicColumnWidth(rowIndex, el.getBoundingClientRect().width)
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [rowIndex, onBasicColumnWidth, row.basicSegments, row.combinedSegments, vowels])

  return (
    <div>
      <div
        ref={hasActive ? detailScrollRef : undefined}
        className="flex max-w-full flex-nowrap items-stretch gap-x-1.5 sm:gap-x-2"
        dir={lang === 'ar' ? 'ltr' : undefined}
        lang={lang === 'ar' ? 'ko' : undefined}
      >
        <div
          ref={basicColRef}
          className="flex min-w-0 shrink-0 flex-col"
          style={
            basicColumnMinWidthPx > 0 ? { minWidth: basicColumnMinWidthPx } : undefined
          }
        >
          <HunminZoneHeading title={HUNMIN_ZONE_BASIC} />
          <div className="mt-auto">
            <HunminVowelZone
              row={row}
              zoneKey="b"
              segments={row.basicSegments}
              interactive
              renderSlot={(slot, slotKey, interactive) =>
                renderVowelSlot(slot, slotKey, vowels, activeId, onToggle, 'font-jamo', interactive)
              }
            />
          </div>
        </div>
        <div className="w-px shrink-0 self-stretch bg-hanji-border/75" aria-hidden />
        <div className="flex min-w-0 shrink-0 flex-col">
          {hasCombinedZone ? <HunminZoneHeading title={HUNMIN_ZONE_COMBINED} /> : null}
          <div className="mt-auto">
            {hasCombinedZone ? (
              <HunminVowelZone
                row={row}
                zoneKey="c"
                segments={row.combinedSegments}
                interactive={false}
                renderSlot={(slot, slotKey) =>
                  renderVowelSlot(slot, slotKey, vowels, activeId, onToggle, 'font-jamo', false)
                }
              />
            ) : (
              <div className={HUNMIN_VOWEL_GLYPH_RAIL_CLASS} aria-hidden />
            )}
          </div>
        </div>
      </div>
      <ScrollSection isOpen={hasActive}>
        {activeItem && hasActive && (
          <div className="mt-8 pt-8 border-t border-hanji-border">
            <VowelDetailPanel
              item={activeItem}
              lang={lang}
              animationLabel={animationLabel}
              mriLabel={mriLabel}
              categoryLabel={activeHunminRowTitle}
            />
          </div>
        )}
      </ScrollSection>
    </div>
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
  onToggle,
}: ModernVowelSectionProps) {
  if (!items || items.length === 0) return null

  const hasActive = items.some((v) => v._id === activeId)

  return (
    <section>
      <div className="mb-8 pb-3 border-b border-hanji-border">
        <div className="flex items-baseline gap-4">
          <h3 className="font-serif text-lg text-ink tracking-wide">{categoryLabel}</h3>
          {categoryEnLabel ? (
            <span className="font-sans text-xs text-ink-muted tracking-widest uppercase">{categoryEnLabel}</span>
          ) : null}
        </div>
        <p className="font-sans text-xs text-ink-muted mt-2.5">{categoryDesc}</p>
      </div>

      <div
        ref={hasActive ? detailScrollRef : undefined}
        className="flex flex-wrap gap-1"
        dir={lang === 'ar' ? 'ltr' : undefined}
        lang={lang === 'ar' ? 'ko' : undefined}
      >
        {items.map((vowel) => (
          <GlyphButton
            key={vowel._id}
            vowel={vowel}
            isActive={activeId === vowel._id}
            onClick={() => onToggle(vowel._id)}
            symbolFontClass="font-dogseo-text"
          />
        ))}
      </div>

      <ScrollSection isOpen={hasActive}>
        {activeItem && hasActive && (
          <div className="mt-8 pt-8 border-t border-hanji-border">
            <VowelDetailPanel
              item={activeItem}
              lang={lang}
              animationLabel={animationLabel}
              mriLabel={mriLabel}
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
  const [activeId, setActiveId] = useState<string | null>(null)
  const detailScrollRef = useScrollToSymbolDetail(activeId)
  const { lang } = useLang()
  const m = getMessages(lang)

  const [displayMode, setDisplayMode] = useState<ChartViewMode>(viewMode)
  const [chartOpacity, setChartOpacity] = useState(1)
  const fadeTimerRef = useRef<number | null>(null)
  const [hunminBasicColMinPx, setHunminBasicColMinPx] = useState(0)
  const hunminBasicWidthsRef = useRef<[number, number, number]>([0, 0, 0])

  const onHunminBasicColumnWidth = useCallback((rowIndex: number, widthPx: number) => {
    if (rowIndex < 0 || rowIndex > 2) return
    const next = [...hunminBasicWidthsRef.current] as [number, number, number]
    next[rowIndex] = widthPx
    hunminBasicWidthsRef.current = next
    setHunminBasicColMinPx(Math.max(...next))
  }, [])


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

  const toggle = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id))
  }, [])

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
      <div className="space-y-16" style={chartFadeStyle}>
      {displayMode === 'hunmin'
        ? HUNMIN_VOWEL_ROWS.map((row, rowIndex) => (
            <section key={row.id}>
              <div className="mb-4">
                <h3 className="font-jamo text-lg tracking-wide text-ink">{row.title}</h3>
                <div className="mt-2 h-px w-full bg-hanji-border" aria-hidden />
              </div>
              <HunminVowelRowBody
                row={row}
                rowIndex={rowIndex}
                vowels={vowels}
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
            </section>
          ))
        : CATEGORY_ORDER.map((category) => {
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
                onToggle={toggle}
              />
            )
          })}
      </div>
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
  categoryLabel: string
  vowelArticulationSymbol?: string
}

function VowelDetailPanel({
  item,
  lang,
  animationLabel,
  mriLabel,
  categoryLabel,
  vowelArticulationSymbol,
}: VowelDetailPanelProps) {
  return (
    <>
      <div className="flex items-baseline gap-4 mb-5">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="font-dogseo-text text-6xl text-ink leading-none">{item.symbol}</span>
          <div className="h-px w-full bg-hanji-border" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-xl text-ink leading-snug">
            <JamoText text={item.name} />
          </p>
          {vowelArticulationSymbol ? (
            <TranslatedVowelArticulation symbol={vowelArticulationSymbol} lang={lang} />
          ) : (
            <p className="font-sans text-xs text-gold mt-3 uppercase tracking-widest">{categoryLabel}</p>
          )}
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
          type="vowels"
          animationLabel={animationLabel}
          mriLabel={mriLabel}
        />
      </div>
    </>
  )
}
