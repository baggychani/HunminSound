'use client'

import { Fragment, useMemo } from 'react'

/* ── 문자 분류 정규식 ──────────────────────────────────────────────────
 * - CJK 통합/확장A 한자만 호버 대상.
 * - 한글(현대): U+AC00–U+D7A3
 * - 한글 자모(현대 단자모 + 옛한글 호환·확장): U+1100–U+11FF, U+3131–U+318E,
 *                                           U+A960–U+A97F, U+D7B0–U+D7FF
 */
const HANJA_REGEX = /[\u4E00-\u9FFF\u3400-\u4DBF]/
const HANGUL_SYLL = /[\uAC00-\uD7A3]/
const HANGUL_JAMO = /[\u1100-\u11FF\u3131-\u318E\uA960-\uA97F\uD7B0-\uD7FF]/

type Token =
  | { kind: 'hanja'; char: string; key: string }
  | { kind: 'jamo'; char: string; key: string }
  | { kind: 'hangul'; char: string; key: string }
  | { kind: 'bracket'; text: string; key: string }
  | { kind: 'other'; text: string; key: string }

/**
 * 본문을 토큰화한다.
 * `[...]` 블록(예: `[기]`, `[ᅀᅵ]`)을 먼저 추출하고, 나머지는 글자 단위로 분류한다.
 * `bracket` 토큰은 시각적 보조 표시(주된 본문 흐름보다 작고 흐리게)로 렌더된다.
 */
function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  let n = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch === '[') {
      const end = text.indexOf(']', i + 1)
      if (end > i) {
        tokens.push({ kind: 'bracket', text: text.slice(i + 1, end), key: `b-${n++}` })
        i = end + 1
        continue
      }
    }
    const key = `t-${n++}`
    if (HANJA_REGEX.test(ch)) tokens.push({ kind: 'hanja', char: ch, key })
    else if (HANGUL_JAMO.test(ch)) tokens.push({ kind: 'jamo', char: ch, key })
    else if (HANGUL_SYLL.test(ch)) tokens.push({ kind: 'hangul', char: ch, key })
    else tokens.push({ kind: 'other', text: ch, key })
    i += 1
  }
  return tokens
}

/**
 * 한자 훈음(예: "바를 정", "첫째지지 자", "오그릴 축")에서 끝 토큰 = 음(독음) 한 글자만 추출.
 * 띄어쓰기 2개 이상이어도 마지막 단어가 항상 한국어 한 음절 독음이라는 점을 이용한다.
 */
function extractYum(gloss: string | undefined): string | null {
  if (!gloss) return null
  const parts = gloss.trim().split(/\s+/)
  const last = parts[parts.length - 1]
  return last && last.length > 0 ? last : null
}

interface HanjaTextProps {
  text: string
  /** 한자 → 한국어 훈음 매핑(예: 正 → "바를 정"). */
  charGlosses: Record<string, string>
  /** 호버 중인 한자(없으면 null). */
  activeChar: string | null
  /** 한자 hover/focus 진입·이탈 콜백. */
  onCharFocus: (char: string | null) => void
  className?: string
}

/**
 * 한문 원문을 렌더한다.
 *
 * - 한자: `<ruby>` 안에 두어 위쪽에 작은 한국어 독음(`<rt>`)이 글자별 가운데 정렬로 표시됨.
 *   호버/포커스 시 한자만 살짝 위로 떠오르며 색이 강조되고, 부모(Card)의 슬롯에
 *   전체 훈음("바를 정")이 표시된다.
 * - 옛 한글(자모, 예: `ᅀᅵ`, `ᅙᅵ`): 동일 본문 흐름이되 명시적 자모 폰트 패밀리에 위임.
 * - 대괄호 안 내용(예: `[기]`): 한자 옆 발음 표시. 작고 흐린 표시로 처리.
 */
export function HanjaText({
  text,
  charGlosses,
  activeChar,
  onCharFocus,
  className,
}: HanjaTextProps) {
  const tokens = useMemo(() => tokenize(text), [text])

  return (
    <span className={className}>
      {tokens.map((tok) => {
        if (tok.kind === 'hanja') {
          const yum = extractYum(charGlosses[tok.char])
          const interactive = !!charGlosses[tok.char]
          const isActive = activeChar === tok.char
          return (
            <HanjaWithYum
              key={tok.key}
              char={tok.char}
              yum={yum}
              interactive={interactive}
              isActive={isActive}
              onFocus={onCharFocus}
            />
          )
        }
        if (tok.kind === 'jamo') {
          return (
            <span key={tok.key} className="hunmin-jamo" lang="ko">
              {tok.char}
            </span>
          )
        }
        if (tok.kind === 'bracket') {
          return (
            <span
              key={tok.key}
              className="mx-[0.05em] inline-block align-baseline text-[0.6em] font-sans tracking-tight text-ink-muted/80"
              lang="ko"
              aria-label={`발음 ${tok.text}`}
            >
              [{tok.text}]
            </span>
          )
        }
        if (tok.kind === 'hangul') {
          return (
            <span
              key={tok.key}
              className="text-[0.55em] align-baseline text-ink-muted"
              lang="ko"
            >
              {tok.char}
            </span>
          )
        }
        return <Fragment key={tok.key}>{tok.text}</Fragment>
      })}
    </span>
  )
}

interface HanjaWithYumProps {
  char: string
  yum: string | null
  interactive: boolean
  isActive: boolean
  onFocus: (char: string | null) => void
}

/**
 * 한자 한 글자 + (위쪽 작은 글씨 독음).
 * `<ruby>` 태그로 글자별 가운데 정렬 보장. 호버 시 base 한자만 살짝 떠오르고 ruby
 * annotation(rt)은 위치 고정(rt에는 transform 적용 안 함)으로 안정감을 준다.
 */
function HanjaWithYum({ char, yum, interactive, isActive, onFocus }: HanjaWithYumProps) {
  const hanjaCls = [
    'hunmin-hanja inline-block transition-[transform,color] duration-200 ease-out',
    interactive
      ? 'cursor-help hover:-translate-y-[2px] hover:text-ink-accent focus-visible:-translate-y-[2px] focus-visible:text-ink-accent'
      : '',
    isActive ? '-translate-y-[2px] text-ink-accent' : '',
  ]
    .join(' ')
    .trim()

  /* ruby에 onMouseEnter/Leave를 걸어두면 rt(독음) 영역에서도 호버가 유지된다. */
  const handlers = interactive
    ? {
        onMouseEnter: () => onFocus(char),
        onMouseLeave: () => onFocus(null),
        onFocus: () => onFocus(char),
        onBlur: () => onFocus(null),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Escape') onFocus(null)
        },
        tabIndex: 0,
        role: 'button',
      }
    : {}

  return (
    <ruby
      className="hunmin-ruby relative align-baseline"
      lang="zh-Hant"
      {...handlers}
    >
      <span className={hanjaCls}>{char}</span>
      <rt
        className={[
          'hunmin-rt font-sans tracking-tight transition-colors duration-200 ease-out',
          isActive ? 'text-ink-accent/85' : 'text-ink-muted/85',
        ].join(' ')}
        lang="ko"
      >
        {yum ?? '\u00a0'}
      </rt>
    </ruby>
  )
}
