'use client'

import { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import type { Consonant } from '@/types'

const CATEGORY_ORDER = ['파열음', '마찰음', '파찰음', '비음', '유음']

interface ConsonantChartProps {
  consonants: Consonant[]
}

/** articulationGroup 순서를 유지하며 그룹화 */
function groupByArticulation(
  items: Consonant[],
): { group: string; items: Consonant[] }[] {
  const result: { group: string; items: Consonant[] }[] = []
  for (const item of items) {
    const key = item.articulationGroup ?? ''
    const existing = result.find((g) => g.group === key)
    if (existing) {
      existing.items.push(item)
    } else {
      result.push({ group: key, items: [item] })
    }
  }
  return result
}

export function ConsonantChart({ consonants }: ConsonantChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { lang } = useLang()
  const m = getMessages(lang)

  const grouped = CATEGORY_ORDER.reduce<Record<string, Consonant[]>>(
    (acc, cat) => {
      acc[cat] = consonants.filter((c) => c.category === cat)
      return acc
    },
    {},
  )

  const activeItem = consonants.find((c) => c._id === activeId) ?? null

  function toggle(id: string) {
    setActiveId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-16">
      {CATEGORY_ORDER.map((category) => {
        const items = grouped[category]
        if (!items || items.length === 0) return null

        const subGroups = groupByArticulation(items)
        const hasActiveInGroup = items.some((c) => c._id === activeId)
        const categoryLabel = m.categories[category] ?? category
        const categoryEnLabel = m.categoriesEn[category] ?? ''
        const showEnSub = lang !== 'ko' && categoryLabel !== categoryEnLabel

        return (
          <section key={category}>
            {/* 카테고리 헤더 */}
            <div className="flex items-baseline gap-4 mb-8 pb-3 border-b border-hanji-border">
              <h3 className="font-serif text-lg text-ink tracking-wide">
                {categoryLabel}
              </h3>
              {showEnSub ? (
                <span className="font-sans text-xs text-ink-muted tracking-widest uppercase">
                  {categoryEnLabel}
                </span>
              ) : (
                <span className="font-sans text-xs text-ink-muted tracking-widest uppercase">
                  {categoryEnLabel}
                </span>
              )}
            </div>

            {/* 기호 그리드 — articulationGroup 간 구분선 (아랍어 UI는 전체 RTL이어도 자모 순서는 가로쓰기 유지) */}
            <div
              className="flex flex-wrap items-center gap-y-3"
              dir={lang === 'ar' ? 'ltr' : undefined}
              lang={lang === 'ar' ? 'ko' : undefined}
            >
              {subGroups.map((subGroup, idx) => (
                <Fragment key={subGroup.group || idx}>
                  {/* 그룹 사이 옅은 구분선 */}
                  {idx > 0 && subGroups.length > 1 && (
                    <span
                      className="block w-px h-20 bg-hanji-border mx-3 shrink-0"
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex gap-1">
                    {subGroup.items.map((consonant) => {
                      const isActive = activeId === consonant._id
                      return (
                        <motion.button
                          key={consonant._id}
                          onClick={() => toggle(consonant._id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className={`symbol-btn ${isActive ? 'active bg-hanji-hover' : 'hover:bg-hanji-hover'}`}
                          aria-expanded={isActive}
                          aria-label={`${consonant.name} 상세 보기`}
                        >
                          <span
                            className={`symbol-char font-serif text-4xl leading-none transition-colors ${
                              isActive ? 'text-ink-accent' : 'text-ink'
                            }`}
                          >
                            {consonant.symbol}
                          </span>
                          <span className="symbol-sub">
                            {consonant.name.split(' ')[1]?.replace(/[()]/g, '') ?? ''}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </Fragment>
              ))}
            </div>

            {/* 두루마리 펼침 영역 */}
            <ScrollSection isOpen={hasActiveInGroup}>
              {activeItem && hasActiveInGroup && (
                <DetailPanel
                  item={activeItem}
                  lang={lang}
                  animationLabel={m.animationVideo}
                  mriLabel={m.mriVideo}
                  type="consonants"
                  categoryLabel={categoryLabel}
                  categoryEnLabel={categoryEnLabel}
                />
              )}
            </ScrollSection>
          </section>
        )
      })}
    </div>
  )
}

interface DetailPanelProps {
  item: Consonant
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  type: 'consonants' | 'vowels'
  categoryLabel: string
  categoryEnLabel: string
}

function DetailPanel({
  item,
  lang,
  animationLabel,
  mriLabel,
  type,
  categoryLabel,
  categoryEnLabel,
}: DetailPanelProps) {
  return (
    <div className="mt-8 pt-8 border-t border-hanji-border">
      {/* 심볼 + 이름 + 카테고리 */}
      <div className="flex items-baseline gap-4 mb-5">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="font-serif text-6xl text-ink leading-none">
            {item.symbol}
          </span>
          <div className="h-px w-full bg-hanji-border" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-xl text-ink leading-snug">{item.name}</p>
          <p className="font-sans text-xs text-gold uppercase tracking-widest mt-3">
            {categoryLabel}
            {categoryEnLabel && categoryEnLabel !== categoryLabel
              ? ` · ${categoryEnLabel}`
              : ''}
          </p>
        </div>
      </div>

      <TranslatedDescription
        item={item as unknown as { description: string; [key: string]: unknown }}
        lang={lang}
      />

      {/* 영상 2개 병렬 */}
      <div className="mt-6">
        <DualVideoPlayer
          animationFileName={item.animationFileName}
          mriFileName={item.mriFileName}
          type={type}
          animationLabel={animationLabel}
          mriLabel={mriLabel}
        />
      </div>
    </div>
  )
}
