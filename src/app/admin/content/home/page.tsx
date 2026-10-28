'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { TranslationDrawer } from '@/components/admin/TranslationDrawer'
import { ADMIN_LANGUAGE_NAMES } from '@/components/admin/adminLanguageNames'
import { useOverridesStore, patchOverride, getCurrentKorean } from '@/lib/overrides-store'
import { HOME_CMS_FIELDS, HOME_KO_BASE, type HomeCmsFieldId } from '@/data/home-content'
import { getHomeFieldBaseValues } from '@/lib/home-i18n-base'

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

function KoreanEditor({
  id,
  displayName,
  baseText,
  currentText,
}: {
  id: HomeCmsFieldId
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
        await patchOverride({
          key: `home:${id}:description:ko`,
          remove: true,
          displayName,
          lang: 'ko',
          type: 'home',
        })
      } else {
        await patchOverride({
          key: `home:${id}:description:ko`,
          value: draft,
          sourceSnapshot: '',
          displayName,
          lang: 'ko',
          type: 'home',
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
    <div className="min-w-0 flex-1">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={id === 'homeIntro' || id === 'homeResearchDesc' ? 5 : 3}
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
          className={`cursor-pointer rounded-sm px-2 py-1 -ml-2 font-sans text-xs leading-relaxed transition-colors hover:bg-hanji-border/20 whitespace-pre-line ${
            hasOverride ? 'text-ink border-l-2 border-gold/40 pl-3' : 'text-ink-muted/70'
          }`}
        >
          {currentText}
        </p>
      )}
    </div>
  )
}

function HomeFieldRow({ fieldId, label, index }: { fieldId: HomeCmsFieldId; label: string; index: number }) {
  const store = useOverridesStore()
  const baseText = HOME_KO_BASE[fieldId]
  const koreanSource = getCurrentKorean(store, 'home', fieldId, baseText)
  const displayName = label

  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="show">
      <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:gap-4">
        <p className="shrink-0 font-sans text-sm text-ink sm:w-28">{label}</p>
        <KoreanEditor
          id={fieldId}
          displayName={displayName}
          baseText={baseText}
          currentText={koreanSource}
        />
      </div>
      <TranslationDrawer
        type="home"
        id={fieldId}
        displayName={displayName}
        koreanSource={koreanSource}
        sourceLabel="한국어"
        baseValues={getHomeFieldBaseValues(fieldId)}
        languageNames={ADMIN_LANGUAGE_NAMES}
        registeredFromCode
      />
    </motion.div>
  )
}

export default function AdminHomePage() {
  const sections = Array.from(new Set(HOME_CMS_FIELDS.map((f) => f.section)))

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
        <p className="font-sans text-xs text-ink-muted">메인 페이지</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="font-sans text-[11px] uppercase tracking-normal text-ink-muted mb-2">콘텐츠 편집</p>
        <h1 className="font-serif text-2xl text-ink mb-10">메인 페이지</h1>
      </motion.div>

      {sections.map((section) => {
        const fields = HOME_CMS_FIELDS.filter((f) => f.section === section)
        return (
          <div key={section} className="mb-12">
            <div className="mb-4">
              <h2 className="font-serif text-base text-ink">{section}</h2>
            </div>
            <div className="divide-y divide-hanji-border border border-hanji-border rounded-sm">
              {fields.map((field, i) => (
                <HomeFieldRow key={field.id} fieldId={field.id} label={field.label} index={i} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
