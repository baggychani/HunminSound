'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import {
  HunminJejahaeZoneTrack,
  JEJAHAE_GLYPH_RAIL_VOWEL,
  jejahaeGroupModelsFromSegments,
} from '@/components/showcase/hunmin/HunminJejahaeLayout'
import type { HunminVowelRow, HunminVowelSegment, HunminVowelSlot } from '@/data/hunminVowelLayout'
import { hunminVowelImageSrc } from '@/lib/hunminVowelImages'

/** 카드·현대 음성학과 동일한 글리프 크기 */
export const HUNMIN_VOWEL_CARD_CHAR_CLASS = 'text-[1.85rem] sm:text-[2rem]'

export const HUNMIN_VOWEL_GLYPH_RAIL_CLASS = `flex shrink-0 items-center ${JEJAHAE_GLYPH_RAIL_VOWEL}`

export interface HunminVowelZoneProps {
  row: HunminVowelRow
  zoneKey: string
  segments: HunminVowelSegment[]
  interactive?: boolean
  renderSlot: (slot: HunminVowelSlot, slotKey: string, interactive: boolean) => ReactNode
}

export function HunminVowelZone({ row, zoneKey, segments, interactive = true, renderSlot }: HunminVowelZoneProps) {
  const groups = jejahaeGroupModelsFromSegments(segments, (seg, segIdx, groupKey) => (
    <>
      {seg.slots.map((slot, slotIdx) =>
        renderSlot(slot, `${row.id}-${zoneKey}-${groupKey}-${segIdx}-${slotIdx}`, interactive),
      )}
    </>
  ))

  return <HunminJejahaeZoneTrack groups={groups} glyphRailClass={JEJAHAE_GLYPH_RAIL_VOWEL} />
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
