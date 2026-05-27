'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { TranslationDrawer } from '@/components/admin/TranslationDrawer'
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

  const save = async () => {
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
    setSaving(false)
    setEditing(false)
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
          <div className="flex items-center gap-2 justify-end">
            {draft !== baseText && draft !== currentText && (
              <span className="font-sans text-[10px] text-ink-muted/40">원본과 다름</span>
            )}
            <button
              onClick={async () => {
                setSaving(true)
                await save()
              }}
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
          title="클릭하여 한국어 편집"
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
        baseValues={getHomeFieldBaseValues(fieldId)}
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
        <p className="font-sans text-xs text-ink-muted">홈</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted mb-2">콘텐츠 편집</p>
        <h1 className="font-serif text-2xl text-ink mb-3">홈</h1>
        <p className="font-sans text-xs text-ink-muted/70 mb-10 leading-relaxed">
          메인 화면 히어로, 연구 소개, 문의하기 섹션의 텍스트입니다. 한국어 원문을 클릭해 수정하고, 「語 번역」에서 다국어를 관리합니다.
        </p>
      </motion.div>

      {sections.map((section) => {
        const fields = HOME_CMS_FIELDS.filter((f) => f.section === section)
        return (
          <div key={section} className="mb-12">
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="font-serif text-base text-ink">{section}</h2>
              <span className="font-sans text-[10.5px] text-ink-muted/60">{fields.length}개</span>
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
