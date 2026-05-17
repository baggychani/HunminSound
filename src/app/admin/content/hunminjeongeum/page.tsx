'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  HUNMIN_PASSAGE_SECTIONS,
  type HunminPassage,
  type HunminPassageSection,
} from '@/data/hunminjeongeumPassages'
import { TranslationDrawer } from '@/components/admin/TranslationDrawer'
import { useOverridesStore, patchOverride } from '@/lib/overrides-store'
import { makeOverrideKey } from '@/lib/i18n-overrides'

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.025, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

const SECTION_LABEL: Record<HunminPassageSection['id'], string> = {
  initial: '초성자(자음자)',
  medial: '중성자(모음자)',
  appraisal: '해례본의 평가',
}

/* ── 영어 풀이 인라인 편집기 ───────────────────────────────────────────────
 * 훈민정음 단락의 다국어 번역은 영어 풀이를 출처(source)로 삼는다.
 * (옛 한국어 표현이 많은 한국어 풀이는 자동 번역 품질이 낮으므로 한 번 정리된
 *  영어 텍스트를 기준으로 한다.)
 *
 * 이 컴포넌트는 영어 텍스트 자체를 편집한다. 영어가 다른 언어의 출처이므로
 *  - sourceSnapshot 은 별도 추적하지 않는다(자기 자신 = 출처).
 *  - 영어 텍스트가 변경되면 다른 언어 행이 stale 로 감지되도록,
 *    다른 언어의 sourceSnapshot 비교 대상이 "현재 영어"가 된다. */
function EnglishEditor({
  passage,
  baseText,
  currentText,
}: {
  passage: HunminPassage
  baseText: string
  currentText: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentText)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasOverride = currentText !== baseText

  const displayName = `[${passage.number}] ${passage.originalText.slice(0, 18)}…`
  const key = makeOverrideKey('hunminPassage', passage.number, 'en')

  const startEdit = () => {
    setDraft(currentText)
    setEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const save = async () => {
    setSaving(true)
    try {
      const trimmed = draft.trim()
      if (!trimmed || trimmed === baseText) {
        await patchOverride({
          key,
          remove: true,
          displayName,
          lang: 'en',
          type: 'hunminPassage',
        })
      } else {
        await patchOverride({
          key,
          value: trimmed,
          /* 영어가 출처이므로 자체 텍스트를 snapshot 으로 둔다(부수 검사용). */
          sourceSnapshot: trimmed,
          displayName,
          lang: 'en',
          type: 'hunminPassage',
        })
      }
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-ink-muted/60">
          English <span className="ml-1 text-ink-muted/40 normal-case tracking-normal">· 출처 텍스트</span>
        </span>
        {hasOverride && (
          <span className="font-sans text-[10px] text-gold/70 dark:text-gold-light/70">
            · 편집됨
          </span>
        )}
      </div>
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full rounded-sm border border-gold/40 bg-hanji px-3 py-2 font-sans text-sm text-ink outline-none resize-none focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.25)] leading-relaxed"
          />
          <div className="flex items-center gap-2 justify-end">
            {draft !== baseText && draft !== currentText && (
              <span className="font-sans text-[10px] text-ink-muted/40">원본과 다름</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="rounded-sm bg-gold/90 px-3 py-1 font-sans text-[10px] text-hanji disabled:opacity-50 hover:bg-gold"
            >
              {saving ? '저장 중…' : '저장'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-soft transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p
          onClick={startEdit}
          title="클릭하여 영어 풀이 편집 — 이 텍스트가 다른 언어 번역의 출처입니다"
          className={`cursor-pointer rounded-sm px-2 py-1.5 -mx-2 font-sans text-sm leading-relaxed transition-colors hover:bg-hanji-border/20 ${
            hasOverride
              ? 'text-ink border-l-2 border-gold/40 pl-3'
              : 'text-ink-soft'
          }`}
        >
          {currentText}
        </p>
      )}
    </div>
  )
}

/* ── 단일 행 ──────────────────────────────────────────────────────── */
function PassageRow({ passage, index }: { passage: HunminPassage; index: number }) {
  const store = useOverridesStore()
  const enKey = makeOverrideKey('hunminPassage', passage.number, 'en')
  const enOverride = store[enKey]?.value
  const currentEnglish = enOverride ?? passage.translations.en

  /* 한국어 풀이는 데이터 박혀있음 — read-only.
   * 다른 언어 번역의 자동 번역 source / stale 비교 기준은 "현재 영어 풀이". */
  const englishSource = currentEnglish
  const displayName = `[${passage.number}] ${passage.originalText.slice(0, 18)}…`

  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="show">
      <div className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-3 px-5 py-5">
        {/* 일련번호 + 출처 */}
        <div className="flex flex-col gap-1 self-start pt-0.5">
          <span className="font-serif text-base leading-none text-ink-muted/80">
            [{passage.number}]
          </span>
        </div>

        {/* 본문 */}
        <div className="space-y-4">
          {/* 한문 원문 */}
          <p
            className="font-serif text-lg leading-relaxed tracking-[0.03em] text-ink"
            lang="ko"
          >
            {passage.originalText}
          </p>

          {/* 출처 */}
          <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-ink-muted/55">
            {passage.reference}
          </p>

          {/* 한국어 풀이 (read-only — 옛한국어 표현 포함, 번역 출처로 쓰이지 않음) */}
          <div>
            <p className="mb-1.5 font-sans text-[10px] uppercase tracking-[0.1em] text-ink-muted/60">
              한국어 <span className="ml-1 text-ink-muted/40 normal-case tracking-normal">· 표시 전용</span>
            </p>
            <p className="font-sans text-xs leading-relaxed text-ink-soft" lang="ko">
              {passage.korean}
            </p>
          </div>

          {/* 영어 풀이 (편집 가능 · 다른 언어 번역의 출처) */}
          <EnglishEditor
            passage={passage}
            baseText={passage.translations.en}
            currentText={currentEnglish}
          />
        </div>
      </div>

      {/* 다국어 번역 드로어 (영어 제외 — 영어가 출처이기 때문) */}
      <TranslationDrawer
        type="hunminPassage"
        id={passage.number}
        displayName={displayName}
        koreanSource={englishSource}
        sourceLabel="영어"
        excludeLangs={['en']}
        baseValues={{
          zh: passage.translations.zh,
          ja: passage.translations.ja,
          fr: passage.translations.fr,
          hi: passage.translations.hi,
          ar: passage.translations.ar,
        }}
      />
    </motion.div>
  )
}

