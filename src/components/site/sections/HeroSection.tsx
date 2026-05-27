'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { getV2Messages } from '@/lib/v2-i18n'
import { JamoText } from '@/components/ui/JamoText'
import { useSnapScrollContext } from '@/components/site/SnapScrollLayout'
import { HeroFloatingOrbs } from '@/components/site/effects/HeroFloatingOrbs'
import { MagneticGlyph } from '@/components/site/effects/MagneticGlyph'
import { joinHomeLines } from '@/data/home-content'
import { fadeUp } from '@/components/site/effects/v2Motion'

const HunminBookViewer = dynamic(
  () => import('@/legacy/components/showcase/HunminBookViewer').then((m) => m.HunminBookViewer),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-white bg-opacity-5" aria-hidden /> },
)

const HERO_JAMO = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ']

export function HeroSection() {
  const { scrollToSection } = useSnapScrollContext()
  const { lang } = useLang()
  const m = getMessages(lang)
  const v2 = getV2Messages(lang)

  return (
    <section
      id="hero"
      data-snap
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-v2-hero text-white"
    >
      <HeroFloatingOrbs />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-600/25 via-v2-hero to-indigo-950/80" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(251,191,36,0.12),transparent_55%)]"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        className="pointer-events-none absolute -end-16 top-[18%] font-jamo text-[22vw] leading-none text-white opacity-[0.04] select-none"
      >
        <JamoText text="ᄀᄂᄃᄅ" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        className="pointer-events-none absolute -start-8 bottom-[8%] font-jamo text-[16vw] leading-none text-amber-400 opacity-[0.07] select-none"
      >
        <JamoText text="훈민정음" />
      </motion.div>

      <div className="v2-section-inner relative grid w-full items-center gap-10 py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-32">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-xs font-semibold uppercase text-amber-400/90 sm:text-sm"
          >
            {v2.heroSubtitle}
          </motion.p>

          <h1 className="font-jamo text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.95] tracking-tight">
            <span className="v2-shimmer-text inline-block">
              <JamoText text={m.siteTitle} />
            </span>
          </h1>

          <p className="v2-body mt-5 max-w-xl whitespace-pre-line text-white/75">
            {lang === 'ko'
              ? joinHomeLines(m.homeIntroPart1, m.homeIntroPart2)
              : v2.heroDesc}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1" dir="ltr" lang="ko">
            {HERO_JAMO.map((sym, i) => (
              <motion.span
                key={sym}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.03, duration: 0.35 }}
              >
                <MagneticGlyph
                  className="font-jamo text-sm text-amber-200/75 transition hover:text-amber-300 sm:text-base"
                  pull={3}
                >
                  {sym}
                </MagneticGlyph>
              </motion.span>
            ))}
          </div>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <motion.button
              type="button"
              onClick={() => scrollToSection('overview')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="v2-cta-glow rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-3.5 text-sm font-semibold text-v2-hero shadow-lg transition"
            >
              {v2.heroCtaResearch}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => scrollToSection('sound')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-amber-400/60 hover:text-amber-200"
            >
              {v2.heroCtaSound}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 레거시 page.tsx: clamp 높이 + absolute inset-0 — HunminBookViewer 자체 부양·흔들림 유지 */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-2xl lg:max-w-none"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="relative mx-auto h-[clamp(14rem,28vw,23rem)] w-full max-w-4xl"
          >
            {lang === 'ko' ? (
              <HunminBookViewer className="absolute inset-0" />
            ) : (
              <motion.div className="absolute inset-0 flex items-center justify-center">
                {['訓', '民', '正', '音'].map((char, i) => (
                  <motion.span
                    key={char}
                    className="absolute font-serif text-3xl text-amber-200/25 sm:text-4xl"
                    style={{ left: `${20 + i * 18}px`, top: `${30 + (i % 2) * 15}px` }}
                    animate={{ y: [0, -8, 0], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ repeat: Infinity, duration: 4 + i, delay: i * 0.3 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
          <p className="mt-3 text-center text-[10px] tracking-[0.18em] text-white/35 uppercase">
            Hunminjeongeum · MRI · 1443
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 start-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <span className="text-[10px] tracking-[0.45em] text-white/35 uppercase">{v2.scrollHint}</span>
        <span className="block h-8 w-5 rounded-full border border-white/25 p-1" aria-hidden>
          <motion.span
            className="mx-auto block h-1.5 w-1 rounded-full bg-amber-400/80"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
