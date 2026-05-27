'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useSiteMessages } from '@/hooks/useSiteMessages'
import { ScrollColorWash } from '@/components/ui/ScrollColorWash'
import { HeroActBackdrop } from '@/components/ui/HeroActBackdrop'
import { HaeryebonCardWatermark } from '@/components/showcase/HaeryebonCardWatermark'
import { HunminBookViewer } from '@/components/showcase/HunminBookViewer'
import { HomeResearchAct } from '@/components/home/HomeResearchAct'
import { HomeContactSection } from '@/components/home/HomeContactSection'
import { useHomeActScroll } from '@/hooks/useHomeActScroll'

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
  const { m, lang } = useSiteMessages()
  const act1Ref = useRef<HTMLElement>(null)
  const act2Ref = useRef<HTMLElement>(null)
  const act3Ref = useRef<HTMLElement>(null)
  const act4Ref = useRef<HTMLElement>(null)

  useHomeActScroll(act1Ref, act2Ref, act3Ref, act4Ref)

  const heroHeightClass = 'h-[calc(100dvh-var(--site-header-h,4rem))] min-h-0'
  /** 4막만 1뷰포트 고정 포기 — 내용 높이만큼 늘어나고, 최소 1화면은 유지 */
  const act4SectionClass = 'min-h-[calc(100dvh-var(--site-header-h,4rem))]'

  return (
    <div className="relative w-full">
      <ScrollColorWash actRefs={{ act1: act1Ref, act2: act2Ref, act3: act3Ref }} />

      {/* 1막 — 히어로 (모든 언어 동일 레이아웃·배경·3D) */}
      <section
        ref={act1Ref}
        id="home-act1"
        className={`relative z-10 ${heroHeightClass} overflow-hidden isolation-isolate`}
      >
        <HeroActBackdrop heroRef={act1Ref} />

        <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center px-6 sm:px-8 sm:ps-[4vw] lg:grid-cols-[0.42fr_1.18fr_0.88fr] lg:px-10 lg:ps-[5vw]">
          <div className="hidden lg:block" aria-hidden />

          <div className="flex flex-col items-center text-center translate-x-[clamp(0.25rem,2vw,0.75rem)] sm:translate-x-[clamp(0.5rem,2.5vw,1rem)] lg:translate-x-0">
            <p
              className={`font-serif text-[15px] text-ink-muted tracking-wide sm:text-[17px] ${
                lang === 'hi' ? 'font-devanagari normal-case tracking-normal' : ''
              }`}
              lang={lang === 'hi' ? 'hi' : undefined}
            >
              {m.homeSubtitle}
            </p>

            <h1
              className={`mt-4 font-jamo leading-none tracking-wide text-ink sm:mt-5 ${
                lang === 'ko'
                  ? 'text-[4rem] sm:text-[4.75rem] md:text-[6.35rem] lg:text-[5.85rem]'
                  : 'text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]'
              }`}
            >
              {m.siteTitle}
            </h1>

            <p className="mt-4 font-sans text-sm tracking-[0.2em] text-ink-muted sm:mt-5">
              Sejong Speech Sounds
            </p>

            <div className="mx-auto -mt-1 w-full max-w-lg shrink-0 sm:mt-0 lg:max-w-xl">
              <div
                className="relative h-[min(clamp(12rem,24vw,19.5rem),max(8rem,calc(100dvh-var(--site-header-h,4rem)-22rem)))] w-full"
                aria-hidden
              >
                <HunminBookViewer className="absolute inset-0" />
              </div>
            </div>

            <p
              className={`relative mt-3 w-full max-w-[min(100%,42rem)] shrink-0 break-keep px-1 font-serif text-base leading-loose text-ink-soft [overflow-wrap:break-word] sm:mt-4 sm:px-0 sm:text-[17px] whitespace-pre-line ${
                lang === 'hi' ? 'font-devanagari' : ''
              }`}
              lang={lang === 'hi' ? 'hi' : undefined}
            >
              {m.homeIntro}
            </p>
          </div>

          <div className="hidden min-h-[12rem] lg:block" aria-hidden />
        </div>
      </section>

      {/* 2막 — 자음 · 모음 · 훈민정음 (1뷰포트) */}
      <section
        ref={act2Ref}
        id="home-act2"
        className={`home-scroll-margin site-container relative z-10 flex ${heroHeightClass} flex-col justify-center overflow-hidden py-[clamp(0.75rem,2dvh,1.5rem)]`}
      >
        <div className="grid min-h-0 w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5">
        <NavCard
          compact
          href="/consonants"
          label={m.consonants}
          count={m.consonantsCount}
          preview={['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ']}
          description={m.consonantsCardDesc}
          explore={m.explore}
        />
        <NavCard
          compact
          href="/vowels"
          label={m.vowels}
          count={m.vowelsCount}
          preview={['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', 'ㅑ']}
          description={m.vowelsCardDesc}
          explore={m.explore}
        />
        <HunminjeongeumCard
          compact
          href="/hunminjeongeum"
          label={m.hunminjeongeum}
          caption={m.hunminjeongeumCaption}
          description={m.hunminjeongeumCardDesc}
          explore={m.explore}
        />
        </div>
      </section>

      {/* 3막 — 연구 소개 (다크 풀블리드 · 1뷰포트) */}
      <HomeResearchAct ref={act3Ref} />

      {/* 4막 — 문의하기 (최소 1뷰포트, 내용 많으면 세로로 확장) */}
      <section
        ref={act4Ref}
        id="home-act4"
        className={`home-scroll-margin site-container relative z-10 flex ${act4SectionClass} flex-col justify-center py-[clamp(1rem,2.5dvh,2rem)] lg:py-[clamp(1.25rem,3dvh,2.5rem)]`}
      >
        <HomeContactSection />
      </section>
    </div>
  )
}

