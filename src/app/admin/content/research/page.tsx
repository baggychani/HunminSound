'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ADMIN_LANGUAGE_NAMES } from '@/components/admin/adminLanguageNames'
import type { ResearchContent, TeamDirectoryGroup, TeamRow } from '@/lib/research-content'
import { TRANSLATION_LANGS } from '@/lib/i18n-overrides'
import { teamPhotoSrc } from '@/lib/teamSlugs'

function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function ClickEdit({
  value,
  onSave,
  multiline,
  className,
  empty,
}: {
  value: string
  onSave: (value: string) => void
  multiline?: boolean
  className: string
  empty?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const start = () => {
    setDraft(value)
    setEditing(true)
    setTimeout(() => (multiline ? areaRef : inputRef).current?.focus(), 40)
  }

  if (editing) {
    const fieldClass =
      'w-full rounded-sm border border-gold/40 bg-hanji px-3 py-2 font-sans text-xs text-ink outline-none focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.25)] leading-relaxed'
    return (
      <div className="flex flex-col gap-2">
        {multiline ? (
          <textarea ref={areaRef} value={draft} rows={3} onChange={(e) => setDraft(e.target.value)} className={`${fieldClass} resize-none`} />
        ) : (
          <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} className={fieldClass} />
        )}
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={() => { onSave(draft); setEditing(false) }} className="rounded-sm bg-gold/90 px-3 py-1 font-sans text-[10px] text-hanji hover:bg-gold">
            저장
          </button>
          <button type="button" onClick={() => setEditing(false)} className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-soft">
            취소
          </button>
        </div>
      </div>
    )
  }

  return (
    <p onDoubleClick={start} title="더블클릭하여 편집" className={`cursor-pointer rounded-sm px-2 py-1 -ml-2 transition-colors hover:bg-hanji-border/20 ${className}`}>
      {value.trim() ? value : (empty ?? '내용 없음')}
    </p>
  )
}

