'use client'

import { Fragment, type ReactNode, type RefObject } from 'react'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { JamoText } from '@/components/ui/JamoText'
import {
  HUNMIN_CONSONANT_ROWS,
  hunminRowContainsSymbol,
  type HunminRow,
} from '@/data/hunminConsonantLayout'
import type { Consonant } from '@/types'

const COLUMNS: {
  key: string
  label: string
  match: string
  zone: 'basic' | 'extended'
  sequential?: boolean
}[] = [
  { key: 'pictogram', label: '상형', match: '상형기본자', zone: 'basic' },
  { key: 'stroke', label: '가획', match: '일반 가획', zone: 'basic', sequential: true },
  { key: 'variant', label: '이체', match: '이체자', zone: 'basic' },
  { key: 'double', label: '각자병서', match: '각자병서', zone: 'extended' },
  { key: 'cluster', label: '합용병서', match: '합용병서', zone: 'extended' },
  { key: 'yeon', label: '연서', match: '연서', zone: 'extended' },
]

function symbolsIn(row: HunminRow, match: string, zone: 'basic' | 'extended'): string[] {
  const segments = zone === 'basic' ? row.basicSegments : row.extendedSegments
  return segments.filter((segment) => segment.label === match).flatMap((segment) => segment.symbols)
}

function StrokeArrow() {
  return (
    <svg viewBox="0 0 20 10" className="h-2.5 w-5 shrink-0 text-gold" aria-hidden>
      <path d="M1 5h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 1.5 L18.5 5 L12 8.5 Z" fill="currentColor" />
    </svg>
  )
}

function TableGlyph({
  symbol,
  consonant,
  isActive,
  onToggle,
}: {
  symbol: string
  consonant: Consonant | undefined
  isActive: boolean
  onToggle: (id: string) => void
}) {
  const glyphClass = 'font-jamo text-[1.85rem] leading-none sm:text-[2rem]'

  if (!consonant) {
    return (
      <span className={`inline-flex min-h-11 min-w-11 items-center justify-center ${glyphClass} text-ink`}>
        {symbol}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(consonant._id)}
      aria-expanded={isActive}
      aria-label={`${consonant.name} 상세 보기`}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center ${glyphClass} transition-colors ${
        isActive
          ? 'text-ink-accent shadow-[inset_0_-2px_0_rgb(var(--gold-rgb))]'
          : 'text-ink hover:text-ink-accent'
      }`}
    >
      {consonant.symbol}
    </button>
  )
}

export function HunminConsonantTable({
  consonants,
  activeId,
  onToggle,
  detailScrollRef,
  lang,
  classicLabelByRowId,
  renderDetail,
}: {
  consonants: Consonant[]
  activeId: string | null
  onToggle: (id: string) => void
  detailScrollRef: RefObject<HTMLDivElement>
  lang: string
  classicLabelByRowId: Record<string, string>
  renderDetail: () => ReactNode
}) {
  const bySymbol = new Map(consonants.map((consonant) => [consonant.symbol, consonant]))

  return (
    <div className="overflow-x-auto">
    <div
      className="hunmin-consonant-table"
      role="table"
      dir={lang === 'ar' ? 'ltr' : undefined}
      lang={lang === 'ar' ? 'ko' : undefined}
    >
      <div className="hunmin-consonant-table-row pb-1.5" role="row">
        <div />
        <div className="col-span-3 px-2 text-center font-sans text-xs font-medium text-gold" role="columnheader">
          기본자
        </div>
        <div
          className="hunmin-consonant-split col-span-3 px-2 text-center font-sans text-xs font-medium text-gold"
          role="columnheader"
        >
          확장자
        </div>
      </div>

      <div className="hunmin-consonant-table-row border-b border-hanji-border/80 pb-2" role="row">
        <div role="columnheader" />
        {COLUMNS.map((column) => (
          <div
            key={column.key}
            role="columnheader"
            className={`px-1 text-center font-sans text-[11px] leading-tight text-ink-muted sm:text-xs ${
              column.zone === 'extended' && column.key === 'double' ? 'hunmin-consonant-split' : ''
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>

      {HUNMIN_CONSONANT_ROWS.map((row) => {
        const open = hunminRowContainsSymbol(row, consonants.find((item) => item._id === activeId)?.symbol)
        return (
          <Fragment key={row.id}>
            <div
              ref={open ? detailScrollRef : undefined}
              className={`hunmin-consonant-table-row hunmin-consonant-table-glyphs border-b border-hanji-border/70 ${
                open ? 'is-active' : ''
              }`}
              role="row"
            >
              <div className="flex flex-col items-start justify-center py-3 pr-2" role="rowheader">
                <h3 className="font-jamo text-[1.3125rem] leading-none text-ink">{row.title}</h3>
                {classicLabelByRowId[row.id] ? (
                  <span className="mt-1 font-serif text-[13px] leading-none text-ink-muted" lang="zh-Hant">
                    {classicLabelByRowId[row.id]}
                  </span>
                ) : null}
              </div>
              {COLUMNS.map((column) => {
                const symbols = symbolsIn(row, column.match, column.zone)
                return (
                  <div
                    key={column.key}
                    role="cell"
                    className={`flex min-h-[4.25rem] items-center justify-center px-1 py-2 ${
                      column.key === 'double' ? 'hunmin-consonant-split' : ''
                    }`}
                  >
                    {symbols.length > 0 ? (
                      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
                        {symbols.map((symbol, index) => (
                          <Fragment key={symbol}>
                            {column.sequential && index > 0 ? <StrokeArrow /> : null}
                            <TableGlyph
                              symbol={symbol}
                              consonant={bySymbol.get(symbol)}
                              isActive={bySymbol.get(symbol)?._id === activeId}
                              onToggle={onToggle}
                            />
                          </Fragment>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <div className="hunmin-consonant-table-span" role="row">
              {row.footnote ? (
                <p className="max-w-3xl px-1 pt-2.5 font-sans text-xs leading-relaxed text-ink-muted">
                  <JamoText text={row.footnote} />
                </p>
              ) : null}
              <ScrollSection isOpen={open}>{open ? renderDetail() : null}</ScrollSection>
            </div>
          </Fragment>
        )
      })}
    </div>
    </div>
  )
}
