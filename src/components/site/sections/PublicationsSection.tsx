'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getV2Messages } from '@/lib/v2-i18n'
import publicationsData from '@/data/publications.json'

interface Publication {
  id: string
  year: string
  journal: string
  title: string
  authors: string
  tags: string[]
  status: string
}

export function PublicationsSection() {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)
  const pubs = publicationsData as Publication[]
  const allTags = useMemo(() => {
    const set = new Set<string>()
    pubs.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return [v2.pubsFilterAll, ...Array.from(set)]
  }, [pubs, v2.pubsFilterAll])

  const [filter, setFilter] = useState<string>(v2.pubsFilterAll)
  const [expanded, setExpanded] = useState(false)

  const filtered = filter === v2.pubsFilterAll ? pubs : pubs.filter((p) => p.tags.includes(filter))
  const visible = expanded ? filtered : filtered.slice(0, 3)

  return (
    <section id="publications" data-snap className="relative bg-v2-charcoal py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
      <div className="v2-section-inner relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">{v2.pubsLabel}</p>
          <h2 className="v2-title mt-4 text-white">{v2.pubsTitle}</h2>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                filter === tag
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {visible.map((pub, i) => (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-violet-400/40 hover:bg-white/8 hover:shadow-lg hover:shadow-violet-900/20"
            >
              <motion.div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                {pub.year && <span>{pub.year}</span>}
                <span>{pub.journal}</span>
                {pub.status === 'review' && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300">{v2.pubsStatusReview}</span>
                )}
              </motion.div>
              <h3 className="mt-3 font-serif text-base font-semibold leading-snug sm:text-lg">{pub.title}</h3>
              <p className="mt-2 text-sm text-white/60">{pub.authors}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {pub.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-violet-500/20 px-2 py-1 text-[10px] uppercase tracking-wide text-violet-200">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-8 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/80 transition hover:border-violet-400 hover:text-white"
          >
            {v2.pubsViewAll} {expanded ? '↑' : '↓'}
          </button>
        )}
      </div>
    </section>
  )
}