function LangDrawer({
  label,
  translationKey,
  translations,
  onSave,
}: {
  label: string
  translationKey: string
  translations: ResearchContent['translations']
  onSave: (lang: string, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const count = TRANSLATION_LANGS.filter(({ code }) => (translations[code]?.[translationKey] ?? '').trim()).length

  return (
    <div className="border-t border-hanji-border/40">
      <div className="flex items-center justify-end px-5 py-1.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`flex items-center gap-1.5 rounded-sm px-2 py-1 font-sans text-[10.5px] transition-colors ${open ? 'bg-hanji-border/30 text-ink-soft' : 'text-gold/70 hover:text-gold'}`}
        >
          <span className="font-serif text-sm leading-none">語</span>
          <span>번역</span>
          <span className="font-sans text-[10px] text-ink-muted/50">{label}</span>
          <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold/80 px-1 font-sans text-[9px] font-semibold text-hanji">
            {count}
          </span>
        </button>
      </div>
      {open && (
        <div className="border-t border-hanji-border/40 bg-hanji-warm/20">
          <div className="flex items-center justify-between border-b border-hanji-border/40 px-5 py-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-ink-muted/50">다국어 번역 편집</span>
            <span className="font-sans text-[10px] text-ink-muted/35">텍스트 더블클릭 또는 수정 버튼</span>
          </div>
          {TRANSLATION_LANGS.map(({ code }) => {
            const text = translations[code]?.[translationKey] ?? ''
            return (
              <div key={code} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-3 border-b border-hanji-border/30 px-5 py-3 last:border-b-0">
                <p className="pt-1 font-sans text-xs text-ink">{ADMIN_LANGUAGE_NAMES[code] ?? code}</p>
                <ClickEdit
                  value={text}
                  multiline
                  empty="번역 없음"
                  onSave={(value) => onSave(code, value)}
                  className="font-sans text-xs leading-relaxed text-ink-muted/70"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MemberEditor({
  row,
  index,
  onChange,
  onPhoto,
  translations,
  onTranslate,
}: {
  row: TeamRow
  index: number
  onChange: (patch: Partial<TeamRow>) => void
  onPhoto: (src: string) => void
  translations: ResearchContent['translations']
  onTranslate: (key: string, lang: string, value: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [bust, setBust] = useState(0)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const baseSrc = row.photo || teamPhotoSrc(row.name)
  const src = baseSrc ? (bust ? `${baseSrc}?v=${bust}` : baseSrc) : null
  const textClass = 'font-sans text-xs leading-relaxed text-ink-muted/70'

  const upload = async (file: File) => {
    setUploading(true)
    setPhotoError(null)
    try {
      const body = new FormData()
      body.set('name', row.name)
      body.set('file', file)
      const res = await fetch('/api/admin/team-photo', { method: 'POST', body })
      const data = (await res.json().catch(() => ({}))) as { src?: string; message?: string }
      if (!res.ok || !data.src) throw new Error(data.message ?? '사진을 저장하지 못했습니다.')
      if (data.src !== baseSrc) onPhoto(data.src)
      setBust(Date.now())
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : '사진을 저장하지 못했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const fields: { label: string; key: keyof TeamRow; multiline?: boolean; trans?: boolean }[] = [
    { label: '직위', key: 'role', trans: true },
    { label: '이름', key: 'name' },
    { label: '영어 이름', key: 'nameEn' },
    { label: '소속', key: 'affiliation', multiline: true, trans: true },
    { label: '역할', key: 'task', multiline: true, trans: true },
    { label: '분야', key: 'field', trans: true },
  ]

  return (
    <div className="border border-hanji-border">
      <div className="flex gap-4 px-5 py-5">
        <div className="w-[5.5rem] shrink-0">
          <div className="relative aspect-[4/5] overflow-hidden border border-hanji-border bg-hanji-warm/40">
            {src ? <img src={src} alt={row.name} className="h-full w-full object-cover" /> : null}
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="mt-2 font-sans text-[10px] text-gold/80 hover:text-gold disabled:opacity-50"
          >
            {uploading ? '올리는 중…' : '사진 바꾸기'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (file) void upload(file)
            }}
          />
          {photoError && <p className="mt-1 font-sans text-[10px] leading-snug text-red-500">{photoError}</p>}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-2">
              <p className="pt-1 font-sans text-xs text-ink-muted">{field.label}</p>
              <ClickEdit
                value={row[field.key] ?? ''}
                multiline={field.multiline}
                empty={field.key === 'nameEn' ? '영어 이름 없음' : '내용 없음'}
                onSave={(value) => onChange({ [field.key]: value })}
                className={textClass}
              />
            </div>
          ))}
        </div>
      </div>
      {fields.filter((field) => field.trans).map((field) => (
        <LangDrawer
          key={field.key}
          label={field.label}
          translationKey={`team.rows.${index}.${field.key}`}
          translations={translations}
          onSave={(lang, value) => onTranslate(`team.rows.${index}.${field.key}`, lang, value)}
        />
      ))}
    </div>
  )
}

function DirectoryEditor({
  groups,
  translations,
  onChange,
  onTranslate,
}: {
  groups: TeamDirectoryGroup[]
  translations: ResearchContent['translations']
  onChange: (groups: TeamDirectoryGroup[]) => void
  onTranslate: (key: string, lang: string, value: string) => void
}) {
  const textClass = 'font-sans text-xs leading-relaxed text-ink-muted/70'

  const updateGroup = (index: number, patch: Partial<TeamDirectoryGroup>) => {
    const next = groups.map((group, i) => (i === index ? { ...group, ...patch } : group))
    onChange(next)
  }

  return (
    <div className="mt-8 space-y-6 border-t border-hanji-border pt-8">
      {groups.map((group, index) => {
        const namesEn = group.namesEn ?? group.names.map(() => '')
        return (
          <div key={`${group.role}-${index}`} className="border border-hanji-border">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-2 px-5 py-4">
              <p className="pt-1 font-sans text-xs text-ink-muted">직위</p>
              <ClickEdit value={group.role} onSave={(role) => updateGroup(index, { role })} className="font-sans text-sm text-ink" />
            </div>
            {group.subtitle !== undefined && (
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-2 px-5 pb-4">
                <p className="pt-1 font-sans text-xs text-ink-muted">괄호</p>
                <ClickEdit value={group.subtitle} onSave={(subtitle) => updateGroup(index, { subtitle })} className={textClass} />
              </div>
            )}
            <div className="divide-y divide-hanji-border/50 border-t border-hanji-border/50">
              {group.names.map((name, nameIndex) => (
                <div key={nameIndex} className="grid gap-2 px-5 py-3 sm:grid-cols-2">
                  <ClickEdit
                    value={name}
                    onSave={(value) => {
                      const names = [...group.names]
                      names[nameIndex] = value
                      updateGroup(index, { names })
                    }}
                    className={textClass}
                  />
                  <ClickEdit
                    value={namesEn[nameIndex] ?? ''}
                    empty="영어 이름 없음"
                    onSave={(value) => {
                      const nextEn = [...namesEn]
                      while (nextEn.length < group.names.length) nextEn.push('')
                      nextEn[nameIndex] = value
                      updateGroup(index, { namesEn: nextEn })
                    }}
                    className={textClass}
                  />
                </div>
              ))}
            </div>
            <LangDrawer label="직위" translationKey={`team.directory.${index}.role`} translations={translations} onSave={(lang, value) => onTranslate(`team.directory.${index}.role`, lang, value)} />
            {group.subtitle !== undefined && (
              <LangDrawer label="괄호" translationKey={`team.directory.${index}.subtitle`} translations={translations} onSave={(lang, value) => onTranslate(`team.directory.${index}.subtitle`, lang, value)} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AdminResearchPage() {
  const [data, setData] = useState<ResearchContent | null>(null)
  const [sha, setSha] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const dataRef = useRef<ResearchContent | null>(null)
  const shaRef = useRef<string | null>(null)
  const queueRef = useRef(Promise.resolve())

  useEffect(() => {
    dataRef.current = data
  }, [data])
  useEffect(() => {
    shaRef.current = sha
  }, [sha])

  useEffect(() => {
    fetch('/api/admin/research-content', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((body: { data: ResearchContent; sha: string | null }) => {
        dataRef.current = body.data
        shaRef.current = body.sha
        setData(body.data)
        setSha(body.sha)
      })
      .catch(() => setError('데이터를 불러오지 못했습니다.'))
  }, [])

  const persist = useCallback(async (next: ResearchContent) => {
    setSaving(true)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/research-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: next, sha: shaRef.current }),
      })
      const body = (await res.json().catch(() => null)) as { message?: string; sha?: string | null } | null
      if (res.status === 401) {
        throw new Error('로그인이 만료되었습니다. 이 탭은 새로고침하지 말고, 새 탭에서 다시 로그인한 뒤 저장을 다시 눌러 주세요.')
      }
      if (!res.ok) throw new Error(body?.message ?? '저장에 실패했습니다.')
      shaRef.current = body?.sha ?? null
      setSha(body?.sha ?? null)
      setNotice('저장했습니다. 1~2분 뒤 사이트에 반영됩니다.')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }, [])

  const commit = useCallback((mutator: (draft: ResearchContent) => void) => {
    const current = dataRef.current
    if (!current) return
    const next = cloneDeep(current)
    mutator(next)
    dataRef.current = next
    setData(next)
    queueRef.current = queueRef.current.then(() => persist(next))
  }, [persist])

  const saveTrans = (key: string, lang: string, value: string) => {
    commit((draft) => {
      const map = { ...(draft.translations[lang] ?? {}) }
      const trimmed = value.trim()
      if (trimmed) map[key] = trimmed
      else delete map[key]
      draft.translations = { ...draft.translations, [lang]: map }
    })
  }

  if (error) {
    return <div className="flex flex-1 items-center justify-center"><p className="font-sans text-sm text-red-500">{error}</p></div>
  }
  if (!data) {
    return <div className="flex flex-1 items-center justify-center"><p className="font-sans text-sm text-ink-muted">불러오는 중…</p></div>
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-10 sm:py-16">
      <div className="mb-10 flex items-center gap-3 border-b border-hanji-border pb-6">
        <Link href="/admin" className="font-sans text-xs text-ink-muted/60 hover:text-ink-accent transition-colors">
          ← 대시보드
        </Link>
        <span className="text-hanji-border">/</span>
        <p className="font-sans text-xs text-ink-muted">연구 소개</p>
      </div>

      <p className="mb-2 font-sans text-sm text-ink-muted">콘텐츠 편집</p>
      <h1 className="mb-2 font-serif text-2xl text-ink">연구 소개</h1>
      {(saving || notice) && (
        <p className={`mb-8 font-sans text-xs ${saving || notice?.startsWith('저장했습니다') ? 'text-ink-muted' : 'text-red-500'}`}>
          {saving ? '저장 중…' : notice}
        </p>
      )}
      {!saving && !notice && <div className="mb-8" />}

      <h2 className="mb-4 font-serif text-base text-ink">연구진 소개</h2>
      <div className="space-y-4">
        {data.team.rows.map((row, index) => (
          <MemberEditor
            key={`${row.name}-${index}`}
            row={row}
            index={index}
            translations={data.translations}
            onChange={(patch) => commit((draft) => {
              draft.team.rows[index] = { ...draft.team.rows[index], ...patch }
            })}
            onPhoto={(src) => commit((draft) => {
              draft.team.rows[index] = { ...draft.team.rows[index], photo: src }
            })}
            onTranslate={saveTrans}
          />
        ))}
      </div>

      <DirectoryEditor
        groups={data.team.directory ?? []}
        translations={data.translations}
        onChange={(groups) => commit((draft) => {
          draft.team.directory = groups
        })}
        onTranslate={saveTrans}
      />

      <h2 className="mb-4 mt-12 font-serif text-base text-ink">과제 정보</h2>
      <div className="divide-y divide-hanji-border border border-hanji-border">
        {data.taskInfo.rows.map((row, index) => (
          <div key={`${row.label}-${index}`}>
            <div className="grid gap-3 px-5 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <ClickEdit
                value={row.label}
                onSave={(label) => commit((draft) => {
                  draft.taskInfo.rows[index] = { ...draft.taskInfo.rows[index], label }
                })}
                className="font-sans text-xs text-ink"
              />
              <ClickEdit
                value={row.value}
                multiline
                onSave={(value) => commit((draft) => {
                  draft.taskInfo.rows[index] = { ...draft.taskInfo.rows[index], value }
                })}
                className="font-sans text-xs leading-relaxed text-ink-muted/70"
              />
            </div>
            <LangDrawer label="항목" translationKey={`taskInfo.rows.${index}.label`} translations={data.translations} onSave={(lang, value) => saveTrans(`taskInfo.rows.${index}.label`, lang, value)} />
            <LangDrawer label="내용" translationKey={`taskInfo.rows.${index}.value`} translations={data.translations} onSave={(lang, value) => saveTrans(`taskInfo.rows.${index}.value`, lang, value)} />
          </div>
        ))}
      </div>
    </div>
  )
}
