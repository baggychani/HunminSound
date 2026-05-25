'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getV2Messages } from '@/lib/v2-i18n'
import { ConsonantChart } from '@/legacy/components/showcase/ConsonantChart'
import { VowelChart } from '@/legacy/components/showcase/VowelChart'
import { PhoneticsViewToggle, type ChartViewMode } from '@/legacy/components/showcase/PhoneticsViewToggle'
import { MagneticGlyph } from '@/components/site/effects/MagneticGlyph'
import type { Consonant, Vowel } from '@/types'
import { fadeUp } from '@/components/site/effects/v2Motion'

interface SoundArchiveSectionProps {
  consonants: Consonant[]
  vowels: Vowel[]
}

type SoundTab = 'consonants' | 'vowels'

const PREVIEW = {
  consonants: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ'],
  vowels: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', 'ㅑ'],
} as const

export function SoundArchiveSection({ consonants, vowels }: SoundArchiveSectionProps) {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)
  const [tab, setTab] = useState<SoundTab>('consonants')
  const [viewMode, setViewMode] = useState<ChartViewMode>('modern')

  return (
    <section id="sound" data-snap className="relative overflow-hidden bg-v2-sound py-20 text-stone-900">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-sky-400/15 blur-[90px]"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
      />

      <motion.div className="v2-section-inner relative">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
          className="mb-12"
        >
          <p className="v2-label text-sky-700">{v2.soundLabel}</p>
          <h2 className="v2-title mt-4 max-w-4xl">{v2.soundTitle}</h2>
          <p className="v2-body mt-4 max-w-2xl text-stone-600">{v2.soundDesc}</p>

          <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1" dir="ltr" lang="ko">
            {PREVIEW[tab].map((sym) => (
              <MagneticGlyph
                key={`${tab}-${sym}`}
                className="font-jamo text-sm text-sky-700/80 hover:text-sky-900 sm:text-base"
              >
                {sym}
              </MagneticGlyph>
            ))}
          </div>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-3">
          {(['consonants', 'vowels'] as const).map((key) => (
            <motion.button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                tab === key
                  ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg shadow-sky-600/35'
                  : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-sky-300'
              }`}
            >
              {key === 'consonants' ? v2.soundTabConsonants : v2.soundTabVowels}
            </motion.button>
          ))}
        </div>

        <div className="mb-8 max-w-xl">
          <PhoneticsViewToggle mode={viewMode} onModeChange={setViewMode} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${tab}-${viewMode}`}
            initial={{ opacity: 0, x: tab === 'consonants' ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 'consonants' ? 24 : -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl bg-white p-5 sm:p-6"
          >
            {tab === 'consonants' ? (
              <ConsonantChart consonants={consonants} viewMode={viewMode} />
            ) : (
              <VowelChart vowels={vowels} viewMode={viewMode} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
