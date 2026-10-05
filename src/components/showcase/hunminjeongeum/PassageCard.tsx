'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { HanjaText } from './HanjaText'
import { TranslatedPassageText } from './TranslatedPassageText'
import { HunminPassageText } from './HunminPassageText'
import type { HunminPassage, GlyphLink } from '@/data/hunminjeongeumPassages'
import { phoneticsChartHref } from '@/lib/phoneticsHref'

/** 제자해 문장에서 넘어가므로 차트도 제자해 보기로 연다 */
function buildGlyphHref(link: GlyphLink): string {
  return phoneticsChartHref(link.target, link.id, 'hunmin')
}

interface PassageCardProps {
  passage: HunminPassage
}

export function PassageCard({ passage }: PassageCardProps) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const [hovered, setHovered] = useState<{ key: string; char: string } | null>(null)

  const gloss = hovered ? passage.charGlosses[hovered.char] ?? null : null
  const linkLabel = m.hunminPronunciationLink ?? 'See pronunciation'
  const showExtraTranslation = lang !== 'ko'

  return (
    <article className="group/passage relative pl-7 sm:pl-10">
      {/* 일련번호 — 첫 줄 한자와 윗선이 맞게 (ruby 독음 높이만큼 내림) */}
      <span
        className="absolute left-0 top-8 select-none font-serif text-[11px] leading-none tracking-[0.06em] text-ink-muted sm:text-xs"
      >
        <span aria-hidden>[{passage.number}]</span>
        <span className="sr-only">{m.hunminPassageLabel.replace('{n}', passage.number)}</span>
      </span>

      {/* 한문 원문 (글자별 위에 독음) */}
      <p
        className="hunmin-original break-keep text-[clamp(1.5rem,2.8vw,2rem)] font-serif leading-[2.5] tracking-[0.04em] text-ink [overflow-wrap:break-word]"
        lang="ko"
      >
        <HanjaText
          text={passage.originalText}
          charGlosses={passage.charGlosses}
          activeKey={hovered?.key ?? null}
          onCharFocus={(key, char) => setHovered(key && char ? { key, char } : null)}
        />
      </p>

      {/* 호버 슬롯 — 한 줄, 카드 사이 점프 방지를 위해 항상 자리 확보 */}
      <div
        aria-live="polite"
        className="mt-1 flex h-[1.4em] items-center gap-2 font-sans text-[15px] leading-none text-ink-muted sm:text-base"
      >
        {gloss && hovered ? (
          <>
            <span className="font-serif text-[0.95em] text-ink-accent" lang="zh-Hant">
              {hovered.char}
            </span>
            <span className="text-ink-muted/40">·</span>
            <span lang="ko">{gloss}</span>
          </>
        ) : (
          <span className="invisible">{m.hunminHoverHint ?? ''}</span>
        )}
      </div>

      {/* 출처(해례본 위치) — 위 호버 풀이와 여백을 두고, 자간은 보통으로 */}
      <p className="mt-7 font-sans text-[11px] uppercase tracking-[0.06em] text-ink-muted sm:text-xs">
        {passage.reference}
      </p>

      {/* 한국어 풀이 — 항상 노출. 여러 줄이 되어도 숨쉬게 원문보다 넓은 줄간격. 본문 흐름 속 단독 자모(ㄱ, ㄴ …)는 교수님 지정 폰트로. */}
      <p
        className="mt-4 break-keep font-serif text-[17px] leading-[2.8] text-ink-soft [overflow-wrap:break-word] sm:text-lg"
        lang="ko"
      >
        <HunminPassageText text={passage.korean} />
      </p>

      {/* 추가 언어 풀이 — 사이트 언어가 한국어가 아닐 때, 자동 번역(필요 시) 적용 */}
      {showExtraTranslation ? (
        <TranslatedPassageText
          passage={passage}
          lang={lang}
          className="mt-3 font-sans text-[12.5px] sm:text-[13.5px] leading-[2.2] text-ink-muted"
        />
      ) : null}

      {/* 발음 보기 링크 — 본문에 등장하는 한글 자모만 */}
      {passage.glyphLinks && passage.glyphLinks.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {passage.glyphLinks.map((link, idx) => (
            <Link
              key={`${link.symbol}-${idx}`}
              href={buildGlyphHref(link)}
              className="group/link inline-flex items-baseline gap-1.5 font-sans text-xs tracking-[0.04em] text-ink-muted transition-colors hover:text-ink-accent focus-visible:text-ink-accent sm:text-[13px]"
            >
              <span
                className="font-jamo text-[15px] leading-none text-ink-muted transition-colors group-hover/link:text-ink-accent sm:text-base"
                lang="ko"
              >
                {link.symbol}
              </span>
              <span>{linkLabel}</span>
              <span aria-hidden className="transition-transform group-hover/link:translate-x-0.5">
                →
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  )
}
