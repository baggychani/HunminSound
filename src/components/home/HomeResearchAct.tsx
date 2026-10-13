'use client'

import Link from 'next/link'
import Image from 'next/image'
import { forwardRef, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useSiteMessages } from '@/hooks/useSiteMessages'
import { HomeJamoField } from '@/components/home/HomeJamoField'

const MRI_HERO = '/images/research/mri-hero-v2.webp'
const MRI_W = 1536
const MRI_H = 1024
const ACT_H = 'sm:h-[calc(100dvh-var(--site-header-h,4rem))]'

const FEATURE_KEYS = [
  ['homeResearchFeature1Title', 'homeResearchFeature1Sub'],
  ['homeResearchFeature2Title', 'homeResearchFeature2Sub'],
  ['homeResearchFeature3Title', 'homeResearchFeature3Sub'],
  ['homeResearchFeature4Title', 'homeResearchFeature4Sub'],
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

function MriScanOverlay() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute left-[4%] top-[6%] h-4 w-4 border-l border-t border-sky-200/40 sm:h-5 sm:w-5" />
      <span className="absolute right-[4%] top-[6%] h-4 w-4 border-r border-t border-sky-200/40 sm:h-5 sm:w-5" />
      <span className="absolute bottom-[22%] left-[6%] h-3 w-3 border border-white/20 sm:h-4 sm:w-4" />
      <span className="absolute bottom-[38%] left-[42%] h-14 w-14 rounded-full border border-dashed border-sky-200/25 sm:h-[4.5rem] sm:w-[4.5rem]" />
      {/* MRI 촬영 중인 듯한 스캔 라인 — 데스크톱 전용. 빛줄이 위에서 아래로 훑던 효과. 일단 끈다.
      <span className="mri-scan-sweep hidden lg:block" />
      */}
    </div>
  )
}

/** 소수 4자리로 고정 — Math.sin 결과가 서버/클라이언트 빌드마다 마지막 자리에서
 * 미세하게 달라져 hydration 경고가 나던 것을 방지 */
const round4 = (n: number) => Math.round(n * 10000) / 10000

/** 스펙트로그램 이퀄라이저 — 말소리 파형 장식 (데스크톱 전용) */
const EQ_BARS = Array.from({ length: 36 }, (_, i) => ({
  /* sin 조합으로 유기적인 높이·타이밍 (고정값 — hydration 안전) */
  height: round4(0.35 + Math.abs(Math.sin(i * 1.7) * 0.45) + Math.abs(Math.sin(i * 0.6) * 0.2)),
  delay: (i % 9) * 0.14,
  dur: 1.2 + (i % 5) * 0.22,
}))

