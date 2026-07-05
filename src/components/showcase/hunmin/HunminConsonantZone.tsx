'use client'

import type { ReactNode } from 'react'
import {
  HunminJejahaeZoneTrack,
  JEJAHAE_GLYPH_RAIL_CONSONANT,
  jejahaeGroupModelsFromSegments,
} from '@/components/showcase/hunmin/HunminJejahaeLayout'
import type { HunminRow, HunminSegment } from '@/data/hunminConsonantLayout'

export interface HunminConsonantZoneProps {
  row: HunminRow
  zoneKey: string
  segments: HunminSegment[]
  renderGlyphs: (seg: HunminSegment, segIdx: number, groupKey: string) => ReactNode
}

export function HunminConsonantZone({ row, zoneKey, segments, renderGlyphs }: HunminConsonantZoneProps) {
  const groups = jejahaeGroupModelsFromSegments(segments, (seg, segIdx, groupKey) =>
    renderGlyphs(seg, segIdx, groupKey),
  )

  return <HunminJejahaeZoneTrack groups={groups} glyphRailClass={JEJAHAE_GLYPH_RAIL_CONSONANT} />
}
