import type { HunminSegment } from '@/data/hunminConsonantLayout'

/** symbol-btn 과 동일 — 구분선·자모 열 높이 기준 */
export const HUNMIN_GLYPH_RAIL_CLASS = 'flex h-20 shrink-0 items-center justify-center'

/** 구간 라벨 영역 — 열마다 높이를 맞춰 구분선이 글리프 중앙에 오게 함 */
export const HUNMIN_LABEL_BLOCK_CLASS =
  'mb-1.5 flex min-h-[1.35rem] w-full flex-col items-center justify-end gap-0.5 px-1 text-center'

/** 모음 훈민 — 합성자·ㅣ 합용자·상형기본자 등 span 라벨 + 가로선 */
export const HUNMIN_VOWEL_SPAN_HEADER_CLASS =
  'mb-1.5 flex w-full flex-col items-center justify-end gap-0 px-1 text-center'

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
    <div className="mb-1.5 w-full">
      <span className="block text-left font-sans text-xs leading-snug tracking-wide text-ink-muted sm:text-[13px]">
        {title}
      </span>
      <div className="mt-1.5 h-px w-full bg-hanji-border/80" aria-hidden />
    </div>
  )
}

/** 상형기본자 → 일반 가획·합성자 관계 표시 */
function GaheukArrow() {
  return (
    <svg
      viewBox="0 0 36 16"
      fill="none"
      className="hunmin-gaheuk-arrow h-3.5 w-9 sm:h-4 sm:w-10"
      aria-hidden
    >
      <path d="M1.5 8h24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M22 4.25 29.5 8 22 11.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HunminSegmentSeparator({ kind }: { kind: 'gaheuk-arrow' | 'pipe' }) {
  if (kind === 'gaheuk-arrow') {
    return <GaheukArrow />
  }
  return (
    <span className="text-lg leading-none text-ink-muted/45 sm:text-xl" aria-hidden>
      |
    </span>
  )
}

const HUNMIN_COMPACT_RAIL_CLASS = 'flex h-[4.625rem] shrink-0 items-center justify-center sm:h-[4.875rem]'

/** span 라벨+가로선 높이 — 가획 화살표를 글리프 행과 맞출 때 사용 */
const HUNMIN_SPAN_HEADER_SPACER_CLASS = `${HUNMIN_VOWEL_SPAN_HEADER_CLASS} pointer-events-none select-none`

/** 모음·자음 훈민 — 열 전체 높이 세로 구분선 (라벨~카드) */
export function HunminColumnSeparator({ kind = 'pipe' }: { kind?: 'gaheuk-arrow' | 'pipe' }) {
  if (kind === 'gaheuk-arrow') {
    return (
      <div
        className="flex w-5 shrink-0 flex-col self-stretch sm:w-6"
        aria-hidden
        title="가획"
      >
        <div className={HUNMIN_SPAN_HEADER_SPACER_CLASS}>
          <span className="invisible hunmin-vowel-segment-label" aria-hidden>
            {'\u00a0'}
          </span>
          <div className="mt-1.5 h-px w-full min-w-[5.5rem] opacity-0" aria-hidden />
        </div>
        <div className={`${HUNMIN_GLYPH_RAIL_CLASS} w-full`}>
          <GaheukArrow />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-3 shrink-0 self-stretch items-stretch justify-center sm:w-3.5" aria-hidden>
      <span className="w-px min-h-full self-stretch bg-hanji-border/70" />
    </div>
  )
}

/** @deprecated HunminColumnSeparator 사용 */
export function HunminVowelColumnSeparator() {
  return <HunminColumnSeparator kind="pipe" />
}

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
      className={`${rail} ${kind === 'gaheuk-arrow' ? 'px-1 sm:px-1.5' : compact ? 'px-0.5 sm:px-1' : 'px-0.5 sm:px-1'}`}
      aria-hidden
      title={kind === 'gaheuk-arrow' ? '가획' : undefined}
    >
      <HunminSegmentSeparator kind={kind} />
    </div>
  )
}
