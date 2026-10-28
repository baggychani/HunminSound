'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import {
  HUNMIN_PASSAGE_SECTIONS,
  type HunminPassage,
  type HunminPassageSection,
} from '@/data/hunminjeongeumPassages'
import { ADMIN_LANGUAGE_NAMES } from '@/components/admin/adminLanguageNames'
import { TranslationDrawer } from '@/components/admin/TranslationDrawer'
import { patchOverride, useOverridesStore } from '@/lib/overrides-store'
import { buildHunminPassageBaseValues } from '@/lib/cms-base-values'

const SECTION_LABEL: Record<HunminPassageSection['id'], string> = {
  initial: '초성자',
  medial: '중성자',
  appraisal: '해례본의 평가',
}

function koreanKey(number: string) {
  return `hunminPassage:${number}:description:ko`
}

function KoreanEditor({
  passage,
  currentText,
}: {
  passage: HunminPassage
  currentText: string
}) {
  const baseText = passage.korean
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentText)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const displayName = `[${passage.number}] ${passage.originalText.slice(0, 18)}…`

  const startEdit = () => {
    setDraft(currentText)
    setError(null)
    setEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const trimmed = draft.trim()
      if (!trimmed || trimmed === baseText) {
        await patchOverride({
          key: koreanKey(passage.number),
          remove: true,
          displayName,
          lang: 'ko',
          type: 'hunminPassage',
        })
      } else {
        await patchOverride({
          key: koreanKey(passage.number),
          value: trimmed,
          sourceSnapshot: baseText,
          displayName,
          lang: 'ko',
          type: 'hunminPassage',
        })
      }
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full rounded-sm border border-gold/40 bg-hanji px-3 py-2 font-sans text-sm text-ink outline-none resize-none focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.25)] leading-relaxed"
          />
          {error && <p role="alert" className="font-sans text-[11px] leading-snug text-red-500">{error}</p>}
          <div className="flex items-center justify-end gap-2">
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
          onDoubleClick={startEdit}
          title="더블클릭하여 한국어 편집"
          className="cursor-pointer rounded-sm px-2 py-1 -ml-2 font-sans text-sm leading-relaxed text-ink-soft transition-colors hover:bg-hanji-border/20"
        >
          {currentText}
        </p>
      )}
    </div>
  )
}

/* ── 단일 행 ──────────────────────────────────────────────────────── */
function PassageRow({ passage }: { passage: HunminPassage }) {
  const store = useOverridesStore()
  const currentKorean = store[koreanKey(passage.number)]?.value ?? passage.korean
  const displayName = `[${passage.number}] ${passage.originalText.slice(0, 18)}…`

  return (
    <div>
      <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 px-5 py-5">
        <span className="pt-1 font-serif text-base leading-none text-ink-muted/80">
          [{passage.number}]
        </span>
        <div className="min-w-0">
          <p className="font-serif text-lg leading-relaxed text-ink" lang="ko">
            {passage.originalText}
          </p>
          <KoreanEditor passage={passage} currentText={currentKorean} />
        </div>
      </div>
      <TranslationDrawer
        type="hunminPassage"
        id={passage.number}
        displayName={displayName}
        koreanSource={currentKorean}
        sourceLabel="한국어"
        baseValues={buildHunminPassageBaseValues(passage.translations)}
        languageNames={ADMIN_LANGUAGE_NAMES}
        registeredFromCode
      />
    </div>
  )
}

export default function AdminHunminjeongeumPage() {
  const [sectionId, setSectionId] = useState<HunminPassageSection['id']>('initial')
  const section = HUNMIN_PASSAGE_SECTIONS.find((item) => item.id === sectionId) ?? HUNMIN_PASSAGE_SECTIONS[0]

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

      <p className="mb-2 font-sans text-sm text-ink-muted">콘텐츠 편집</p>
      <h1 className="mb-6 font-serif text-2xl text-ink">훈민정음</h1>
      <div role="tablist" aria-label="훈민정음 단락" className="mb-10 inline-flex border border-hanji-border">
        {HUNMIN_PASSAGE_SECTIONS.map((item) => {
          const selected = item.id === section.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSectionId(item.id)}
              className={`px-4 py-2 font-sans text-sm ${
                selected ? 'bg-hanji-warm text-ink' : 'bg-hanji text-ink-muted hover:text-ink'
              }`}
            >
              {SECTION_LABEL[item.id]}
            </button>
          )
        })}
      </div>

      <div className="divide-y divide-hanji-border border border-hanji-border rounded-sm">
        {section.passages.map((passage) => (
          <PassageRow key={passage.number} passage={passage} />
        ))}
      </div>
    </div>
  )
}
