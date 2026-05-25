'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getV2Messages } from '@/lib/v2-i18n'
import newsData from '@/data/news.json'

interface NewsItem {
  id: string
  category: string
  date: string
  title: string
  excerpt: string
  url: string
}

export function NewsSection() {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)
  const items = newsData as NewsItem[]
  const categories = useMemo(() => ['전체', ...Array.from(new Set(items.map((n) => n.category)))], [items])
  const [filter, setFilter] = useState('전체')

  const filtered = filter === '전체' ? items : items.filter((n) => n.category === filter)

  return (
    <section id="news" data-snap className="relative bg-v2-news py-20 text-stone-900">
      <div className="v2-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">{v2.newsLabel}</p>
          <h2 className="v2-title mt-4">{v2.newsTitle}</h2>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                filter === cat
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-stone-600 ring-1 ring-rose-100 hover:ring-rose-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-white p-5 transition hover:shadow-md sm:p-6"
            >
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 font-semibold text-rose-700">{item.category}</span>
                <span className="text-stone-400">{item.date}</span>
              </div>
              <h3 className="mt-3 font-serif text-base font-semibold leading-snug">{item.title}</h3>
              <p className="v2-body mt-2 text-stone-600">{item.excerpt}</p>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  {v2.newsReadMore} →
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
