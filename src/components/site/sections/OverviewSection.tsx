'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getV2Messages } from '@/lib/v2-i18n'
import type { ResearchContent } from '@/lib/research-content'
import { tr } from '@/lib/research-content'
import { CountUpStat } from '@/components/site/effects/CountUpStat'
import { fadeUp, staggerContainer } from '@/components/site/effects/v2Motion'

interface OverviewSectionProps {
  content: ResearchContent
}

const METHOD_KEYS = [
  { titleKey: 'methodMri' as const, descKey: 'methodMriDesc' as const, icon: '🧲', accent: 'from-sky-500/10 to-blue-600/5' },
  { titleKey: 'methodAcoustic' as const, descKey: 'methodAcousticDesc' as const, icon: '〰️', accent: 'from-violet-500/10 to-purple-600/5' },
  { titleKey: 'methodNeuro' as const, descKey: 'methodNeuroDesc' as const, icon: '🧠', accent: 'from-rose-500/10 to-pink-600/5' },
  { titleKey: 'methodHeritage' as const, descKey: 'methodHeritageDesc' as const, icon: '📜', accent: 'from-amber-500/10 to-orange-600/5' },
]

export function OverviewSection({ content }: OverviewSectionProps) {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)
  const t = content.translations

  const stats = [
    { value: '120+', label: v2.statPublications, countUp: true },
    { value: String(content.team.rows.length), label: v2.statTeam, countUp: true },
    { value: '3년', label: v2.statYears, countUp: false },
    { value: '3D', label: v2.statMri, countUp: false },
  ]

  return (
    <section id="overview" data-snap className="relative overflow-hidden bg-v2-cream py-20 text-stone-900">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-amber-300/20 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />

      <div className="v2-section-inner relative">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
          className="mb-16 text-center"
        >
          <p className="v2-label">{v2.overviewLabel}</p>
          <h2 className="v2-title mt-4">{v2.overviewTitle}</h2>
          <p className="v2-body mx-auto mt-4 max-w-3xl text-stone-600">
            {v2.overviewDesc}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16 grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4 }}
              className="py-3 text-center sm:border-s sm:border-amber-200/50 sm:ps-6 first:sm:border-s-0 sm:first:ps-0"
            >
              {stat.countUp ? (
                <CountUpStat value={stat.value} className="v2-stat block text-amber-700" />
              ) : (
                <p className="v2-stat text-amber-700">{stat.value}</p>
              )}
              <p className="mt-1.5 text-xs text-stone-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {METHOD_KEYS.map((item, i) => (
            <motion.article
              key={item.titleKey}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8, rotateX: 2 }}
              className={`group p-4 sm:p-5`}
            >
              <motion.span
                className="inline-block text-xl"
                whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                {item.icon}
              </motion.span>
              <h3 className="mt-3 font-serif text-base font-semibold transition group-hover:text-amber-800">{v2[item.titleKey]}</h3>
              <p className="v2-body mt-2 text-stone-600">{v2[item.descKey]}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-3xl border-s-4 border-amber-500 ps-6 text-center sm:text-start"
        >
          <p className="font-serif text-sm italic text-stone-700 sm:text-base">
            &ldquo;{v2.heritageQuote}&rdquo;
          </p>
          <footer className="mt-3 text-sm text-stone-500">— {v2.heritageQuoteSource}</footer>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-xl bg-gradient-to-r from-stone-900/[0.04] via-amber-900/[0.06] to-stone-900/[0.04] px-6 py-4 text-center text-sm text-stone-600"
        >
          {tr(t, lang, 'goals.final', content.goals.final)}
        </motion.div>
      </div>
    </section>
  )
}
