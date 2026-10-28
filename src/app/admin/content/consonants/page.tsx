'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { consonantsData } from '@/data/consonants'
import { HUNMIN_CONSONANT_ROWS, type HunminRow } from '@/data/hunminConsonantLayout'
import { TranslationDrawer } from '@/components/admin/TranslationDrawer'
import { useOverridesStore, patchOverride, makeKoreanKey, getCurrentKorean } from '@/lib/overrides-store'
import { buildPhonemeDescriptionBaseValues } from '@/lib/cms-base-values'
import type { SupportedTranslationLang } from '@/lib/i18n-overrides'
import type { Consonant } from '@/types'

const CATEGORY_ORDER = ['파열음', '마찰음', '파찰음', '비음', '유음']

const HUNMIN_CLASSIC_LABEL: Record<string, string> = {
  aram: '牙音',
  seol: '舌音',
  sun: '唇音',
  chi: '齒音',
  hu: '喉音',
}

const LANGUAGE_NAMES: Partial<Record<SupportedTranslationLang, string>> = {
  en: '영어',
  zh: '중국어',
  ja: '일본어',
  fr: '프랑스어',
  de: '독일어',
  es: '스페인어',
  hi: '힌디어',
  vi: '베트남어',
  ru: '러시아어',
  ar: '아랍어',
  tr: '터키어',
  id: '인도네시아어',
  th: '태국어',
}

type ViewMode = 'modern' | 'hunmin'

function symbolsInHunminRow(row: HunminRow): { symbol: string; slot: string }[] {
  const seen = new Set<string>()
  const out: { symbol: string; slot: string }[] = []
  for (const segment of [...row.basicSegments, ...row.extendedSegments]) {
    for (const symbol of segment.symbols) {
      if (seen.has(symbol)) continue
      seen.add(symbol)
      out.push({ symbol, slot: segment.label })
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
        <p
          onClick={startEdit}
          title="클릭하여 한국어 설명 편집"
          className={`cursor-pointer rounded-sm px-2 py-1 -ml-2 font-sans text-xs leading-relaxed transition-colors hover:bg-hanji-border/20 ${hasOverride ? 'text-ink border-l-2 border-gold/40 pl-3' : 'text-ink-muted/70'}`}
        >
          {currentText}
        </p>
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
      <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[3rem_11rem_1fr] gap-x-4 gap-y-2 px-5 py-4">
        <span className="font-jamo text-2xl text-ink leading-none self-start pt-1" lang="ko">
          {consonant.symbol}
        </span>
        <div>
          <p className="font-sans text-sm text-ink">{consonant.name}</p>
          <p className="font-sans text-[10.5px] text-ink-muted/60 mt-0.5 space-x-2">
            <span>ani: <span className="text-gold/70">{consonant.animationFileName ?? '—'}</span></span>
            <span>mri: <span className="text-gold/70">{consonant.mriFileName ?? '—'}</span></span>
          </p>
        </div>
        <KoreanEditor
          type="consonant" id={consonant._id} displayName={consonant.name}
          baseText={consonant.description} currentText={koreanSource}
        />
      </div>
      <TranslationDrawer
        type="consonant" id={consonant._id} displayName={consonant.name}
        koreanSource={koreanSource}
        baseValues={buildPhonemeDescriptionBaseValues(consonant)}
        languageNames={LANGUAGE_NAMES}
      />
    </div>
  )
}

function EmptySymbolRow({ symbol, slot }: { symbol: string; slot: string }) {
  return (
    <div className="grid grid-cols-[3rem_1fr] gap-x-4 px-5 py-4">
      <span className="font-jamo text-2xl leading-none text-ink-muted/50 pt-0.5" lang="ko">{symbol}</span>
      <p className="font-sans text-sm text-ink-muted/50">{slot}</p>
    </div>
  )
}

function ModeSwitch({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) {
  const options: { id: ViewMode; label: string }[] = [
    { id: 'modern', label: '현대 음성학' },
    { id: 'hunmin', label: '훈민정음' },
  ]
  return (
    <div role="tablist" aria-label="자음 배열" className="mb-10 inline-flex border border-hanji-border">
      {options.map((option) => {
        const selected = mode === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.id)}
            className={`px-4 py-2 font-sans text-sm ${
              selected ? 'bg-hanji-warm text-ink' : 'bg-hanji text-ink-muted hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default function AdminConsonantsPage() {
  const [mode, setMode] = useState<ViewMode>('modern')
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
      <ModeSwitch mode={mode} onChange={setMode} />

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
          const slots = symbolsInHunminRow(row)
          return (
            <div key={row.id} className="mb-12">
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="font-serif text-base text-ink">{row.title}</h2>
                {HUNMIN_CLASSIC_LABEL[row.id] ? (
                  <span className="font-sans text-xs text-ink-muted/60">{HUNMIN_CLASSIC_LABEL[row.id]}</span>
                ) : null}
              </div>
              <div className="divide-y divide-hanji-border border border-hanji-border rounded-sm">
                {slots.map(({ symbol, slot }) => {
                  const consonant = bySymbol.get(symbol)
                  if (!consonant) return <EmptySymbolRow key={symbol} symbol={symbol} slot={slot} />
                  return <ConsonantRow key={consonant._id} consonant={consonant} />
                })}
              </div>
              {row.footnote ? (
                <p className="mt-2 font-sans text-xs text-ink-muted/60">{row.footnote}</p>
              ) : null}
            </div>
          )
        })
      )}
    </div>
  )
}
