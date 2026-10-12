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

function readingOf(name: string): string | null {
  const paren = name.match(/\(([^)]*)\)/)
  const raw = (paren?.[1] ?? '').replace(/[()]/g, '').trim()
  if (!raw || /^[\-—–.]+$/.test(raw)) return null
  return raw
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
  const reading = consonant ? readingOf(consonant.name) : null
  const body = (
    <>
      {consonant ? <span aria-hidden className="symbol-card-dot" /> : null}
      <span className="symbol-char font-jamo text-[1.85rem] leading-none sm:text-[2rem]">{symbol}</span>
      <span className={`symbol-sub ${reading ? '' : 'invisible'}`} aria-hidden={reading ? undefined : true}>
        {reading ?? '\u00a0'}
      </span>
    </>
  )

  if (!consonant) {
    return <span className="symbol-btn symbol-btn-card cursor-default">{body}</span>
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(consonant._id)}
      aria-expanded={isActive}
      aria-label={`${consonant.name} 상세 보기`}
      className={`symbol-btn symbol-btn-card transition-transform duration-200 ease-out hover:-translate-y-px active:translate-y-0 ${
        isActive ? 'active' : ''
      }`}
    >
      {body}
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
  const footnotes = HUNMIN_CONSONANT_ROWS.filter((row) => row.footnote)

  return (
    <div className="overflow-x-auto">
    <div
      className="hunmin-consonant-table"
      role="table"
      dir={lang === 'ar' ? 'ltr' : undefined}
      lang={lang === 'ar' ? 'ko' : undefined}
    >
      <div className="hunmin-consonant-table-row border-y border-hanji-border" role="row">
        <div />
        <div
          className="col-span-3 px-2 py-2.5 text-center font-sans text-sm font-semibold text-gold"
          role="columnheader"
        >
          기본자
        </div>
        <div
          className="hunmin-consonant-split col-span-3 px-2 py-2.5 text-center font-sans text-sm font-semibold text-gold"
          role="columnheader"
        >
          확장자
        </div>
      </div>

      <div className="hunmin-consonant-table-row border-b border-hanji-border" role="row">
        <div role="columnheader" />
        {COLUMNS.map((column) => (
          <div
            key={column.key}
            role="columnheader"
            className={`flex items-end justify-center px-1 pb-2.5 pt-3 text-center font-sans text-[13px] font-medium leading-tight text-ink-soft ${
              column.key === 'double' ? 'hunmin-consonant-split' : 'hunmin-consonant-rule'
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
              className={`hunmin-consonant-table-row hunmin-consonant-table-glyphs border-b border-hanji-border ${
                open ? 'is-active' : ''
              }`}
              role="row"
            >
              <div className="hunmin-consonant-rowhead" role="rowheader">
                <h3 className="font-jamo text-[1.3125rem] leading-none text-ink">{row.title}</h3>
                {classicLabelByRowId[row.id] ? (
                  <span className="mt-1.5 font-serif text-[13px] leading-none text-ink-muted" lang="zh-Hant">
                    {classicLabelByRowId[row.id]}
                  </span>
                ) : null}
              </div>
              {COLUMNS.map((column) => {
                const symbols = symbolsIn(row, column.match, column.zone)
                const rule = column.key === 'double' ? 'hunmin-consonant-split' : 'hunmin-consonant-rule'
                return (
                  <div key={column.key} role="cell" className={`flex items-center justify-center px-2 py-3.5 ${rule}`}>
                    {column.sequential ? (
                      <div className="hunmin-gaheuk-slots">
                        {symbols[0] ? (
                          <TableGlyph
                            symbol={symbols[0]}
                            consonant={bySymbol.get(symbols[0])}
                            isActive={bySymbol.get(symbols[0])?._id === activeId}
                            onToggle={onToggle}
                          />
                        ) : (
                          <span />
                        )}
                        <div className="flex items-center justify-center">
                          {symbols[1] ? <StrokeArrow /> : null}
                        </div>
                        {symbols[1] ? (
                          <TableGlyph
                            symbol={symbols[1]}
                            consonant={bySymbol.get(symbols[1])}
                            isActive={bySymbol.get(symbols[1])?._id === activeId}
                            onToggle={onToggle}
                          />
                        ) : (
                          <span />
                        )}
                      </div>
                    ) : symbols.length > 0 ? (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {symbols.map((symbol) => (
                          <TableGlyph
                            key={symbol}
                            symbol={symbol}
                            consonant={bySymbol.get(symbol)}
                            isActive={bySymbol.get(symbol)?._id === activeId}
                            onToggle={onToggle}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <div className="hunmin-consonant-table-span" role="row">
              <ScrollSection isOpen={open}>{open ? renderDetail() : null}</ScrollSection>
            </div>
          </Fragment>
        )
      })}
      {footnotes.length > 0 ? (
        <div className="hunmin-consonant-table-span space-y-1 px-1 pt-4" role="note">
          {footnotes.map((row) => (
            <p key={row.id} className="font-sans text-xs leading-relaxed text-ink-muted">
              <JamoText text={row.footnote ?? ''} />
            </p>
          ))}
        </div>
      ) : null}
    </div>
    </div>
  )
}
