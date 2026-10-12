'use client'

import { Fragment, type ReactNode, type RefObject } from 'react'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { JamoText } from '@/components/ui/JamoText'
import {
  HUNMIN_VOWEL_CARD_CHAR_CLASS,
  HunminVowelImageGlyph,
  HunminVowelJamoGlyph,
} from '@/components/showcase/hunmin/HunminVowelZone'
import {
  HUNMIN_VOWEL_ROWS,
  hunminVowelRowContainsSymbol,
  type HunminVowelRow,
  type HunminVowelSegment,
  type HunminVowelSlot,
} from '@/data/hunminVowelLayout'
import type { Vowel } from '@/types'

const COLUMNS: {
  key: string
  label: string
  split?: boolean
  pick: (row: HunminVowelRow) => HunminVowelSlot[]
}[] = [
  {
    key: 'sang',
    label: '상형기본자',
    pick: (row) => slotsWhere(row.basicSegments, (segment) => segment.label === '상형기본자'),
  },
  {
    key: 'cho',
    label: '초출자',
    pick: (row) => slotsWhere(row.basicSegments, (segment) => segment.groupLine === '초출자'),
  },
  {
    key: 'jae',
    label: '재출자',
    pick: (row) => slotsWhere(row.basicSegments, (segment) => segment.groupLine === '재출자'),
  },
  {
    key: 'dong',
    label: '동출합용자',
    split: true,
    pick: (row) => slotsWhere(row.combinedSegments, (segment) => segment.label === '동출합용자'),
  },
  {
    key: 'i-basic',
    label: '기본 중성자와 ㅣ',
    pick: (row) => slotsWhere(row.combinedSegments, (segment) => segment.groupLine === '기본 중성자와 ㅣ'),
  },
  {
    key: 'i-dong',
    label: '동출합용자와 ㅣ',
    pick: (row) => slotsWhere(row.combinedSegments, (segment) => segment.groupLine === '동출합용자와 ㅣ'),
  },
]

function slotsWhere(
  segments: HunminVowelSegment[],
  match: (segment: HunminVowelSegment) => boolean,
): HunminVowelSlot[] {
  return segments.filter(match).flatMap((segment) => segment.slots.filter((slot) => slot.kind !== 'reserved'))
}

function readingOf(name: string): string | null {
  const paren = name.match(/\(([^)]*)\)/)
  const raw = (paren?.[1] ?? name.split(' ').slice(1).join(' ')).replace(/[()]/g, '').trim()
  if (raw && !/^[\-?.]+$/.test(raw)) return raw
  const beforeParen = name.replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (beforeParen && beforeParen !== name) return beforeParen
  return null
}

function findVowel(vowels: Vowel[], symbol: string | undefined): Vowel | undefined {
  if (!symbol) return undefined
  return vowels.find((vowel) => vowel.symbol === symbol)
}

function VowelCard({
  symbol,
  sub,
  ipa,
  active,
  label,
  onClick,
}: {
  symbol: string
  sub: string | null
  ipa?: boolean
  active: boolean
  label: string
  onClick?: () => void
}) {
  const body = (
    <>
      {onClick ? <span aria-hidden className="symbol-card-dot" /> : null}
      <span className={`symbol-char font-jamo leading-none ${HUNMIN_VOWEL_CARD_CHAR_CLASS}`}>{symbol}</span>
      <span
        className={`symbol-sub ${sub ? '' : 'invisible'} ${ipa ? 'hunmin-vowel-ipa' : ''}`}
        aria-hidden={sub ? undefined : true}
      >
        {sub ?? '\u00a0'}
      </span>
    </>
  )

  if (!onClick) {
    return <span className="symbol-btn symbol-btn-card cursor-default">{body}</span>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      aria-label={`${label} 상세 보기`}
      className={`symbol-btn symbol-btn-card transition-transform duration-200 ease-out hover:-translate-y-px active:translate-y-0 ${
        active ? 'active' : ''
      }`}
    >
      {body}
    </button>
  )
}

