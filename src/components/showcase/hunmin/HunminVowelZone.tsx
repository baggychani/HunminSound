'use client'

import { Fragment, type ReactNode } from 'react'
import Image from 'next/image'
import {
  HUNMIN_LABEL_BLOCK_CLASS,
  HunminBetweenSeparator,
  hunminSegmentSeparatorKind,
} from '@/components/showcase/hunmin/HunminChartParts'
import type { HunminVowelRow, HunminVowelSegment, HunminVowelSlot } from '@/data/hunminVowelLayout'
import { hunminVowelImageSrc } from '@/lib/hunminVowelImages'

const HUNMIN_VOWEL_RAIL_CLASS = 'flex h-[4.25rem] shrink-0 items-center justify-center sm:h-[4.75rem]'

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
  const multiSpan = Boolean(spanGroup.spanLabel && spanGroup.segments.length > 1)
  const showColumnLabel = !multiSpan && seg.label?.trim()

  return (
    <div className="flex min-w-0 shrink-0 flex-col items-center">
      <div className={`${HUNMIN_LABEL_BLOCK_CLASS} mb-1 ${multiSpan ? 'min-h-[1.35rem]' : 'min-h-[2.35rem]'}`}>
        {showColumnLabel ? (
          <span className="font-sans text-[11px] leading-snug tracking-wide text-ink-muted sm:text-xs">{seg.label}</span>
        ) : null}
        {seg.groupLine ? (
          <span className="font-sans text-[10px] leading-snug tracking-wide text-ink-muted/80 sm:text-[11px]">
            {seg.groupLine}
          </span>
        ) : null}
      </div>
      <div className={`${HUNMIN_VOWEL_RAIL_CLASS} flex-nowrap justify-center gap-1 sm:gap-1.5`}>
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
    <div className="flex flex-nowrap items-end">
      {groups.map((group, groupIdx) => {
        const prevSeg = groupIdx > 0 ? groups[groupIdx - 1].segments.at(-1) : undefined
        const firstSeg = group.segments[0]
        const multiSpan = Boolean(group.spanLabel && group.segments.length > 1)

        return (
          <Fragment key={`${row.id}-${zoneKey}-g-${groupIdx}`}>
            {groupIdx > 0 && prevSeg && firstSeg && (
              <HunminBetweenSeparator compact kind={hunminSegmentSeparatorKind(prevSeg, firstSeg)} />
            )}
            <div className={multiSpan ? 'flex shrink-0 flex-col items-stretch' : 'contents'}>
              {multiSpan && group.spanLabel ? (
                <div className="mb-1 flex flex-col items-center px-0.5">
                  <span className="font-sans text-[11px] leading-snug tracking-wide text-ink-muted sm:text-xs">
                    {group.spanLabel}
                  </span>
                  <div className="mt-1.5 h-px w-full min-w-[5.5rem] bg-hanji-border/80" aria-hidden />
                </div>
              ) : null}
              <div className="flex flex-nowrap items-end">
                {group.segments.map((seg, segIdx) => (
                  <Fragment key={`${row.id}-${zoneKey}-${seg.groupLine ?? seg.label ?? ''}-${segIdx}`}>
                    {segIdx > 0 && (
                      <HunminBetweenSeparator
                        compact
                        kind={hunminSegmentSeparatorKind(group.segments[segIdx - 1], seg)}
                      />
                    )}
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

export function HunminVowelImageGlyph({ asset, ipa }: { asset: string; ipa?: string }) {
  const sub = ipa ?? null
  return (
    <span className="symbol-btn symbol-btn-hunmin pointer-events-none cursor-default bg-transparent">
      <span className="symbol-char flex items-end justify-center bg-hanji">
        <Image
          src={hunminVowelImageSrc(asset)}
          alt=""
          width={52}
          height={48}
          className="hunmin-vowel-img opacity-90"
          draggable={false}
          unoptimized
        />
      </span>
      <span className={`symbol-sub hunmin-vowel-ipa ${sub ? '' : 'invisible'}`} aria-hidden={sub ? undefined : true}>
        {sub ?? '\u00a0'}
      </span>
    </span>
  )
}
