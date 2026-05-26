'use client'

import { Fragment, type ReactNode } from 'react'
import Image from 'next/image'
import {
  HUNMIN_LABEL_BLOCK_CLASS,
  HUNMIN_VOWEL_SPAN_HEADER_CLASS,
  HunminColumnSeparator,
} from '@/components/showcase/hunmin/HunminChartParts'
import type { HunminVowelRow, HunminVowelSegment, HunminVowelSlot } from '@/data/hunminVowelLayout'
import { hunminVowelImageSrc } from '@/lib/hunminVowelImages'

export const HUNMIN_VOWEL_GLYPH_RAIL_CLASS =
  'flex h-[4.625rem] shrink-0 items-center justify-center sm:h-[4.875rem]'

/** 카드·현대 음성학과 동일한 글리프 크기 */
export const HUNMIN_VOWEL_CARD_CHAR_CLASS = 'text-[1.85rem] sm:text-[2rem]'

type VowelSegmentGroup = { spanLabel?: string; segments: HunminVowelSegment[] }

function groupVowelSegments(segments: HunminVowelSegment[]): VowelSegmentGroup[] {
  const groups: VowelSegmentGroup[] = []
  let current: VowelSegmentGroup | null = null

  for (const seg of segments) {
    if (seg.label?.trim()) {
      if (current) groups.push(current)
      current = { spanLabel: seg.label.trim(), segments: [seg] }
    } else if (current) {
      current.segments.push(seg)
    } else {
      groups.push({ segments: [seg] })
    }
  }
  if (current) groups.push(current)
  return groups
}

export interface HunminVowelZoneProps {
  row: HunminVowelRow
  zoneKey: string
  segments: HunminVowelSegment[]
  interactive?: boolean
  renderSlot: (slot: HunminVowelSlot, slotKey: string, interactive: boolean) => ReactNode
}

function HunminVowelSegmentColumn({
  seg,
  row,
  zoneKey,
  segIdx,
  spanGroup,
  interactive,
  renderSlot,
}: {
  seg: HunminVowelSegment
  row: HunminVowelRow
  zoneKey: string
  segIdx: number
  spanGroup: VowelSegmentGroup
  interactive: boolean
  renderSlot: HunminVowelZoneProps['renderSlot']
}) {
  const hasSpanHeader = Boolean(spanGroup.spanLabel)
  const showColumnLabel = !hasSpanHeader && seg.label?.trim()
  /** 합성자·ㅣ 합용자처럼 하위 라벨(초출자 등)이 없는 span — 카드 높이 맞춤용 빈 칸 */
  const needsSubLabelSpacer = hasSpanHeader && !seg.groupLine
  const showLabelBlock = showColumnLabel || Boolean(seg.groupLine) || needsSubLabelSpacer
  return (
    <div className="flex min-w-0 shrink-0 flex-col">
      {showLabelBlock ? (
        <div
          className={HUNMIN_LABEL_BLOCK_CLASS}
          aria-hidden={needsSubLabelSpacer ? true : undefined}
        >
          {showColumnLabel ? <span className="hunmin-vowel-segment-label">{seg.label}</span> : null}
          {seg.groupLine ? <span className="hunmin-vowel-segment-label">{seg.groupLine}</span> : null}
        </div>
      ) : null}
      <div className={`${HUNMIN_VOWEL_GLYPH_RAIL_CLASS} flex flex-nowrap justify-center gap-2 sm:gap-3`}>
        {seg.slots.map((slot, slotIdx) =>
          renderSlot(slot, `${row.id}-${zoneKey}-${segIdx}-${slotIdx}`, interactive),
        )}
      </div>
    </div>
  )
}

export function HunminVowelZone({ row, zoneKey, segments, interactive = true, renderSlot }: HunminVowelZoneProps) {
  if (segments.length === 0) return null

  const groups = groupVowelSegments(segments)

  return (
    <div className="flex flex-nowrap items-stretch gap-2 sm:gap-3">
      {groups.map((group, groupIdx) => {
        const hasSpanHeader = Boolean(group.spanLabel)

        return (
          <Fragment key={`${row.id}-${zoneKey}-g-${groupIdx}`}>
            {groupIdx > 0 ? <HunminColumnSeparator /> : null}
            <div className="flex shrink-0 flex-col items-stretch">
              {hasSpanHeader ? (
                <div className={HUNMIN_VOWEL_SPAN_HEADER_CLASS}>
                  <span className="hunmin-vowel-segment-label">{group.spanLabel}</span>
                  <div className="mt-1.5 h-px w-full min-w-[5.5rem] bg-hanji-border/80" aria-hidden />
                </div>
              ) : null}
              <div className="flex flex-nowrap items-stretch gap-2 sm:gap-3">
                {group.segments.map((seg, segIdx) => (
                  <Fragment key={`${row.id}-${zoneKey}-${seg.groupLine ?? seg.label ?? ''}-${segIdx}`}>
                    {segIdx > 0 ? <HunminColumnSeparator /> : null}
                    <HunminVowelSegmentColumn
                      seg={seg}
                      row={row}
                      zoneKey={zoneKey}
                      segIdx={segIdx}
                      spanGroup={group}
                      interactive={interactive}
                      renderSlot={renderSlot}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

/** 훈민 모음 — 옛한글 자모 + IPA (DB 모음 없을 때) */
export function HunminVowelJamoGlyph({ symbol, ipa }: { symbol: string; ipa?: string }) {
  const sub = ipa ?? null
  return (
    <span className="symbol-btn symbol-btn-card pointer-events-none cursor-default">
      <span className={`symbol-char font-jamo leading-none ${HUNMIN_VOWEL_CARD_CHAR_CLASS}`}>{symbol}</span>
      <span className={`symbol-sub hunmin-vowel-ipa ${sub ? '' : 'invisible'}`} aria-hidden={sub ? undefined : true}>
        {sub ?? '\u00a0'}
      </span>
    </span>
  )
}

export function HunminVowelImageGlyph({
  asset,
  subLabel,
  interactive = false,
  isActive = false,
  onClick,
  ariaLabel,
}: {
  asset: string
  subLabel?: string
  interactive?: boolean
  isActive?: boolean
  onClick?: () => void
  ariaLabel?: string
}) {
  const sub = subLabel ?? null
  const inner = (
    <>
      <span className="symbol-char hunmin-vowel-img-wrap flex items-end justify-center">
        <Image
          src={hunminVowelImageSrc(asset)}
          alt=""
          width={56}
          height={48}
          className="hunmin-vowel-img opacity-90"
          draggable={false}
          unoptimized
        />
      </span>
      <span className={`symbol-sub ${sub ? '' : 'invisible'}`} aria-hidden={sub ? undefined : true}>
        {sub ?? '\u00a0'}
      </span>
    </>
  )

  if (interactive && onClick) {
    return (
      <span className="inline-block align-top">
        <button
          type="button"
          onClick={onClick}
          className={`symbol-btn symbol-btn-card transition-transform duration-200 ease-out hover:-translate-y-px active:translate-y-0 ${
            isActive ? 'active' : ''
          }`}
          aria-expanded={isActive}
          aria-label={ariaLabel}
        >
          <span aria-hidden className="symbol-card-dot" />
          {inner}
        </button>
      </span>
    )
  }

  return (
    <span className="symbol-btn symbol-btn-card pointer-events-none cursor-default">
      {inner}
    </span>
  )
}
