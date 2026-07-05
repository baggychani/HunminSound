'use client'

/** 자모 ↔ IPA 대응 스트립 — 3막(연구)과 4막(문의) 사이를 잇는 무한 마퀴. 데스크톱 전용. */
const PAIRS = [
  ['ㄱ', 'k'],
  ['ㄴ', 'n'],
  ['ㄷ', 't'],
  ['ㄹ', 'ɾ'],
  ['ㅁ', 'm'],
  ['ㅂ', 'p'],
  ['ㅅ', 's'],
  ['ㅇ', 'ŋ'],
  ['ㅈ', 'tɕ'],
  ['ㅊ', 'tɕʰ'],
  ['ㅋ', 'kʰ'],
  ['ㅌ', 'tʰ'],
  ['ㅍ', 'pʰ'],
  ['ㅎ', 'h'],
  ['ㅏ', 'a'],
  ['ㅓ', 'ʌ'],
  ['ㅗ', 'o'],
  ['ㅜ', 'u'],
  ['ㅡ', 'ɯ'],
  ['ㅣ', 'i'],
] as const

function MarqueeRun() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {PAIRS.map(([jamo, ipa], i) => (
        <span key={i} className="flex items-baseline gap-2.5 px-7">
          <span className="font-jamo text-xl text-ink-muted/80" lang="ko">
            {jamo}
          </span>
          <span className="font-sans text-[13px] tracking-wide text-gold/80">[{ipa}]</span>
          <span className="ms-7 inline-block h-1 w-1 self-center rounded-full bg-ink-muted/30" />
        </span>
      ))}
    </div>
  )
}

export function HomeJamoMarquee() {
  return (
    <div
      aria-hidden
      className="jamo-marquee relative z-10 hidden overflow-hidden border-y border-hanji-border/70 bg-hanji-warm/40 py-3.5 lg:block"
      dir="ltr"
    >
      {/* 좌우 페이드 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-hanji to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-hanji to-transparent" />

      <div className="jamo-marquee-track">
        <MarqueeRun />
        <MarqueeRun />
      </div>
    </div>
  )
}
