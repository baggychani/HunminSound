'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

interface PageHeaderProps {
  type: 'consonants' | 'vowels'
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export function PageHeader({ type }: PageHeaderProps) {
  const { lang } = useLang()
  const m = getMessages(lang)

  const isConsonants = type === 'consonants'

  const label = isConsonants ? 'Korean Consonants' : 'Korean Vowels'
  const title = isConsonants ? m.consonants : m.vowels
  const desc  = isConsonants ? m.consonantsPageDesc : m.vowelsPageDesc

  return (
    <div className="pt-16 pb-16 border-b border-hanji-border mb-16">
      <AnimatePresence mode="wait">
        <motion.div key={type} className="contents">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="font-sans text-xs text-ink-muted tracking-[0.3em] uppercase mb-4"
          >
            {label}
          </motion.p>
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="font-jamo text-5xl sm:text-6xl text-ink leading-none mb-6"
          >
            {title}
          </motion.h1>
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="max-w-4xl break-keep font-sans text-sm leading-relaxed text-ink-muted [overflow-wrap:break-word]"
          >
            {desc}
            <br />
            <span className="text-ink-muted/70">{m.clickToExplore}</span>
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
