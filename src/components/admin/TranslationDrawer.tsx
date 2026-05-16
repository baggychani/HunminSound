'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  TRANSLATION_LANGS,
  makeOverrideKey,
  isStale,
  type SupportedTranslationLang,
  type TranslationOverride,
} from '@/lib/i18n-overrides'
import { useOverridesStore, patchOverride } from '@/lib/overrides-store'

interface Props {
  type: 'consonant' | 'vowel'
  id: string
  displayName?: string
  koreanSource: string
  baseValues: Partial<Record<SupportedTranslationLang, string>>
}

/* ── 상태 뱃지 ──────────────────────────────────────────────────────────── */
type StatusKind = 'none' | 'ok' | 'stale'

function StatusDot({ kind }: { kind: StatusKind }) {
  if (kind === 'stale') {
    return (
      <span title="원본이 변경됨 — 확인 필요" aria-label="stale"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-amber-400/20 text-amber-500">
        <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
          <path d="M6 1L11 10H1L6 1z" />
        </svg>
      </span>
    )
  }
  if (kind === 'ok') {
    return <span title="저장된 번역" aria-label="ok"
      className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500/80" />
  }
  return <span title="자동 번역 사용 중" aria-label="none"
    className="inline-block h-2 w-2 shrink-0 rounded-full bg-ink-muted/25" />
}

/* ── 언어 행 ────────────────────────────────────────────────────────────── */
interface RowProps {
  langCode: SupportedTranslationLang
  langName: string
  baseValue: string
  override: TranslationOverride | undefined
  koreanSource: string
  onSave: (lang: SupportedTranslationLang, value: string) => Promise<void>
  onDismissStale: (lang: SupportedTranslationLang) => Promise<void>
  onRemove: (lang: SupportedTranslationLang) => Promise<void>
}

