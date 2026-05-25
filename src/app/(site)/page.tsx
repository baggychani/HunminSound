'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { ScrollColorWash } from '@/components/ui/ScrollColorWash'
import { HeroActBackdrop } from '@/components/ui/HeroActBackdrop'
import { HaeryebonCardWatermark } from '@/components/showcase/HaeryebonCardWatermark'

/* 3D 모델은 클라이언트 전용 — SSR 시 three.js 가 window 를 참조하면 깨지므로
 * dynamic + ssr:false 로 분리 로드. 첫 렌더 시 자리만 잡아 두고 비동기로 들어옴. */
const HunminBookViewer = dynamic(
  () =>
    import('@/components/showcase/HunminBookViewer').then((m) => m.HunminBookViewer),
  { ssr: false, loading: () => <div className="h-full w-full" aria-hidden /> },
)

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
  const heroRef = useRef<HTMLElement>(null)

  return (
    <div className="relative w-full">
      <ScrollColorWash />

      {/* 1막 — 좌: 본문(한지) / 우: 동상. 2열 그리드. */}
      <section
        ref={heroRef}
        className={
          lang === 'ko'
            ? 'relative z-10 h-[100dvh] overflow-hidden isolation-isolate'
            : 'relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-24 pt-24 text-center sm:px-8 sm:pt-28 lg:px-12'
        }
      >
        {lang === 'ko' ? <HeroActBackdrop heroRef={heroRef} /> : null}

        {lang === 'ko' ? (
          <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center px-6 pb-[5.5rem] pt-[5rem] sm:px-8 sm:pb-[6rem] sm:pt-[5.25rem] sm:ps-[4vw] lg:grid-cols-[0.42fr_1.18fr_0.88fr] lg:px-10 lg:pb-[6.5rem] lg:pt-[5.5rem] lg:ps-[5vw]">
            <div className="hidden lg:block" aria-hidden />

            <div className="flex flex-col items-center text-center translate-x-[clamp(0.25rem,2vw,0.75rem)] sm:translate-x-[clamp(0.5rem,2.5vw,1rem)] lg:translate-x-0">
              <p className="font-serif text-[15px] text-ink-muted tracking-wide sm:text-[17px]">
                {m.homeSubtitle}
              </p>

              <h1 className="mt-4 font-jamo text-[4rem] leading-none tracking-wide text-ink sm:mt-5 sm:text-[4.75rem] md:text-[6.35rem] lg:text-[5.85rem]">
                {m.siteTitle}
              </h1>

              <p className="mt-4 font-sans text-sm tracking-[0.2em] text-ink-muted sm:mt-5">
                Sejong Speech Sounds
              </p>

              <div className="mx-auto mt-3 w-full max-w-lg shrink-0 sm:mt-4 lg:max-w-xl">
                <div
                  className="relative h-[min(clamp(12rem,24vw,19.5rem),max(8rem,calc(100dvh-24rem)))] w-full"
                  aria-hidden
                >
                  <HunminBookViewer className="absolute inset-0" />
                </div>
              </div>

              <p className="relative mt-3 w-full max-w-[min(100%,42rem)] shrink-0 break-keep px-1 font-serif text-base leading-loose text-ink-soft [overflow-wrap:break-word] sm:mt-4 sm:px-0 sm:text-[17px]">
                <span className="sm:hidden whitespace-normal">
                  {m.homeIntroPart1} {m.homeIntroPart2}
                </span>
                <span className="hidden sm:block sm:whitespace-nowrap">{m.homeIntroPart1}</span>
                <span className="hidden sm:block sm:whitespace-nowrap">{m.homeIntroPart2}</span>
              </p>
            </div>

            {/* 우측 열 — 동상이 그radient 뒤로 보이는 여백 */}
            <div className="hidden min-h-[12rem] lg:block" aria-hidden />
          </div>
        ) : (
          <>
            <p
              className={`font-sans text-xs text-ink-muted tracking-[0.3em] uppercase ${
                lang === 'hi'
                  ? 'font-devanagari normal-case tracking-normal text-[13px] leading-relaxed'
                  : ''
              }`}
              lang={lang === 'hi' ? 'hi' : undefined}
            >
              {m.homeSubtitle}
            </p>

            <h1 className="mt-5 font-jamo text-6xl leading-none tracking-wide text-ink sm:mt-6 sm:text-7xl md:text-8xl lg:text-[5.5rem]">
              {m.siteTitle}
            </h1>

            <p className="mt-4 font-sans text-sm tracking-[0.2em] text-ink-muted sm:mt-5">
              Sejong Speech Sounds
            </p>
          </>
        )}

        {lang !== 'ko' ? <div className="section-divider mt-8" /> : null}

        {lang !== 'ko' && m.homeDescription.trim() ? (
          <p className="mx-auto mt-8 max-w-3xl font-sans text-base leading-relaxed text-ink-soft">
            <span className="sm:hidden whitespace-normal">
              {m.homeDescription.replace(/\n/g, ' ')}
            </span>
            <span className="hidden sm:inline whitespace-pre-line">{m.homeDescription}</span>
          </p>
        ) : null}
      </section>

      <div className="site-container relative z-10 pb-24">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
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

      {/* 훈민정음과 연구 소개 사이 */}
      <div className="pt-10 sm:pt-14" aria-hidden />

      <ResearchCard
        href="/research"
        label={m.research}
        description={m.researchCardDesc}
        cta={m.researchCta}
      />
      </div>

      {/* 소개 섹션 — 한국어는 히어로에 통합. 타 언어는 하단 유지 */}
      {lang !== 'ko' ? (
        <div className="site-container pb-24">
          <section className="mx-auto max-w-3xl text-center">
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
        </div>
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
      className="group block w-full rounded-sm border border-hanji-border/60 bg-hanji/75 px-8 py-8 text-left shadow-[0_1px_0_rgb(var(--ink-rgb)/0.02)] backdrop-blur-md transition-colors hover:border-hanji-border hover:bg-hanji/90 sm:px-10 sm:py-9 dark:bg-hanji/65 dark:hover:bg-hanji/80"
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
      className="group col-span-1 sm:col-span-2 relative overflow-hidden rounded-sm border border-hanji-border/60 bg-hanji/75 backdrop-blur-md transition-colors hover:bg-hanji/90 hover:border-hanji-border p-10 sm:p-12 flex flex-col gap-6 dark:bg-hanji/65 dark:hover:bg-hanji/80"
    >
      <HaeryebonCardWatermark />

      <div className="relative z-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-jamo text-4xl text-ink group-hover:text-ink-accent transition-colors">
            {label}
          </span>
        </div>
        <span className="font-sans text-xs text-ink-muted tracking-[0.06em]">{caption}</span>
      </div>

      <div className="relative z-10 flex gap-3 flex-wrap" dir="ltr" lang="ko">
        {baseShapes.map((s) => (
          <span key={s} className="font-jamo text-2xl text-ink-muted group-hover:text-ink transition-colors">
            {s}
          </span>
        ))}
        <span className="font-sans text-xl text-ink-muted self-end pb-1">…</span>
      </div>

      <p className="relative z-10 break-keep font-sans text-xs text-ink-muted leading-relaxed max-w-xl [overflow-wrap:break-word]">
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
      className="group flex flex-col gap-6 rounded-sm border border-hanji-border/60 bg-hanji/75 backdrop-blur-md transition-colors hover:bg-hanji/90 hover:border-hanji-border p-10 sm:p-12 dark:bg-hanji/65 dark:hover:bg-hanji/80"
    >
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-jamo text-4xl text-ink group-hover:text-ink-accent transition-colors">
            {label}
          </span>
        </div>
        <span className="font-sans text-xs text-ink-muted">{count}</span>
      </div>

      <div className="flex gap-3 flex-wrap" dir="ltr" lang="ko">
        {preview.map((symbol) => (
          <MagneticGlyph
            key={symbol}
            className="font-jamo text-2xl text-ink-muted group-hover:text-ink transition-colors inline-block"
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
