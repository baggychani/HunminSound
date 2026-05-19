import type { HunminSegment } from '@/data/hunminConsonantLayout'

/** symbol-btn 과 동일 — 구분선·자모 열 높이 기준 */
export const HUNMIN_GLYPH_RAIL_CLASS = 'flex h-20 shrink-0 items-center justify-center'

/** 구간 라벨 영역 — 열마다 높이를 맞춰 구분선이 글리프 중앙에 오게 함 */
export const HUNMIN_LABEL_BLOCK_CLASS =
  'mb-2 flex min-h-[2.85rem] w-full flex-col items-center justify-end gap-0.5 px-1 text-center'

/** 상형기본자 → 일반 가획(자음) / 합성자(모음): 가획·합성 관계 */
export function hunminSegmentSeparatorKind(
  prev: { label?: string; groupLine?: string },
  next: { label?: string; groupLine?: string },
): 'gaheuk-arrow' | 'pipe' {
  if (prev.label === '상형기본자' && (next.label === '일반 가획' || next.label === '합성자')) {
    return 'gaheuk-arrow'
  }
  if (prev.groupLine === '초출자' && next.groupLine === '재출자') return 'pipe'
  return 'pipe'
}

export function consonantSegmentSeparatorKind(
  prev: HunminSegment,
  next: HunminSegment,
): 'gaheuk-arrow' | 'pipe' {
  return hunminSegmentSeparatorKind(prev, next)
}

/** 모음 훈민 차트 — 구간 사이는 모두 | (상형기본자→합성자 포함) */
export function hunminVowelSegmentSeparatorKind(
  _prev: { label?: string; groupLine?: string },
  _next: { label?: string; groupLine?: string },
): 'gaheuk-arrow' | 'pipe' {
  return 'pipe'
}

export function HunminZoneHeading({ title }: { title: string }) {
  return (
    <div className="mb-4 w-full">
      <span className="block text-left font-sans text-xs leading-snug tracking-wide text-ink-muted sm:text-[13px]">
        {title}
      </span>
      <div className="mt-2.5 h-px w-full bg-hanji-border/80" aria-hidden />
    </div>
  )
}

export function HunminSegmentSeparator({ kind }: { kind: 'gaheuk-arrow' | 'pipe' }) {
  if (kind === 'gaheuk-arrow') {
    return (
      <svg
        width="26"
        height="20"
        viewBox="0 0 28 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink-muted/60 sm:h-[22px] sm:w-[30px]"
        aria-hidden
      >
        <path d="M2 10h19M17 5.5l6.5 4.5-6.5 4.5" />
      </svg>
    )
  }
  return (
    <span className="text-lg leading-none text-ink-muted/45 sm:text-xl" aria-hidden>
      |
    </span>
  )
}

const HUNMIN_COMPACT_RAIL_CLASS = 'flex h-[4.25rem] shrink-0 items-center justify-center sm:h-[4.75rem]'

/** 글리프 행(h-20) 안에서만 화살표·| 정렬 */
export function HunminBetweenSeparator({
  kind,
  compact,
}: {
  kind: 'gaheuk-arrow' | 'pipe'
  /** 모음 훈민 차트 등 좁은 행 */
  compact?: boolean
}) {
  const rail = compact ? HUNMIN_COMPACT_RAIL_CLASS : HUNMIN_GLYPH_RAIL_CLASS
  return (
    <div
      className={`${rail} ${kind === 'gaheuk-arrow' ? 'px-1 sm:px-1.5' : compact ? 'px-px sm:px-0.5' : 'px-0.5 sm:px-1'}`}
      aria-hidden
      title={kind === 'gaheuk-arrow' ? '가획' : undefined}
    >
      <HunminSegmentSeparator kind={kind} />
    </div>
  )
}
