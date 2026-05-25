'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { HanjaText } from './HanjaText'
import { TranslatedPassageText } from './TranslatedPassageText'
import { HunminPassageText } from './HunminPassageText'
import type { HunminPassage, GlyphLink } from '@/data/hunminjeongeumPassages'

function buildGlyphHref(link: GlyphLink): string {
  return `/${link.target}`
}

interface PassageCardProps {
  passage: HunminPassage
  /** 캐러셀 등 내부 슬라이드 — 진입 애니메이션 생략 */
  embedded?: boolean
  /** v2 해례본 섹션 등 — 본문 크기 확대 */
  prominent?: boolean
}

export function PassageCard({ passage, embedded, prominent }: PassageCardProps) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const [hoveredChar, setHoveredChar] = useState<string | null>(null)

  const gloss = hoveredChar ? passage.charGlosses[hoveredChar] ?? null : null
  const linkLabel = m.hunminPronunciationLink ?? 'See pronunciation'
  const showExtraTranslation = lang !== 'ko'

  const articleClass = `group/passage relative pl-8 sm:pl-12${prominent ? ' hunmin-passage-prominent' : ''}`

  const body = (
    <>
      <span
        aria-label={`해례본 ${passage.number}번 문장`}
        className="absolute left-0 top-3 select-none font-serif text-[10.5px] leading-none tracking-[0.06em] text-ink-muted/80 sm:text-[11.5px]"
      >
        [{passage.number}]
      </span>

      <p
        className="hunmin-original break-keep text-[clamp(1.4rem,2.6vw,1.85rem)] font-serif leading-[2.7] tracking-[0.04em] text-ink [overflow-wrap:break-word]"
        lang="ko"
      >
        <HanjaText
          text={passage.originalText}
          charGlosses={passage.charGlosses}
          activeChar={hoveredChar}
          onCharFocus={setHoveredChar}
        />
      </p>

      <div
        aria-live="polite"
        className="mt-2 flex h-[1.4em] items-center gap-2 font-sans text-xs leading-none text-ink-muted/85 sm:text-[13px]"
      >
        {gloss && hoveredChar ? (
          <>
            <span className="font-serif text-[0.95em] text-ink-accent" lang="zh-Hant">
              {hoveredChar}
            </span>
            <span className="text-ink-muted/40">·</span>
            <span lang="ko">{gloss}</span>
          </>
        ) : (
          <span className="invisible">{m.hunminHoverHint ?? ''}</span>
        )}
      </div>

      <p className="mt-3 font-sans text-[10.5px] uppercase tracking-[0.18em] text-ink-muted/70 sm:text-[11px]">
        {passage.reference}
      </p>

      <p
        className="hunmin-korean mt-4 break-keep font-serif text-[15px] leading-[2.2] text-ink-soft [overflow-wrap:break-word] sm:text-[16px]"
        lang="ko"
      >
        <HunminPassageText text={passage.korean} />
      </p>

      {showExtraTranslation ? (
        <TranslatedPassageText
          passage={passage}
          lang={lang}
          className="mt-3 font-sans text-[12.5px] sm:text-[13.5px] leading-[2.2] text-ink-muted"
        />
      ) : null}

      {passage.glyphLinks && passage.glyphLinks.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {passage.glyphLinks.map((link, idx) => (
            <Link
              key={`${link.symbol}-${idx}`}
              href={buildGlyphHref(link)}
              className="group/link inline-flex items-baseline gap-1.5 font-sans text-[11px] tracking-[0.04em] text-ink-muted/55 transition-colors hover:text-ink-accent/85 focus-visible:text-ink-accent/85 sm:text-[12px]"
            >
              <span
                className="font-jamo text-[14px] leading-none text-ink-muted/60 transition-colors group-hover/link:text-ink-accent/85 sm:text-[15px]"
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
    </>
  )

  if (embedded) {
    return <article className={articleClass}>{body}</article>
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={articleClass}
    >
      {body}
    </motion.article>
  )
}