function LangRow({ langCode, langName, baseValue, override, koreanSource,
  onSave, onDismissStale, onRemove }: RowProps) {
  const stale = override ? isStale(override, koreanSource) : false
  const status: StatusKind = !override ? 'none' : stale ? 'stale' : 'ok'
  const currentValue = override?.value ?? baseValue
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentValue)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hasValue = !!(override?.value)

  const startEdit = () => { setDraft(currentValue); setEditing(true); setTimeout(() => textareaRef.current?.focus(), 50) }
  const cancelEdit = () => setEditing(false)
  const saveEdit = async () => {
    setSaving(true)
    try {
      // 빈 문자열로 저장하면 고정 해제와 동일하게 처리
      if (!draft.trim()) {
        await onRemove(langCode)
      } else {
        await onSave(langCode, draft.trim())
      }
      setEditing(false)
    } finally { setSaving(false) }
  }

  return (
    <div className={`grid grid-cols-[6rem_1fr_6rem] sm:grid-cols-[8rem_1fr_7rem] items-start gap-3 border-b border-hanji-border/50 px-5 py-3 last:border-0 transition-colors ${stale ? 'bg-amber-400/[0.05]' : ''}`}>
      <div className="flex items-center gap-1.5 pt-0.5">
        <StatusDot kind={status} />
        <span className="font-sans text-[11px] text-ink-muted/80">{langName}</span>
      </div>

      <div>
        {editing ? (
          <textarea ref={textareaRef} value={draft} onChange={(e) => setDraft(e.target.value)} rows={3}
            placeholder="비워두면 자동 번역 사용으로 돌아갑니다"
            className="w-full rounded-sm border border-hanji-border bg-hanji px-2.5 py-2 font-sans text-xs text-ink outline-none resize-none focus-visible:border-gold/60 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.25)] placeholder:text-ink-muted/30" />
        ) : (
          <p onClick={startEdit} title="클릭하여 편집"
            className={`cursor-pointer rounded-sm px-2 py-1 -ml-2 font-sans text-xs leading-relaxed transition-colors hover:bg-hanji-border/20 ${stale ? 'text-amber-600/80 dark:text-amber-400/70' : hasValue ? 'text-ink-soft' : 'italic text-ink-muted/40'}`}>
            {hasValue ? override!.value : '자동 번역 사용'}
          </p>
        )}
        {stale && !editing && (
          <div className="mt-1.5 flex items-center gap-1.5 rounded-sm border border-amber-400/25 bg-amber-400/[0.05] px-2 py-1.5">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className="shrink-0 text-amber-500" aria-hidden>
              <path d="M6 1L11 10H1L6 1z" />
            </svg>
            <p className="font-sans text-[10px] leading-snug text-amber-600/80 dark:text-amber-400/80">
              한국어 원본이 변경되었습니다. 번역을 확인해주세요.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 pt-0.5">
        {editing ? (
          <>
            <button onClick={saveEdit} disabled={saving}
              className="rounded-sm bg-gold/90 px-2.5 py-1 font-sans text-[10px] text-hanji disabled:opacity-50 hover:bg-gold">
              {saving ? '…' : '저장'}
            </button>
            <button onClick={cancelEdit}
              className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-soft transition-colors">
              취소
            </button>
          </>
        ) : (
          <>
            <button onClick={startEdit}
              className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-soft transition-colors">
              수정
            </button>
            {stale && (
              <button onClick={async () => { setSaving(true); try { await onDismissStale(langCode) } finally { setSaving(false) } }} disabled={saving}
                className="px-2 py-1 font-sans text-[10px] text-amber-500/80 hover:text-amber-600 transition-colors disabled:opacity-50">
                수정 불필요
              </button>
            )}
            {override && !stale && (
              <button onClick={async () => { setSaving(true); try { await onRemove(langCode) } finally { setSaving(false) } }} disabled={saving}
                className="px-2 py-1 font-sans text-[10px] text-ink-muted/30 hover:text-ink-accent transition-colors disabled:opacity-50">
                고정 해제
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ── TranslationDrawer ───────────────────────────────────────────────────── */
export function TranslationDrawer({ type, id, displayName, koreanSource, baseValues }: Props) {
  const [open, setOpen] = useState(false)
  const store = useOverridesStore()

  const getKey = useCallback(
    (lang: SupportedTranslationLang) => makeOverrideKey(type, id, lang),
    [type, id],
  )

  const overrideCount = TRANSLATION_LANGS.filter(({ code }) => !!store[getKey(code)]).length
  const staleCount = TRANSLATION_LANGS.filter(({ code }) => {
    const ov = store[getKey(code)]
    return ov ? isStale(ov, koreanSource) : false
  }).length

  const handleSave = async (lang: SupportedTranslationLang, value: string) => {
    await patchOverride({ key: getKey(lang), value, sourceSnapshot: koreanSource, displayName: displayName ?? id, lang, type })
  }
  const handleDismissStale = async (lang: SupportedTranslationLang) => {
    await patchOverride({ key: getKey(lang), staleDismissed: true, displayName: displayName ?? id, lang, type })
  }
  const handleRemove = async (lang: SupportedTranslationLang) => {
    await patchOverride({ key: getKey(lang), remove: true, displayName: displayName ?? id, lang, type })
  }

  return (
    <div className="border-t border-hanji-border/40">
      <div className="flex items-center justify-end px-5 py-1.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`flex items-center gap-1.5 rounded-sm px-2 py-1 font-sans text-[10.5px] transition-colors ${
            open ? 'bg-hanji-border/30 text-ink-soft'
              : overrideCount > 0
              ? 'text-gold/70 hover:text-gold dark:text-gold-light/70 dark:hover:text-gold-light'
              : 'text-ink-muted/40 hover:text-ink-soft'
          }`}
        >
          <span className="font-serif text-sm leading-none">語</span>
          <span>번역</span>
          {overrideCount > 0 && (
            <span className={`flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 font-sans text-[9px] font-semibold ${staleCount > 0 ? 'bg-amber-400/80 text-hanji' : 'bg-gold/80 text-hanji dark:bg-gold-light/80'}`}>
              {overrideCount}
            </span>
          )}
          {staleCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-amber-400/20 text-amber-500">
              <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M6 1L11 10H1L6 1z" /></svg>
            </span>
          )}
          <svg width="9" height="9" viewBox="0 0 10 10"
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="M2 4l3 3 3-3" />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-hanji-border/40 bg-hanji-warm/20 dark:bg-hanji-warm/8">
              <div className="flex items-center justify-between border-b border-hanji-border/40 px-5 py-2">
                <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-ink-muted/50">다국어 번역 편집</span>
                <span className="font-sans text-[10px] text-ink-muted/35">텍스트 클릭 또는 수정 버튼</span>
              </div>
              {TRANSLATION_LANGS.map(({ code, name }) => (
                <LangRow key={code} langCode={code} langName={name}
                  baseValue={baseValues[code] ?? ''} override={store[getKey(code)]}
                  koreanSource={koreanSource}
                  onSave={handleSave} onDismissStale={handleDismissStale} onRemove={handleRemove}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