function SpectrogramStrip() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-end gap-[3px] opacity-45 lg:flex"
    >
      {EQ_BARS.map((bar, i) => (
        <span
          key={i}
          className="eq-bar w-[2px] rounded-full bg-sky-300/70"
          style={{
            height: `${bar.height * 1.5}rem`,
            animationDelay: `${bar.delay}s`,
            animationDuration: `${bar.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

/** 메인 3막 — 연구 소개 히어로 (다크 · 정확히 1뷰포트) */
export const HomeResearchAct = forwardRef<HTMLElement>(function HomeResearchAct(_, ref) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { m, lang } = useSiteMessages()
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const gridY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-18, 22])

  const setRefs = (node: HTMLElement | null) => {
    sectionRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  return (
    <section
      ref={setRefs}
      id="home-act3"
      className={`home-scroll-margin relative z-10 min-h-0 max-sm:overflow-x-clip ${ACT_H} sm:max-h-[calc(100dvh-var(--site-header-h,4rem))] sm:overflow-hidden bg-[#070e1a] text-white`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_72%_38%,rgba(36,72,120,0.38),transparent_58%),radial-gradient(ellipse_55%_45%_at_12%_88%,rgba(20,48,82,0.28),transparent_52%),linear-gradient(165deg,#070e1a_0%,#0a1528_48%,#08101c_100%)]"
      />

      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="pointer-events-none absolute -inset-x-8 -inset-y-12 opacity-[0.05]"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,180,220,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(148,180,220,0.65) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-[18%] h-56 w-56 rounded-full border border-sky-200/[0.07]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] top-[14%] h-2.5 w-2.5 rotate-45 border border-sky-200/15"
      />

      {/* 1·2·4막 자모 장식의 흑백 반전판 — fixed 필드를 clip-path로 3막 영역 안에서만 보이게 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [clip-path:inset(0)]">
        <HomeJamoField tone="inverse" />
      </div>

      <div className="relative mx-auto h-full min-h-0 w-full px-6 max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:py-6 max-sm:pb-14 sm:w-[85%] sm:max-w-[85.5rem] sm:px-0">
        <div className="grid h-full min-h-0 grid-cols-1 gap-3 max-sm:h-auto max-sm:flex-none max-sm:grid-rows-none max-sm:gap-0 max-sm:py-0 py-[clamp(0.75rem,2dvh,1.25rem)] sm:grid-rows-[minmax(0,1fr)_auto] sm:gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-1 lg:items-stretch lg:gap-[min(3.5rem,4.1vw,9.44cqh)]">
          {/* 좌 — 텍스트·카드 한 덩어리로 세로 중앙. 폰에서는 칸을 풀어 제목·그림·버튼을 다시 쌓는다. */}
          <div className="flex min-h-0 items-center justify-center max-sm:contents lg:h-full">
            <div className="home-act3-fit w-full min-w-0 max-w-xl max-sm:contents">
              <div className="home-act3-scale flex w-full min-w-0 flex-col gap-3 max-sm:contents sm:gap-[2.4em]">
              <div className="max-sm:order-1">
                <motion.h2
                  custom={0}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-20px' }}
                  className={`text-[clamp(1.65rem,4.5vw,2.5rem)] font-bold leading-[1.35] text-white sm:text-[2.6667em] ${
                    lang === 'hi' ? 'font-devanagari tracking-normal' : 'font-serif tracking-tight'
                  }`}
                >
                  {m.homeResearchTitle}
                </motion.h2>

                <motion.div
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-20px' }}
                  className={`mt-8 font-sans text-[calc(0.875rem-0.5pt)] leading-relaxed text-slate-300/90 sm:mt-[1.6em] sm:text-[1em] sm:leading-[1.78] whitespace-pre-line ${
                    lang === 'hi' ? 'font-devanagari' : ''
                  }`}
                  lang={lang === 'hi' ? 'hi' : undefined}
                >
                  {m.homeResearchDesc}
                </motion.div>
              </div>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-20px' }}
                className="hidden grid-cols-2 gap-3 sm:grid sm:gap-[0.9333em]"
              >
                {FEATURE_KEYS.map(([titleKey, subKey]) => (
                  <div
                    key={titleKey}
                    className="rounded-md border border-white/[0.11] bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-sm sm:px-[1.3333em] sm:py-[1.2em]"
                  >
                    <p className="font-sans text-sm font-bold leading-5 text-white sm:text-[1em] sm:leading-[1.333]">
                      {m[titleKey]}
                    </p>
                    <p className="mt-1.5 font-sans text-xs leading-snug text-slate-400 sm:mt-[0.4615em] sm:text-[0.8667em] sm:leading-snug">
                      {m[subKey]}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-20px' }}
                className="max-sm:order-2 max-sm:mt-[14px]"
              >
                <Link
                  href="/research"
                  className="group inline-flex items-center gap-2.5 rounded-md border border-sky-200/25 bg-sky-400/[0.08] px-6 py-3 font-sans text-sm font-medium leading-5 tracking-wide text-sky-50 shadow-[0_0_24px_rgba(56,120,180,0.12)] transition-all hover:border-sky-200/45 hover:bg-sky-400/[0.14] hover:shadow-[0_0_32px_rgba(56,120,180,0.2)] sm:gap-[0.7143em] sm:px-[1.7143em] sm:py-[0.8571em] sm:text-[0.9333em] sm:leading-[1.429]"
                >
                  {m.homeResearchCta}
                  <span
                    aria-hidden
                    className="text-base leading-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:text-[1.1429em]"
                  >
                    ↗
                  </span>
                </Link>
              </motion.div>
              </div>
            </div>
          </div>

          {/* 우 — MRI (원본 3:2 비율) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-0 items-center justify-center max-sm:order-3 max-sm:mt-10 max-sm:h-auto max-sm:justify-start lg:h-full"
          >
            <div className="relative flex w-full max-w-[min(100%,540px)] justify-center max-sm:max-w-[20rem] lg:max-w-none">
              <div className="relative h-full max-h-full w-full overflow-hidden rounded-lg border border-white/[0.1] bg-[#050a12] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(120,170,220,0.08)_inset] ring-1 ring-sky-200/[0.06] max-sm:h-auto sm:h-auto sm:w-[min(100%,calc(36cqh*1.5))] lg:w-[min(100%,calc(62cqh*1.5))]">
                <Image
                  src={MRI_HERO}
                  alt="발음 중 성도의 실시간 MRI 영상"
                  width={MRI_W}
                  height={MRI_H}
                  sizes="(max-width: 639px) 256px, (max-width: 1024px) 92vw, 44vw"
                  className="h-full w-full object-contain max-sm:h-auto sm:h-auto"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070e1a]/25 via-transparent to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070e1a]/40 via-transparent to-[#070e1a]/10"
                />
                <MriScanOverlay />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-2xl bg-sky-500/[0.1] blur-3xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <SpectrogramStrip />
    </section>
  )
})
