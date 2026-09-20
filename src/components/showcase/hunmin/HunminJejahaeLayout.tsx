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
    /* groupIdx를 항상 접두어로 둔다 — 같은 spanLabel(예: 순음 행의 '각자병서'가
     * ㅃ·ㅶ 두 그룹으로 따로 존재)이 반복돼도 key가 겹치지 않도록 */
    const groupKey = `g${groupIdx}${group.spanLabel ? `-${group.spanLabel}` : ''}`
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

          return (
            <Fragment key={col.key}>
              {dividerKind ? <JejahaeColumnDivider /> : null}
              <div className="hunmin-jejahae-column shrink-0">
                {/* \ub77c\ubca8 \uc720\ubb34\uc640 \uc0c1\uad00\uc5c6\uc774 \ud56d\uc0c1 \ub80c\ub354\ub9c1 \u2014 \uac19\uc740 \uad6c\uc5ed(track) \uc548 \ud615\uc81c \ubc15\uc2a4\ub07c\ub9ac
                 * (\uc608: \ubaa8\uc74c "\uc0c1\ud615\uae30\ubcf8\uc790" vs "\ud569\uc131\uc790") \ub77c\ubca8 \uc720\ubb34\ub85c \ub192\uc774\uac00 \ub2ec\ub77c\uc9c0\uc9c0 \uc54a\uac8c */}
                <div className="hunmin-jejahae-col-label">
                  {col.subLabel ? (
                    <span>{col.subLabel}</span>
                  ) : (
                    <span className="invisible select-none" aria-hidden>
                      {'\u00a0'}
                    </span>
                  )}
                </div>
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
      <span className="font-sans text-xs font-medium text-gold sm:text-[13px]">
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
  classicLabel,
}: {
  title: string
  classicLabel?: string
}) {
  return (
    <div className="mb-5 sm:mb-6">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {/* font-jamo(EunpyeongSagaDogseo)는 같은 px에서도 실제 글자 잉크 크기가
         * 현대 음성학 쪽 font-serif보다 작게 나와서(실측 ~18px vs ~20px @20px),
         * 시각적으로 맞춰 보이도록 text-[1.3125rem](21px) 사용 */}
        <h3 className="font-jamo text-[1.3125rem] text-ink" lang="ko">
          {title}
        </h3>
        {classicLabel ? (
          <span className="font-serif text-sm text-ink-muted sm:text-[15px]" lang="zh-Hant">
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
