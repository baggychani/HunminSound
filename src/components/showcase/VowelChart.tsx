'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollToSymbolDetail } from '@/hooks/useScrollToSymbolDetail'
import { ScrollSection } from '@/components/ui/ScrollSection'
import { DualVideoPlayer } from '@/components/ui/DualVideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TranslatedDescription } from '@/components/showcase/TranslatedDescription'
import { TranslatedVowelArticulation } from '@/components/showcase/TranslatedVowelArticulation'
import { VOWEL_ARTICULATION_KO } from '@/lib/vowelArticulation'
import type { Vowel } from '@/types'

const CATEGORY_ORDER = ['단모음', '이중모음']

interface VowelChartProps {
  vowels: Vowel[]
}

export function VowelChart({ vowels }: VowelChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const detailScrollRef = useScrollToSymbolDetail(activeId)
  const { lang } = useLang()
  const m = getMessages(lang)

  const grouped = CATEGORY_ORDER.reduce<Record<string, Vowel[]>>((acc, cat) => {
    acc[cat] = vowels.filter((v) => v.category === cat)
    return acc
  }, {})

  const activeItem = vowels.find((v) => v._id === activeId) ?? null

  function toggle(id: string) {
    setActiveId((prev) => (prev === id ? null : id))
  }

  const CATEGORY_DESC: Record<string, string> = {
    단모음: m.monophthongDesc,
    이중모음: m.diphthongDesc,
  }

  return (
    <div className="space-y-16">
      {CATEGORY_ORDER.map((category) => {
        const items = grouped[category]
        if (!items || items.length === 0) return null

        const hasActiveInGroup = items.some((v) => v._id === activeId)
        const categoryLabel = m.categories[category] ?? category
        const categoryEnLabel = m.categoriesEn[category] ?? ''

        return (
          <section key={category}>
            {/* 카테고리 헤더 */}
            <div className="mb-8 pb-3 border-b border-hanji-border">
              <div className="flex items-baseline gap-4">
                <h3 className="font-serif text-lg text-ink tracking-wide">
                  {categoryLabel}
                </h3>
                {categoryEnLabel ? (
                  <span className="font-sans text-xs text-ink-muted tracking-widest uppercase">
                    {categoryEnLabel}
                  </span>
                ) : null}
              </div>
              <p className="font-sans text-xs text-ink-muted mt-2.5">
                {CATEGORY_DESC[category]}
              </p>
            </div>

            {/* 기호 그리드 (아랍어 UI에서도 자모 순서는 LTR 유지) */}
            <div
              ref={hasActiveInGroup ? detailScrollRef : undefined}
              className="flex flex-wrap gap-1"
              dir={lang === 'ar' ? 'ltr' : undefined}
              lang={lang === 'ar' ? 'ko' : undefined}
            >
              {items.map((vowel) => {
                const isActive = activeId === vowel._id
                return (
                  <motion.button
                    key={vowel._id}
                    onClick={() => toggle(vowel._id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`symbol-btn ${isActive ? 'active bg-hanji-hover' : 'hover:bg-hanji-hover'}`}
                    aria-expanded={isActive}
                    aria-label={`${vowel.name} 상세 보기`}
                  >
                    <span
                      className={`symbol-char font-serif text-4xl leading-none transition-colors ${
                        isActive ? 'text-ink-accent' : 'text-ink'
                      }`}
                    >
                      {vowel.symbol}
                    </span>
                    <span className="symbol-sub">
                      {vowel.name.split(' ')[1]?.replace(/[()]/g, '') ?? ''}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* 두루마리 펼침 영역 */}
            <ScrollSection isOpen={hasActiveInGroup}>
              {activeItem && hasActiveInGroup && (
                <div className="mt-8 pt-8 border-t border-hanji-border">
                  <VowelDetailPanel
                    item={activeItem}
                    lang={lang}
                    animationLabel={m.animationVideo}
                    mriLabel={m.mriVideo}
                    categoryLabel={categoryLabel}
                    vowelArticulationSymbol={
                      category === '단모음' &&
                      activeItem.symbol in VOWEL_ARTICULATION_KO
                        ? activeItem.symbol
                        : undefined
                    }
                  />
                </div>
              )}
            </ScrollSection>
          </section>
        )
      })}
    </div>
  )
}

interface VowelDetailPanelProps {
  item: Vowel
  lang: ReturnType<typeof useLang>['lang']
  animationLabel: string
  mriLabel: string
  categoryLabel: string
  /** 단모음: 음성학 한 줄(KO/EN 고정, 그 외 MT) */
  vowelArticulationSymbol?: string
}

function VowelDetailPanel({
  item,
  lang,
  animationLabel,
  mriLabel,
  categoryLabel,
  vowelArticulationSymbol,
}: VowelDetailPanelProps) {
  return (
    <>
      <div className="flex items-baseline gap-4 mb-5">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="font-serif text-6xl text-ink leading-none">
            {item.symbol}
          </span>
          <div className="h-px w-full bg-hanji-border" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-xl text-ink leading-snug">{item.name}</p>
          {vowelArticulationSymbol ? (
            <TranslatedVowelArticulation symbol={vowelArticulationSymbol} lang={lang} />
          ) : (
            <p className="font-sans text-xs text-gold mt-3 uppercase tracking-widest">
              {categoryLabel}
            </p>
          )}
        </div>
      </div>

      <TranslatedDescription
        item={item as unknown as { description: string; [key: string]: unknown }}
        lang={lang}
      />

      <div className="mt-6">
        <DualVideoPlayer
          animationFileName={item.animationFileName}
          mriFileName={item.mriFileName}
          type="vowels"
          animationLabel={animationLabel}
          mriLabel={mriLabel}
        />
      </div>
    </>
  )
}
