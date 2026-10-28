'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { consonantsData } from '@/data/consonants'
import { HUNMIN_CONSONANT_ROWS, type HunminRow } from '@/data/hunminConsonantLayout'
import { PhonemeModeSwitch, type PhonemeAdminMode } from '@/components/admin/PhonemeModeSwitch'
import { TranslationDrawer } from '@/components/admin/TranslationDrawer'
import { patchOverride, makeKoreanKey, useOverridesStore, getCurrentKorean } from '@/lib/overrides-store'
import { ADMIN_LANGUAGE_NAMES } from '@/components/admin/adminLanguageNames'
import { buildPhonemeDescriptionBaseValues } from '@/lib/cms-base-values'
import type { Consonant } from '@/types'

const CATEGORY_ORDER = ['파열음', '마찰음', '파찰음', '비음', '유음']

function symbolsInHunminRow(row: HunminRow): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const segment of [...row.basicSegments, ...row.extendedSegments]) {
    for (const symbol of segment.symbols) {
      if (seen.has(symbol)) continue
      seen.add(symbol)
      out.push(symbol)
    }
  }
  return out
}

/* ── 한국어 설명 인라인 편집기 ──────────────────────────────────────────── */
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

  const startEdit = () => {
    setDraft(currentText)
    setEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const [error, setError] = useState<string | null>(null)

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      if (draft === baseText) {
        await patchOverride({ key: makeKoreanKey(type, id), remove: true, displayName, lang: 'ko', type })
      } else {
        await patchOverride({ key: makeKoreanKey(type, id), value: draft, sourceSnapshot: '', displayName, lang: 'ko', type })
      }
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const restoreBaseline = async () => {
    setSaving(true)
    setError(null)
    try {
      await patchOverride({ key: makeKoreanKey(type, id), remove: true, displayName, lang: 'ko', type })
    } catch (err) {
      setError(err instanceof Error ? err.message : '기준본으로 되돌리지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-2">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full rounded-sm border border-gold/40 bg-hanji px-3 py-2 font-sans text-xs text-ink outline-none resize-none focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.25)] leading-relaxed"
          />
          {error && <p role="alert" className="font-sans text-[11px] leading-snug text-red-500">{error}</p>}
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
            <button onClick={() => setEditing(false)}
              className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-soft transition-colors">
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            onDoubleClick={startEdit}
            title="더블클릭하여 한국어 설명 편집"
            className={`cursor-pointer rounded-sm px-2 py-1 -ml-2 font-sans text-xs leading-relaxed transition-colors hover:bg-hanji-border/20 ${hasOverride ? 'text-ink border-l-2 border-gold/40 pl-3' : 'text-ink-muted/70'}`}
          >
            {currentText}
          </p>
          {hasOverride && (
            <div className="mt-1 flex justify-end">
              <button type="button" onClick={() => void restoreBaseline()} disabled={saving}
                className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-accent transition-colors disabled:opacity-50">
                {saving ? '되돌리는 중…' : '기준본으로'}
              </button>
            </div>
          )}
          {error && <p role="alert" className="mt-1 font-sans text-[11px] leading-snug text-red-500">{error}</p>}
        </>
      )}
    </div>
  )
}

/* ── 자음 행 ─────────────────────────────────────────────────────────────── */
function ConsonantRow({ consonant }: { consonant: Consonant }) {
  const store = useOverridesStore()
  const koreanSource = getCurrentKorean(store, 'consonant', consonant._id, consonant.description)

  return (
    <div>
      <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 px-5 py-4">
        <span className="font-jamo text-2xl text-ink leading-none self-start pt-1" lang="ko">
          {consonant.symbol}
        </span>
        <div className="min-w-0">
          <p className="font-sans text-sm text-ink">{consonant.name}</p>
          <KoreanEditor
            type="consonant" id={consonant._id} displayName={consonant.name}
            baseText={consonant.description} currentText={koreanSource}
          />
        </div>
      </div>
      <TranslationDrawer
        type="consonant" id={consonant._id} displayName={consonant.name}
        koreanSource={koreanSource}
        baseValues={buildPhonemeDescriptionBaseValues(consonant)}
        languageNames={ADMIN_LANGUAGE_NAMES}
        registeredFromCode
      />
    </div>
  )
}

export default function AdminConsonantsPage() {
  const [mode, setMode] = useState<PhonemeAdminMode>('modern')
  const bySymbol = useMemo(() => {
    const map = new Map<string, Consonant>()
    for (const consonant of consonantsData) map.set(consonant.symbol, consonant)
    return map
  }, [])

  const grouped = CATEGORY_ORDER.reduce<Record<string, Consonant[]>>((acc, cat) => {
    acc[cat] = consonantsData.filter((c) => c.category === cat)
    return acc
  }, {})
  const uncategorized = consonantsData.filter((c) => !CATEGORY_ORDER.includes(c.category))

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-10 sm:py-16">
      <div className="mb-10 flex items-center gap-3 border-b border-hanji-border pb-6">
        <Link href="/admin" className="font-sans text-xs text-ink-muted/60 hover:text-ink-accent transition-colors">
          ← 대시보드
        </Link>
        <span className="text-hanji-border">/</span>
        <p className="font-sans text-xs text-ink-muted">자음</p>
      </div>
      <p className="font-sans text-sm text-ink-muted mb-2">콘텐츠 편집</p>
      <h1 className="font-serif text-2xl text-ink mb-6">자음</h1>
      <PhonemeModeSwitch mode={mode} onChange={setMode} label="자음 배열" />

      {mode === 'modern' ? (
        [...CATEGORY_ORDER, ...(uncategorized.length > 0 ? ['기타'] : [])].map((category) => {
          const items = category === '기타' ? uncategorized : (grouped[category] ?? [])
          if (items.length === 0) return null
          return (
            <div key={category} className="mb-12">
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="font-serif text-base text-ink">{category}</h2>
                <span className="font-sans text-xs text-ink-muted/60">{items.length}개</span>
              </div>
              <div className="divide-y divide-hanji-border border border-hanji-border rounded-sm">
                {items.map((c) => <ConsonantRow key={c._id} consonant={c} />)}
              </div>
            </div>
          )
        })
      ) : (
        HUNMIN_CONSONANT_ROWS.map((row) => {
          const items = symbolsInHunminRow(row)
            .map((symbol) => bySymbol.get(symbol))
            .filter((item): item is Consonant => item !== undefined)
          if (items.length === 0) return null
          return (
            <div key={row.id} className="mb-12">
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="font-serif text-base text-ink">{row.title}</h2>
                <span className="font-sans text-xs text-ink-muted/60">{items.length}개</span>
              </div>
              <div className="divide-y divide-hanji-border border border-hanji-border rounded-sm">
                {items.map((consonant) => <ConsonantRow key={consonant._id} consonant={consonant} />)}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