function TableSlot({
  slot,
  slotKey,
  vowels,
  activeId,
  onToggle,
}: {
  slot: HunminVowelSlot
  slotKey: string
  vowels: Vowel[]
  activeId: string | null
  onToggle: (id: string) => void
}) {
  if (slot.kind === 'image') {
    const mapped = findVowel(vowels, slot.mapTo)
    const sub = slot.cardLabel ?? (mapped ? readingOf(mapped.name) : slot.ipa) ?? null
    return (
      <HunminVowelImageGlyph
        key={slotKey}
        asset={slot.asset}
        subLabel={sub ?? undefined}
        interactive={Boolean(mapped)}
        isActive={mapped ? activeId === mapped._id : false}
        onClick={mapped ? () => onToggle(mapped._id) : undefined}
        ariaLabel={mapped?.name}
      />
    )
  }

  if (slot.kind === 'compound') {
    const mapped = findVowel(vowels, slot.mapTo)
    return (
      <VowelCard
        key={slotKey}
        symbol={slot.jamo}
        sub={mapped ? readingOf(mapped.name) : null}
        active={mapped ? activeId === mapped._id : false}
        label={mapped?.name ?? slot.jamo}
        onClick={mapped ? () => onToggle(mapped._id) : undefined}
      />
    )
  }

  if (slot.kind !== 'symbol') return null

  const target = slot.mapTo ?? slot.value
  const vowel = findVowel(vowels, target)
  if (vowel) {
    return (
      <VowelCard
        key={slotKey}
        symbol={slot.value}
        sub={slot.ipa ?? readingOf(vowel.name)}
        ipa={Boolean(slot.ipa)}
        active={activeId === vowel._id}
        label={vowel.name}
        onClick={() => onToggle(vowel._id)}
      />
    )
  }
  if (slot.ipa) {
    return <HunminVowelJamoGlyph key={slotKey} symbol={slot.value} ipa={slot.ipa} />
  }
  return (
    <VowelCard key={slotKey} symbol={slot.value} sub={null} active={false} label={slot.value} />
  )
}

export function HunminVowelTable({
  vowels,
  activeId,
  onToggle,
  detailScrollRef,
  lang,
  renderDetail,
}: {
  vowels: Vowel[]
  activeId: string | null
  onToggle: (id: string) => void
  detailScrollRef: RefObject<HTMLDivElement>
  lang: string
  renderDetail: () => ReactNode
}) {
  const activeSymbol = vowels.find((vowel) => vowel._id === activeId)?.symbol

  return (
    <div className="hunmin-consonant-scroll">
      <div
        className="hunmin-vowel-table"
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
            합용자
          </div>
        </div>

        <div className="hunmin-consonant-table-row border-b border-hanji-border" role="row">
          <div role="columnheader" />
          {COLUMNS.map((column) => (
            <div
              key={column.key}
              role="columnheader"
              className={`flex items-end justify-center px-1 pb-2.5 pt-3 text-center font-sans text-[13px] font-medium leading-tight text-ink-soft ${
                column.split ? 'hunmin-consonant-split' : 'hunmin-consonant-rule'
              }`}
            >
              <JamoText text={column.label} />
            </div>
          ))}
        </div>

        {HUNMIN_VOWEL_ROWS.map((row) => {
          const open = hunminVowelRowContainsSymbol(row, activeSymbol)
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
                </div>
                {COLUMNS.map((column) => (
                  <div
                    key={column.key}
                    role="cell"
                    className={`flex flex-wrap items-center justify-center gap-2 px-2 py-3.5 ${
                      column.split ? 'hunmin-consonant-split' : 'hunmin-consonant-rule'
                    }`}
                  >
                    {column.pick(row).map((slot, index) => (
                      <TableSlot
                        key={`${row.id}-${column.key}-${index}`}
                        slot={slot}
                        slotKey={`${row.id}-${column.key}-${index}`}
                        vowels={vowels}
                        activeId={activeId}
                        onToggle={onToggle}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="hunmin-consonant-table-span" role="row">
                <ScrollSection isOpen={open}>
                  {open ? <div className="pb-5">{renderDetail()}</div> : null}
                </ScrollSection>
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
