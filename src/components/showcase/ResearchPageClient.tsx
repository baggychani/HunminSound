'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function ResearchPageClient() {
  const { lang } = useLang()
  const m = getMessages(lang)

  const sections = [
    { id: 'team',       title: m.researchSec1, isNrf: false },
    { id: 'objectives', title: m.researchSec2, isNrf: false },
    { id: 'nrf',        title: m.researchSec3, isNrf: true  },
  ]

  return (
    <>
      <div className="pt-16 pb-12 mb-14 sm:mb-16">
        <h1 className="font-serif text-[2.1rem] leading-tight tracking-tight text-ink sm:text-4xl mb-3">
          {m.research}
        </h1>
        <p className="font-sans text-sm leading-relaxed text-ink-muted max-w-2xl">
          {m.researchPageDesc}
        </p>
      </div>

      <div className="space-y-16 pb-28 sm:space-y-20 sm:pb-32">
        {sections.map((section, idx) => (
          <motion.section
            key={section.id}
            custom={idx}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            aria-labelledby={`section-${section.id}`}
          >
            <div className="mb-8 pb-4 sm:mb-10">
              <h2
                id={`section-${section.id}`}
                className={`font-serif tracking-tight leading-snug ${
                  section.isNrf
                    ? 'text-lg text-ink-muted sm:text-xl'
                    : 'text-xl text-ink sm:text-2xl'
                }`}
              >
                {section.title}
              </h2>
            </div>
            <div className="flex min-h-[140px] items-center justify-center rounded-sm border border-dashed border-hanji-border bg-hanji-warm/25 sm:min-h-[160px]">
              <p className="font-sans text-sm text-ink-muted/55">{m.comingSoon}</p>
            </div>
          </motion.section>
        ))}
      </div>
    </>
  )
}
