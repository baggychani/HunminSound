'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

export default function HomePage() {
  const { lang } = useLang()
  const m = getMessages(lang)

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* 히어로 섹션 */}
      <section className="pt-28 sm:pt-32 pb-20 md:pb-24 text-center">
        <p
          className={
            lang === 'ko'
              ? 'font-serif text-sm sm:text-base text-ink-muted tracking-wide mb-6'
              : `font-sans text-xs text-ink-muted tracking-[0.3em] uppercase mb-6 ${
                  lang === 'hi'
                    ? 'font-devanagari normal-case tracking-normal text-[13px] leading-relaxed'
                    : ''
                }`
          }
          lang={lang === 'hi' ? 'hi' : undefined}
        >
          {m.homeSubtitle}
        </p>

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl text-ink leading-none tracking-wide mb-4">
          세종말소리
        </h1>

        <p
          className={`font-sans text-sm text-ink-muted tracking-[0.2em] ${
            lang === 'ko' ? 'mb-0' : 'mb-10'
          }`}
        >
          Sejong Speech Sounds
        </p>

        {lang === 'ko' ? (
          <>
            {/* 브랜드 영역과 소개 영역 구분 — 상단은 타이틀, 하단은 훈민정음 소개(배경 애니메이션 예정) */}
            <div
              className="mt-14 sm:mt-20 w-full max-w-2xl mx-auto border-t border-hanji-border"
              aria-hidden
            />
            <div className="relative isolate mt-12 sm:mt-16 max-w-2xl mx-auto px-1 sm:px-2">
              <div
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-sm"
                aria-hidden
              />
              <p className="relative z-10 font-serif text-base sm:text-[17px] text-ink-soft leading-loose">
                <span className="sm:hidden whitespace-normal">
                  {m.homeIntroPart1} {m.homeIntroPart2}
                </span>
                <span className="hidden sm:inline">
                  {m.homeIntroPart1}
                  <br />
                  {m.homeIntroPart2}
                </span>
              </p>
            </div>
          </>
        ) : null}

        <div className={`section-divider ${lang === 'ko' ? 'mt-14 sm:mt-16' : ''}`} />

        {lang !== 'ko' && m.homeDescription.trim() ? (
          <p className="font-sans text-base text-ink-soft leading-relaxed max-w-xl mx-auto mt-8">
            <span className="sm:hidden whitespace-normal">
              {m.homeDescription.replace(/\n/g, ' ')}
            </span>
            <span className="hidden sm:inline whitespace-pre-line">{m.homeDescription}</span>
          </p>
        ) : null}
      </section>

      {/* 네비게이션 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-hanji-border mb-24">
        <NavCard
          href="/consonants"
          label={m.consonants}
          count={m.consonantsCount}
          preview={['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ']}
          description={m.consonantsCardDesc}
          explore={m.explore}
        />
        <NavCard
          href="/vowels"
          label={m.vowels}
          count={m.vowelsCount}
          preview={['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', 'ㅑ']}
          description={m.vowelsCardDesc}
          explore={m.explore}
        />
      </section>

      {/* 소개 섹션 — 한국어는 히어로에 통합. 타 언어는 하단 유지 */}
      {lang !== 'ko' ? (
        <section className="pb-24 max-w-2xl mx-auto text-center">
          <div className="section-divider" />
          <p
            className={`font-serif text-base text-ink-soft leading-loose mt-8 ${
              lang === 'hi' ? 'font-devanagari' : ''
            }`}
            lang={lang === 'hi' ? 'hi' : undefined}
          >
            {m.homeIntroPart1}
            <br className="hidden sm:block" />
            {m.homeIntroPart2}
          </p>
          {m.homeSub.trim() ? (
            <p className="font-sans text-xs text-ink-muted mt-6 tracking-wider">{m.homeSub}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}

interface NavCardProps {
  href: string
  label: string
  count: string
  preview: string[]
  description: string
  explore: string
}

function NavCard({ href, label, count, preview, description, explore }: NavCardProps) {
  return (
    <Link
      href={href}
      className="group bg-hanji hover:bg-hanji-warm transition-colors p-10 sm:p-12 flex flex-col gap-6"
    >
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-serif text-4xl text-ink group-hover:text-ink-accent transition-colors">
            {label}
          </span>
        </div>
        <span className="font-sans text-xs text-ink-muted">{count}</span>
      </div>

      <div className="flex gap-3 flex-wrap" dir="ltr" lang="ko">
        {preview.map((symbol) => (
          <span
            key={symbol}
            className="font-serif text-2xl text-ink-muted group-hover:text-ink transition-colors"
          >
            {symbol}
          </span>
        ))}
        <span className="font-sans text-xl text-ink-muted self-end pb-1">…</span>
      </div>

      <p className="font-sans text-xs text-ink-muted leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-2 mt-auto">
        <span className="font-sans text-xs text-gold tracking-wider">{explore}</span>
        <span className="text-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-block">
          →
        </span>
      </div>
    </Link>
  )
}
