'use client'

import { Fragment, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { HunminSegmentSeparator, hunminSegmentSeparatorKind } from '@/components/showcase/hunmin/HunminChartParts'

/** 모음·자음 제자해 — glyph rail 높이 */
export const JEJAHAE_GLYPH_RAIL_VOWEL = 'h-[4.625rem] sm:h-[4.875rem]'
export const JEJAHAE_GLYPH_RAIL_CONSONANT = 'h-20'

export type JejahaeBridgeKind = 'gaheuk-arrow' | 'pipe'

export type JejahaeColumnModel = {
  key: string
  subLabel?: string | null
  glyphs: ReactNode
}

export type JejahaeGroupModel = {
  key: string
  spanLabel?: string | null
  columns: JejahaeColumnModel[]
}

type SegmentLike = { label?: string; groupLine?: string }

/** 해례 span 라벨(합성자·ㅣ 합용자 등) 기준으로 그룹화 */
export function groupJejahaeSegments<T extends SegmentLike>(
  segments: T[],
): { spanLabel?: string; segments: T[] }[] {
  const groups: { spanLabel?: string; segments: T[] }[] = []
  let current: { spanLabel?: string; segments: T[] } | null = null

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

export function jejahaeBridgeKind(prev: SegmentLike, next: SegmentLike): JejahaeBridgeKind {
  return hunminSegmentSeparatorKind(prev, next)
}

function columnSubLabel(seg: SegmentLike, hasSpan: boolean): string | null {
  if (seg.groupLine?.trim()) return seg.groupLine.trim()
  if (!hasSpan && seg.label?.trim()) return seg.label.trim()
  return null
}

export function jejahaeGroupModelsFromSegments<T extends SegmentLike>(
  segments: T[],
  buildGlyphs: (seg: T, segIdx: number, groupKey: string) => ReactNode,
): JejahaeGroupModel[] {
  return groupJejahaeSegments(segments).map((group, groupIdx) => {
    const hasSpan = Boolean(group.spanLabel)
    const groupKey = group.spanLabel ?? `g-${groupIdx}`
    return {
      key: groupKey,
      spanLabel: hasSpan ? group.spanLabel : null,
      columns: group.segments.map((seg, segIdx) => ({
        key: `${groupKey}-${seg.groupLine ?? seg.label ?? segIdx}`,
        subLabel: columnSubLabel(seg, hasSpan),
        glyphs: buildGlyphs(seg, segIdx, groupKey),
      })),
    }
  })
}

function JejahaeColumnDivider() {
  return <div className="hunmin-jejahae-inner-divider shrink-0 self-stretch" aria-hidden />
}

function JejahaeBridge({ kind, glyphRailClass }: { kind: JejahaeBridgeKind; glyphRailClass: string }) {
  return (
    <div
      className={`${glyphRailClass} flex shrink-0 items-center justify-center px-0.5 sm:px-1`}
      aria-hidden
      title={kind === 'gaheuk-arrow' ? '가획' : undefined}
    >
      <HunminSegmentSeparator kind={kind} />
    </div>
  )
}

function JejahaeGroupPanel({
  group,
  glyphRailClass,
  columnDividerKind,
}: {
  group: JejahaeGroupModel
  glyphRailClass: string
  columnDividerKind: (prev: JejahaeColumnModel, next: JejahaeColumnModel) => JejahaeBridgeKind
}) {
  return (
    <div className="hunmin-jejahae-group shrink-0">
      {group.spanLabel ? (
        <p className="hunmin-jejahae-group-title">{group.spanLabel}</p>
      ) : null}
      <div className="flex flex-nowrap items-stretch justify-start">
        {group.columns.map((col, colIdx) => {
          const prevCol = colIdx > 0 ? group.columns[colIdx - 1] : null
          const dividerKind =
            colIdx > 0 && prevCol ? columnDividerKind(prevCol, col) : null
          const showColLabel =
            Boolean(col.subLabel) || (group.columns.length > 1 && !group.spanLabel)

          return (
            <Fragment key={col.key}>
              {dividerKind ? <JejahaeColumnDivider /> : null}
              <div className="hunmin-jejahae-column shrink-0">
                {showColLabel ? (
                  <div className="hunmin-jejahae-col-label">
                    {col.subLabel ? (
                      <span>{col.subLabel}</span>
                    ) : (
                      <span className="invisible select-none" aria-hidden>
                        {'\u00a0'}
                      </span>
                    )}
                  </div>
                ) : null}
                <div className={`${glyphRailClass} flex flex-nowrap items-center justify-start gap-2 sm:gap-2.5`}>
                  {col.glyphs}
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

/** 구역 안 가로 그룹 나열 — 카드형 패널 + glyph baseline 브릿지 */
export function HunminJejahaeZoneTrack({
  groups,
  glyphRailClass,
  columnDividerKind = () => 'pipe',
}: {
  groups: JejahaeGroupModel[]
  glyphRailClass: string
  columnDividerKind?: (prev: JejahaeColumnModel, next: JejahaeColumnModel) => JejahaeBridgeKind
}) {
  if (groups.length === 0) return null

  return (
    <div className="flex flex-nowrap items-end justify-start gap-2.5 sm:gap-3">
      {groups.map((group, groupIdx) => {
        const prevGroup = groupIdx > 0 ? groups[groupIdx - 1] : null
        const kind =
          groupIdx > 0 && prevGroup
            ? jejahaeBridgeKind(
                {
                  label:
                    prevGroup.spanLabel ??
                    prevGroup.columns[prevGroup.columns.length - 1]?.subLabel ??
                    undefined,
                },
                {
                  label: group.spanLabel ?? group.columns[0]?.subLabel ?? undefined,
                },
              )
            : null

        return (
          <Fragment key={group.key}>
            {kind === 'gaheuk-arrow' ? (
              <JejahaeBridge kind={kind} glyphRailClass={glyphRailClass} />
            ) : null}
            <JejahaeGroupPanel
              group={group}
              glyphRailClass={glyphRailClass}
              columnDividerKind={columnDividerKind}
            />
          </Fragment>
        )
      })}
    </div>
  )
}

export function HunminJejahaeZoneLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 flex items-center gap-2.5 sm:mb-4">
      <span className="h-px w-5 shrink-0 bg-gold/50" aria-hidden />
      <span className="font-sans text-xs font-medium tracking-[0.16em] text-gold sm:text-[13px]">
        {children}
      </span>
    </div>
  )
}

export function HunminJejahaeRow({
  basicColumnMinWidthPx,
  rowIndex,
  onBasicColumnWidth,
  showSecondaryZone,
  basicLabel,
  secondaryLabel,
  basic,
  secondary,
  scrollRef,
  dir,
  lang,
}: {
  basicColumnMinWidthPx: number
  rowIndex: number
  onBasicColumnWidth: (rowIndex: number, widthPx: number) => void
  showSecondaryZone: boolean
  basicLabel: string
  secondaryLabel: string
  basic: ReactNode
  secondary?: ReactNode
  scrollRef?: React.RefObject<HTMLDivElement>
  dir?: 'ltr' | 'rtl'
  lang?: string
}) {
  const measureRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    const report = () => onBasicColumnWidth(rowIndex, el.scrollWidth)
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [rowIndex, onBasicColumnWidth, basic, secondary])

  const gridStyle = {
    '--hunmin-basic-w':
      basicColumnMinWidthPx > 0 ? `${basicColumnMinWidthPx}px` : 'max-content',
    gridTemplateColumns: showSecondaryZone
      ? 'minmax(0, var(--hunmin-basic-w)) 1px minmax(0, 1fr)'
      : 'minmax(0, var(--hunmin-basic-w))',
  } as CSSProperties

  return (
    <div
      ref={scrollRef ?? undefined}
      className={`hunmin-jejahae-row max-w-full ${showSecondaryZone ? 'hunmin-jejahae-row--split' : ''}`}
      style={gridStyle}
      dir={dir}
      lang={lang}
    >
      <div
        className="hunmin-jejahae-basic"
        style={
          basicColumnMinWidthPx > 0
            ? { minWidth: basicColumnMinWidthPx, width: basicColumnMinWidthPx }
            : undefined
        }
      >
        <HunminJejahaeZoneLabel>{basicLabel}</HunminJejahaeZoneLabel>
        <div ref={measureRef} className="hunmin-jejahae-measure">
          {basic}
        </div>
      </div>
      {showSecondaryZone ? (
        <>
          <div className="hunmin-jejahae-zone-divider" aria-hidden />
          <div className="hunmin-jejahae-secondary">
            <HunminJejahaeZoneLabel>{secondaryLabel}</HunminJejahaeZoneLabel>
            {secondary}
          </div>
        </>
      ) : null}
    </div>
  )
}

/** 행 제목(양성·음성·아음…) — font-jamo 유지 + 한자 부제는 옆에 */
export function HunminJejahaeRowHeading({
  title,
  index,
  classicLabel,
}: {
  title: string
  index?: number
  classicLabel?: string
}) {
  return (
    <div className="mb-5 sm:mb-6">
      {index !== undefined ? (
        <p
          aria-hidden
          className="mb-2 flex items-center gap-2.5 font-sans text-[10.5px] tracking-[0.28em] text-gold"
        >
          <span className="h-px w-5 bg-gold/50" />
          {String(index + 1).padStart(2, '0')}
        </p>
      ) : null}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-jamo text-lg tracking-wide text-ink sm:text-xl" lang="ko">
          {title}
        </h3>
        {classicLabel ? (
          <span className="font-serif text-sm tracking-wide text-ink-muted sm:text-[15px]" lang="zh-Hant">
            {classicLabel}
          </span>
        ) : null}
      </div>
      <div
        aria-hidden
        className="mt-2.5 h-px w-full bg-gradient-to-r from-gold/40 via-hanji-border to-hanji-border/20 sm:mt-3"
      />
    </div>
  )
}
