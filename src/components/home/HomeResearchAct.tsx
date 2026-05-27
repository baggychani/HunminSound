'use client'

import Link from 'next/link'
import Image from 'next/image'
import { forwardRef, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useSiteMessages } from '@/hooks/useSiteMessages'

const MRI_HERO = '/images/research/mri-hero-v2.webp'
const MRI_W = 1536
const MRI_H = 1024
const ACT_H = 'h-[calc(100dvh-var(--site-header-h,4rem))]'

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
      className={`home-scroll-margin relative z-10 ${ACT_H} min-h-0 max-h-[calc(100dvh-var(--site-header-h,4rem))] overflow-hidden bg-[#070e1a] text-white`}
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

      <div className="site-container relative h-full min-h-0 px-6 sm:px-10 lg:px-14">
        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-5 py-[clamp(0.75rem,2dvh,1.25rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-1 lg:items-stretch lg:gap-12 xl:gap-14">
          {/* 좌 — 텍스트·카드 한 덩어리로 세로 중앙 */}
          <div className="flex min-h-0 items-center justify-center lg:h-full">
            <div className="flex w-full min-w-0 max-w-xl flex-col gap-7 sm:gap-8 lg:gap-9">
              <div>
                <motion.div
                  custom={0}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-20px' }}
                  className="flex items-center gap-3"
                >
                  <span className="h-px w-9 bg-sky-400/50" aria-hidden />
                  <p className="font-sans text-[11px] font-medium tracking-[0.32em] text-sky-300/80 sm:text-xs">
                    {m.homeResearchLabel}
                  </p>
                </motion.div>

                <motion.h2
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-20px' }}
                  className="mt-5 font-serif text-[clamp(1.65rem,4.5vw,2.5rem)] leading-[1.24] tracking-tight text-white sm:mt-6"
                >
                  {m.homeResearchTitle}
                </motion.h2>

                <motion.div
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-20px' }}
                  className={`mt-5 font-sans text-[clamp(13px,1.75vw,15px)] leading-[1.78] text-slate-300/90 sm:mt-6 whitespace-pre-line ${
                    lang === 'hi' ? 'font-devanagari' : ''
                  }`}
                  lang={lang === 'hi' ? 'hi' : undefined}
                >
                  {m.homeResearchDesc}
                </motion.div>
              </div>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-20px' }}
                className="grid grid-cols-2 gap-3 sm:gap-3.5"
              >
                {FEATURE_KEYS.map(([titleKey, subKey]) => (
                  <div
                    key={titleKey}
                    className="rounded-md border border-white/[0.11] bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-sm sm:px-5 sm:py-[1.125rem]"
                  >
                    <p className="font-sans text-sm font-semibold text-white sm:text-[15px]">
                      {m[titleKey]}
                    </p>
                    <p className="mt-1.5 font-sans text-xs leading-snug text-slate-400 sm:text-[13px]">
                      {m[subKey]}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-20px' }}
              >
                <Link
                  href="/research"
                  className="group inline-flex items-center gap-2.5 rounded-md border border-sky-200/25 bg-sky-400/[0.08] px-6 py-3 font-sans text-sm tracking-wide text-sky-50 shadow-[0_0_24px_rgba(56,120,180,0.12)] transition-all hover:border-sky-200/45 hover:bg-sky-400/[0.14] hover:shadow-[0_0_32px_rgba(56,120,180,0.2)]"
                >
                  {m.homeResearchCta}
                  <span
                    aria-hidden
                    className="text-base leading-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* 우 — MRI (원본 3:2 비율) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-0 items-center justify-center lg:h-full"
          >
            <div className="relative w-full max-w-[min(100%,540px)] lg:max-w-none">
              <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.1] bg-[#050a12] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(120,170,220,0.08)_inset] ring-1 ring-sky-200/[0.06]">
                <Image
                  src={MRI_HERO}
                  alt=""
                  width={MRI_W}
                  height={MRI_H}
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="h-auto w-full object-contain"
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

                <div className="absolute left-4 top-[58%] z-10 rounded-md border border-sky-200/15 bg-[#0c1828]/88 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:left-5 sm:px-4 sm:py-3.5">
                  <p className="font-sans text-[10px] tracking-[0.14em] text-sky-300/75 sm:text-[11px]">
                    {m.homeResearchStatLabel}
                  </p>
                  <p className="mt-1 font-serif text-[1.35rem] leading-none text-white sm:text-2xl">
                    {m.homeResearchStatValue}
                  </p>
                  <p className="mt-1.5 font-sans text-[10px] leading-snug text-slate-400 sm:text-[11px]">
                    {m.homeResearchStatSub}
                  </p>
                </div>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-2xl bg-sky-500/[0.1] blur-3xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})