interface HunminjeongeumCardProps {
  href: string
  label: string
  caption: string
  description: string
  explore: string
  compact?: boolean
}

/** 자음/모음 격자 아래 전 너비 — 동급 중요도로 크게 표시 */
function HunminjeongeumCard({
  href,
  label,
  caption,
  description,
  explore,
  compact = false,
}: HunminjeongeumCardProps) {
  const baseShapes = ['ㄱ', 'ㄴ', 'ㅁ', 'ㅅ', 'ㅇ']

  return (
    <Link
      href={href}
      className={`group col-span-1 sm:col-span-2 relative overflow-hidden rounded-sm border border-hanji-border/60 bg-hanji/75 backdrop-blur-md transition-colors hover:bg-hanji/90 hover:border-hanji-border flex flex-col dark:bg-hanji/65 dark:hover:bg-hanji/80 ${
        compact ? 'gap-4 p-6 sm:gap-5 sm:p-7 lg:p-8' : 'gap-6 p-10 sm:p-12'
      }`}
    >
      <HaeryebonCardWatermark />

      <div className="relative z-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span
            className={`font-jamo text-ink group-hover:text-ink-accent transition-colors ${
              compact ? 'text-3xl lg:text-4xl' : 'text-4xl'
            }`}
          >
            {label}
          </span>
        </div>
        <span className="font-sans text-xs text-ink-muted tracking-[0.06em]">{caption}</span>
      </div>

      <div className="relative z-10 flex gap-2 flex-wrap sm:gap-3" dir="ltr" lang="ko">
        {baseShapes.map((s) => (
          <span
            key={s}
            className={`font-jamo text-ink-muted group-hover:text-ink transition-colors ${
              compact ? 'text-xl sm:text-2xl' : 'text-2xl'
            }`}
          >
            {s}
          </span>
        ))}
        <span className="font-sans text-xl text-ink-muted self-end pb-1">…</span>
      </div>

      <p className="relative z-10 break-keep font-sans text-xs text-ink-muted leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none [overflow-wrap:break-word]">
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
  compact?: boolean
}

function NavCard({
  href,
  label,
  count,
  preview,
  description,
  explore,
  compact = false,
}: NavCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-sm border border-hanji-border/60 bg-hanji/75 backdrop-blur-md transition-colors hover:bg-hanji/90 hover:border-hanji-border dark:bg-hanji/65 dark:hover:bg-hanji/80 ${
        compact ? 'min-h-0 gap-4 p-6 sm:gap-5 sm:p-7 lg:p-8' : 'gap-6 p-10 sm:p-12'
      }`}
    >
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <span
            className={`font-jamo text-ink group-hover:text-ink-accent transition-colors ${
              compact ? 'text-3xl lg:text-4xl' : 'text-4xl'
            }`}
          >
            {label}
          </span>
        </div>
        <span className="font-sans text-xs text-ink-muted">{count}</span>
      </div>

      <div className="flex gap-2 flex-wrap sm:gap-3" dir="ltr" lang="ko">
        {preview.map((symbol) => (
          <MagneticGlyph
            key={symbol}
            className={`font-jamo text-ink-muted group-hover:text-ink transition-colors inline-block ${
              compact ? 'text-xl sm:text-2xl' : 'text-2xl'
            }`}
          >
            {symbol}
          </MagneticGlyph>
        ))}
        <span className="font-sans text-xl text-ink-muted self-end pb-1">…</span>
      </div>

      <p
        className={`font-sans text-xs text-ink-muted leading-relaxed ${
          compact ? 'line-clamp-2 sm:line-clamp-none' : ''
        }`}
      >
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
