'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

/* ── 자석 기호 컴포넌트 ────────────────────────────────────────────────── */
function MagneticGlyph({ children, className }: { children: string; className: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 터치 기기에서는 비활성화
    if (window.matchMedia('(pointer: coarse)').matches) return

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const threshold = 60
      if (dist < threshold) {
        const pull = (1 - dist / threshold) * 6
        x.set((dx / dist) * pull)
        y.set((dy / dist) * pull)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <motion.span ref={ref} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.span>
  )
}

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

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl text-ink leading-none tracking-wide">
          세종말소리
        </h1>

        <p
          className={`mt-5 sm:mt-6 font-sans text-sm text-ink-muted tracking-[0.2em] ${
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

      {/* 네비게이션 카드 — 자음·모음 2열, 훈민정음 전 너비 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-hanji-border mb-px">
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
        <HunminjeongeumCard
          href="/hunminjeongeum"
          label={m.hunminjeongeum}
          caption={m.hunminjeongeumCaption}
          description={m.hunminjeongeumCardDesc}
          explore={m.explore}
        />
      </section>

      {/* 훈민정음과 연구 소개 사이 — 이후 3D·배너 등 삽입 가능 */}
      <div className="pt-14 sm:pt-20" aria-hidden />

      <ResearchCard
        href="/research"
        label={m.research}
        description={m.researchCardDesc}
        cta={m.researchCta}
      />
      <div className="mb-24" />

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

interface ResearchCardProps {
  href: string
  label: string
  description: string
  cta: string
}

function ResearchCard({ href, label, description, cta }: ResearchCardProps) {
  return (
    <Link
      href={href}
      className="group mx-auto block max-w-2xl bg-hanji px-8 py-8 text-left transition-colors hover:bg-hanji-warm sm:px-10 sm:py-9"
    >
      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          <span className="font-serif text-xl text-ink transition-colors group-hover:text-ink-accent">
            {label}
          </span>
          <p className="mt-2 font-sans text-xs leading-relaxed text-ink-muted">{description}</p>
        </div>
        <div className="flex justify-end pt-0.5">
          <span className="flex items-center gap-2">
            <span className="font-sans text-xs text-gold">{cta}</span>
            <span className="inline-block text-base text-gold transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}

interface HunminjeongeumCardProps {
  href: string
  label: string
  caption: string
  description: string
  explore: string
}

/** 자음/모음 격자 아래 전 너비 — 동급 중요도로 크게 표시 */
function HunminjeongeumCard({ href, label, caption, description, explore }: HunminjeongeumCardProps) {
  const baseShapes = ['ㄱ', 'ㄴ', 'ㅁ', 'ㅅ', 'ㅇ']

  return (
    <Link
      href={href}
      className="group col-span-1 sm:col-span-2 relative overflow-hidden bg-hanji hover:bg-hanji-warm transition-colors p-10 sm:p-12 flex flex-col gap-6"
    >
      {/* 배경 장식 — 訓民正音 흐린 한자 */}
      <span
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-serif text-[clamp(3.5rem,10vw,7rem)] leading-none text-ink/[0.04] dark:text-ink/[0.06]"
        aria-hidden
      >
        訓民正音
      </span>

      <div className="relative z-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-serif text-4xl text-ink group-hover:text-ink-accent transition-colors">
            {label}
          </span>
        </div>
        <span className="font-sans text-xs text-ink-muted tracking-[0.06em]">{caption}</span>
      </div>

      <div className="relative z-10 flex gap-3 flex-wrap" dir="ltr" lang="ko">
        {baseShapes.map((s) => (
          <span key={s} className="font-serif text-2xl text-ink-muted group-hover:text-ink transition-colors">
            {s}
          </span>
        ))}
        <span className="font-sans text-xl text-ink-muted self-end pb-1">…</span>
      </div>

      <p className="relative z-10 font-sans text-xs text-ink-muted leading-relaxed max-w-xl">
        {description}
      </p>

      <div className="relative z-10 flex items-center gap-2 mt-auto">
        <span className="font-sans text-xs text-gold tracking-wider">{explore}</span>
        <span className="text-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-block">
          →
        </span>
      </div>
    </Link>
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
          <MagneticGlyph
            key={symbol}
            className="font-serif text-2xl text-ink-muted group-hover:text-ink transition-colors inline-block"
          >
            {symbol}
          </MagneticGlyph>
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
