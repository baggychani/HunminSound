'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { vowelsData } from '@/data/vowels'
import { TranslationDrawer } from '@/components/admin/TranslationDrawer'
import { useOverridesStore, patchOverride, makeKoreanKey, getCurrentKorean } from '@/lib/overrides-store'
import type { Vowel } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

const CATEGORY_ORDER = ['단모음', '이중모음']

function KoreanEditor({
  type, id, displayName, baseText, currentText,
}: {
  type: 'consonant' | 'vowel'
  id: string
  displayName: string
  baseText: string
  currentText: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentText)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasOverride = currentText !== baseText

  const save = async () => {
    if (draft === baseText) {
      await patchOverride({ key: makeKoreanKey(type, id), remove: true, displayName, lang: 'ko', type })
    } else {
      await patchOverride({ key: makeKoreanKey(type, id), value: draft, sourceSnapshot: '', displayName, lang: 'ko', type })
    }
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="sm:col-start-2 sm:col-span-2">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full rounded-sm border border-gold/40 bg-hanji px-3 py-2 font-sans text-xs text-ink outline-none resize-none focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.25)] leading-relaxed"
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={async () => { setSaving(true); await save() }}
              disabled={saving}
              className="rounded-sm bg-gold/90 px-3 py-1 font-sans text-[10px] text-hanji disabled:opacity-50 hover:bg-gold"
            >
              {saving ? '저장 중…' : '저장'}
            </button>
            <button onClick={() => setEditing(false)}
              className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-soft transition-colors">
              취소
            </button>
          </div>
        </div>
      ) : (
        <p
          onClick={() => { setDraft(currentText); setEditing(true); setTimeout(() => textareaRef.current?.focus(), 50) }}
          title="클릭하여 한국어 설명 편집"
          className={`cursor-pointer rounded-sm px-2 py-1 -ml-2 font-sans text-xs leading-relaxed transition-colors hover:bg-hanji-border/20 ${hasOverride ? 'text-ink border-l-2 border-gold/40 pl-3' : 'text-ink-muted/70'}`}
        >
          {currentText}
        </p>
      )}
    </div>
  )
}

function VowelRow({ vowel, index }: { vowel: Vowel; index: number }) {
  const store = useOverridesStore()
  const koreanSource = getCurrentKorean(store, 'vowel', vowel._id, vowel.description)

  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="show">
      <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[3rem_12rem_1fr] gap-x-4 gap-y-2 px-5 py-4">
        <span className="font-serif text-2xl text-ink leading-none self-start pt-1" lang="ko">
          {vowel.symbol}
        </span>
        <div>
          <p className="font-sans text-sm text-ink">{vowel.name}</p>
          <p className="font-sans text-[10.5px] text-ink-muted/60 mt-0.5 space-x-2">
            <span>ani: <span className="text-gold/70">{vowel.animationFileName ?? '—'}</span></span>
            <span>mri: <span className="text-gold/70">{vowel.mriFileName ?? '—'}</span></span>
          </p>
        </div>
        <KoreanEditor
          type="vowel" id={vowel._id} displayName={vowel.name}
          baseText={vowel.description} currentText={koreanSource}
        />
      </div>
      <TranslationDrawer
        type="vowel" id={vowel._id} displayName={vowel.name}
        koreanSource={koreanSource}
        baseValues={{
          en: vowel.description_en, zh: vowel.description_zh,
          ja: vowel.description_ja, fr: vowel.description_fr,
          hi: vowel.description_hi, vi: vowel.description_vi,
          ru: vowel.description_ru, ar: vowel.description_ar,
        }}
      />
    </motion.div>
  )
}

export default function AdminVowelsPage() {
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof vowelsData>>((acc, cat) => {
    acc[cat] = vowelsData.filter((v) => v.category === cat)
    return acc
  }, {})

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-10 sm:py-16">
      <div className="mb-10 flex items-center gap-3 border-b border-hanji-border pb-6">
        <Link href="/admin" className="font-sans text-xs text-ink-muted/60 hover:text-ink-accent transition-colors">
          ← 대시보드
        </Link>
        <span className="text-hanji-border">/</span>
        <p className="font-sans text-xs text-ink-muted">모음</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted mb-2">콘텐츠 편집</p>
        <h1 className="font-serif text-2xl text-ink mb-10">모음</h1>
      </motion.div>
      {CATEGORY_ORDER.map((category) => {
        const items = grouped[category] ?? []
        return (
          <div key={category} className="mb-12">
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="font-serif text-base text-ink">{category}</h2>
              <span className="font-sans text-[10.5px] text-ink-muted/60">{items.length}개</span>
            </div>
            <div className="divide-y divide-hanji-border border border-hanji-border rounded-sm">
              {items.map((v, i) => <VowelRow key={v._id} vowel={v} index={i} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