export default function AdminHunminjeongeumPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-10 sm:py-16">
      <div className="mb-10 flex items-center gap-3 border-b border-hanji-border pb-6">
        <Link
          href="/admin"
          className="font-sans text-xs text-ink-muted/60 hover:text-ink-accent transition-colors"
        >
          ← 대시보드
        </Link>
        <span className="text-hanji-border">/</span>
        <p className="font-sans text-xs text-ink-muted">훈민정음</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          콘텐츠 편집
        </p>
        <h1 className="mb-3 font-serif text-2xl text-ink">훈민정음</h1>
        <p className="mb-10 max-w-2xl font-sans text-xs leading-relaxed text-ink-muted/80">
          ≪훈민정음≫ 해례본 단락별 다국어 번역을 관리합니다. 한문 원문과 한국어
          풀이는 코드에 정의되어 변경되지 않으며 표시 전용입니다. 옛한국어 표현이
          많아 자동 번역 품질이 낮은 점을 감안해, <strong className="font-semibold text-ink-soft">영어 풀이가 다른 언어 번역의
          출처</strong>로 사용됩니다. 영어는 인라인으로 직접 편집하고, 그 외 언어는
          우측 「번역」 드로어에서 편집·수정 불필요 처리·자동 번역 복귀가 가능합니다.
        </p>
      </motion.div>

      {HUNMIN_PASSAGE_SECTIONS.map((section) => (
        <div key={section.id} className="mb-12">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="font-serif text-base text-ink">
              {SECTION_LABEL[section.id]}
            </h2>
            <span className="font-sans text-[10.5px] text-ink-muted/60">
              {section.passages.length}개 단락
            </span>
            <span className="font-serif text-[11px] text-ink-muted/40" lang="zh-Hant">
              {section.classicLabel}
            </span>
          </div>
          <div className="divide-y divide-hanji-border border border-hanji-border rounded-sm">
            {section.passages.map((p, i) => (
              <PassageRow key={p.number} passage={p} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
