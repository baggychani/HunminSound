'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ADMIN_LANGUAGE_NAMES } from '@/components/admin/adminLanguageNames'
import type { ResearchContent, TeamDirectoryGroup, TeamRow } from '@/lib/research-content'
import { TRANSLATION_LANGS } from '@/lib/i18n-overrides'
import { CMS_CONTENT_CHANGED, notifyCmsSaved } from '@/lib/overrides-store'
import { teamPhotoSrc } from '@/lib/teamSlugs'

function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const ROW_TRANSLATION = /^team\.rows\.(\d+)\.(role|affiliation|task|field)$/

function reindexRowKeys(map: Record<string, string>, removed: number): Record<string, string> {
  const next: Record<string, string> = {}
  for (const [key, value] of Object.entries(map)) {
    const match = key.match(ROW_TRANSLATION)
    if (!match) {
      next[key] = value
      continue
    }
    const index = Number(match[1])
    if (index === removed) continue
    const shifted = index > removed ? index - 1 : index
    next[`team.rows.${shifted}.${match[2]}`] = value
  }
  return next
}

function emptyMember(): TeamRow {
  return { role: '', name: '', nameEn: '', affiliation: '', task: '', field: '' }
}

function eul(word: string): '을' | '를' {
  const last = word.charCodeAt(word.length - 1)
  if (last < 0xac00 || last > 0xd7a3) return '를'
  return (last - 0xac00) % 28 === 0 ? '를' : '을'
}

const iconButtonClass =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hanji-border bg-hanji font-sans text-lg leading-none tracking-normal text-ink-muted hover:border-red-400/50 hover:text-red-500'

function ClickEdit({
  value,
  onSave,
  multiline,
  className,
  empty,
}: {
  value: string
  onSave: (value: string) => void | Promise<void>
  multiline?: boolean
  className: string
  empty?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const start = () => {
    setError(null)
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
          <button type="button" disabled={saving} onClick={async () => {
            setSaving(true); setError(null)
            try { await onSave(draft); setEditing(false) }
            catch (e) { setError(e instanceof Error ? e.message : '저장하지 못했습니다.') }
            finally { setSaving(false) }
          }} className="rounded-sm bg-gold/90 px-3 py-1 font-sans text-[10px] text-hanji hover:bg-gold disabled:opacity-50">
            {saving ? '저장 중…' : '저장'}
          </button>
          <button type="button" disabled={saving} onClick={() => setEditing(false)} className="px-2 py-1 font-sans text-[10px] text-ink-muted/50 hover:text-ink-soft">
            취소
          </button>
        </div>
        {error && <p role="alert" className="font-sans text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <p onDoubleClick={start} title="더블클릭하여 편집" className={`cursor-pointer rounded-sm px-2 py-1 -ml-2 transition-colors hover:bg-hanji-border/20 ${className}`}>
      {value.trim() ? value : (empty ?? '내용 없음')}
    </p>
  )
}

function FieldLine({
  label,
  value,
  onSave,
  multiline,
  empty,
  translationKey,
  translations,
  onTranslate,
}: {
  label: string
  value: string
  onSave: (value: string) => void
  multiline?: boolean
  empty?: string
  translationKey?: string
  translations?: ResearchContent['translations']
  onTranslate?: (lang: string, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const count = translationKey && translations
    ? TRANSLATION_LANGS.filter(({ code }) => (translations[code]?.[translationKey] ?? '').trim()).length
    : 0

  return (
    <div className="border-b border-hanji-border/40 py-3 last:border-b-0">
      <div className="flex items-start gap-6">
        <p className="w-16 shrink-0 pt-1 font-sans text-xs tracking-normal text-ink-muted">{label}</p>
        <div className="min-w-0 flex-1">
          <ClickEdit
            value={value}
            multiline={multiline}
            empty={empty}
            onSave={onSave}
            className="font-sans text-xs tracking-normal leading-relaxed text-ink"
          />
        </div>
        {translationKey && onTranslate && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-hanji-border px-2.5 py-1 font-sans text-xs tracking-normal text-ink-muted hover:border-gold/50 hover:text-gold"
          >
            번역
            <span className="font-sans text-[11px] tracking-normal text-gold">{count}</span>
          </button>
        )}
      </div>
      {open && translationKey && translations && onTranslate && (
        <div className="mt-3 space-y-2 pl-[5.5rem]">
          {TRANSLATION_LANGS.map(({ code }) => (
            <div key={code} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-3">
              <p className="pt-1 font-sans text-xs tracking-normal text-ink-muted">{ADMIN_LANGUAGE_NAMES[code] ?? code}</p>
              <ClickEdit
                value={translations[code]?.[translationKey] ?? ''}
                multiline
                empty="번역 없음"
                onSave={(next) => onTranslate(code, next)}
                className="font-sans text-xs tracking-normal leading-relaxed text-ink-muted/80"
              />
            </div>
          ))}
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
  onRemove,
}: {
  row: TeamRow
  index: number
  onChange: (patch: Partial<TeamRow>) => void
  onPhoto: (src: string) => void
  translations: ResearchContent['translations']
  onTranslate: (key: string, lang: string, value: string) => void
  onRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [bust, setBust] = useState(0)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const baseSrc = row.photo || teamPhotoSrc(row.name)
  const src = baseSrc ? (bust ? `${baseSrc}?v=${bust}` : baseSrc) : null

  const upload = async (file: File) => {
    setUploading(true)
    setPhotoError(null)
    try {
      const body = new FormData()
      body.set('name', row.name)
      body.set('nameEn', row.nameEn ?? '')
      body.set('photo', row.photo ?? '')
      body.set('file', file)
      const res = await fetch('/api/admin/team-photo', { method: 'POST', body })
      const data = (await res.json().catch(() => ({}))) as { src?: string; message?: string }
      if (!res.ok || !data.src) throw new Error(data.message ?? '사진을 저장하지 못했습니다.')
      if (data.src !== baseSrc) {
        try {
          await onPhoto(data.src)
        } catch (err) {
          await fetch('/api/admin/team-photo', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src: data.src }),
          }).catch(() => {})
          throw err
        }
      }
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
    <div className="relative">
      <button
        type="button"
        title="삭제"
        aria-label="삭제"
        onClick={onRemove}
        className={`absolute left-full top-2 z-10 ml-2 ${iconButtonClass}`}
      >
        <span aria-hidden="true">−</span>
      </button>
      <div className="flex items-start gap-10 border border-hanji-border px-5 py-5 sm:gap-14">
      <div className="w-40 shrink-0">
        <div className="aspect-[4/5] overflow-hidden border border-hanji-border bg-hanji-warm/40">
          {src ? <img src={src} alt={row.name} className="h-full w-full object-cover" /> : null}
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="mt-3 w-full whitespace-nowrap rounded-sm border border-hanji-border bg-hanji px-3 py-2 font-sans text-sm tracking-normal text-ink hover:bg-hanji-warm disabled:opacity-50"
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
        {photoError && <p className="mt-2 font-sans text-xs tracking-normal leading-snug text-red-500">{photoError}</p>}
      </div>
      <div className="min-w-0 flex-1">
        {fields.map((field) => (
          <FieldLine
            key={field.key}
            label={field.label}
            value={row[field.key] ?? ''}
            multiline={field.multiline}
            empty={field.key === 'nameEn' ? '영어 이름 없음' : '내용 없음'}
            onSave={(value) => onChange({ [field.key]: value })}
            translationKey={field.trans ? `team.rows.${index}.${field.key}` : undefined}
            translations={field.trans ? translations : undefined}
            onTranslate={field.trans ? (lang, value) => onTranslate(`team.rows.${index}.${field.key}`, lang, value) : undefined}
          />
        ))}
      </div>
      </div>
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
  const updateGroup = (index: number, patch: Partial<TeamDirectoryGroup>) => {
    onChange(groups.map((group, i) => (i === index ? { ...group, ...patch } : group)))
  }

  return (
    <div className="mt-8 space-y-6 border-t border-hanji-border pt-8">
      {groups.map((group, index) => {
        const namesEn = group.namesEn ?? group.names.map(() => '')
        return (
          <div key={`${group.role}-${index}`} className="border border-hanji-border px-5 py-2">
            <FieldLine
              label="직위"
              value={group.role}
              onSave={(role) => updateGroup(index, { role })}
              translationKey={`team.directory.${index}.role`}
              translations={translations}
              onTranslate={(lang, value) => onTranslate(`team.directory.${index}.role`, lang, value)}
            />
            {group.subtitle !== undefined && (
              <FieldLine
                label="괄호"
                value={group.subtitle}
                onSave={(subtitle) => updateGroup(index, { subtitle })}
                translationKey={`team.directory.${index}.subtitle`}
                translations={translations}
                onTranslate={(lang, value) => onTranslate(`team.directory.${index}.subtitle`, lang, value)}
              />
            )}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2rem] gap-4 pt-3 font-sans text-xs tracking-normal text-ink-muted">
              <p>이름</p>
              <p>영어 이름</p>
              <span aria-hidden="true" />
            </div>
            {group.names.map((name, nameIndex) => (
              <div key={nameIndex} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2rem] items-center gap-4 border-b border-hanji-border/40 py-3 last:border-b-0">
                <ClickEdit
                  value={name}
                  onSave={(value) => {
                    const names = [...group.names]
                    names[nameIndex] = value
                    updateGroup(index, { names })
                  }}
                  className="font-sans text-xs tracking-normal leading-relaxed text-ink"
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
                  className="font-sans text-xs tracking-normal leading-relaxed text-ink-muted/80"
                />
                <button
                  type="button"
                  title="삭제"
                  aria-label="삭제"
                  onClick={() => {
                    const label = name.trim() || '이 이름'
                    if (!window.confirm(`${label}${eul(label)} 삭제할까요?`)) return
                    const names = group.names.filter((_, i) => i !== nameIndex)
                    const nextEn = namesEn.filter((_, i) => i !== nameIndex)
                    updateGroup(index, { names, namesEn: nextEn })
                  }}
                  className={iconButtonClass}
                >
                  <span aria-hidden="true">−</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const padded = [...namesEn]
                while (padded.length < group.names.length) padded.push('')
                updateGroup(index, { names: [...group.names, ''], namesEn: [...padded, ''] })
              }}
              className="my-3 inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-hanji-border px-3 py-2 font-sans text-sm tracking-normal text-ink hover:bg-hanji-warm"
            >
              <span aria-hidden="true" className="text-base leading-none tracking-normal">+</span>
              연구진 추가
            </button>
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
    let cancelled = false
    let ticket = 0
    const load = () => {
      const current = ++ticket
      fetch('/api/admin/research-content', { cache: 'no-store' })
        .then((res) => {
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then((body: { data: ResearchContent; sha: string | null }) => {
          if (cancelled || current !== ticket) return
          dataRef.current = body.data
          shaRef.current = body.sha
          setData(body.data)
          setSha(body.sha)
          setError(null)
        })
        .catch(() => { if (!cancelled && current === ticket) setError('데이터를 불러오지 못했습니다.') })
    }
    load()
    window.addEventListener(CMS_CONTENT_CHANGED, load)
    return () => {
      cancelled = true
      window.removeEventListener(CMS_CONTENT_CHANGED, load)
    }
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
      setNotice('저장했습니다. 사이트에 반영되었습니다.')
      notifyCmsSaved()
    } catch (err) {
      setNotice(err instanceof Error ? err.message : '저장에 실패했습니다.')
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const commit = useCallback((mutator: (draft: ResearchContent) => void) => {
    const task = queueRef.current.then(async () => {
      const current = dataRef.current
      if (!current) throw new Error('현재 내용을 불러오지 못했습니다.')
      const next = cloneDeep(current)
      mutator(next)
      await persist(next)
      dataRef.current = next
      setData(next)
    })
    queueRef.current = task.catch(() => {})
    return task
  }, [persist])

  const saveTrans = (key: string, lang: string, value: string) => {
    return commit((draft) => {
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
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-ink">연구 소개</h1>
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            if (!window.confirm('연구 소개 전체를 코드에 있는 기준본으로 되돌릴까요? 지금 내용은 수정 이력에 남습니다.')) return
            const task = queueRef.current.then(async () => {
              setSaving(true)
              setNotice(null)
              try {
                const res = await fetch('/api/admin/research-content', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ baseline: true, sha: shaRef.current }),
                })
                const body = (await res.json().catch(() => null)) as { message?: string; sha?: string | null; data?: ResearchContent } | null
                if (res.status === 401) {
                  throw new Error('로그인이 만료되었습니다. 이 탭은 새로고침하지 말고, 새 탭에서 다시 로그인한 뒤 다시 시도해 주세요.')
                }
                if (!res.ok || !body?.data || typeof body.sha !== 'string') {
                  throw new Error(body?.message ?? '기준본으로 되돌리지 못했습니다.')
                }
                dataRef.current = body.data
                shaRef.current = body.sha
                setData(body.data)
                setSha(body.sha)
                setNotice('저장했습니다. 코드 기준본으로 되돌렸고 사이트에 반영되었습니다.')
                notifyCmsSaved()
              } catch (err) {
                setNotice(err instanceof Error ? err.message : '기준본으로 되돌리지 못했습니다.')
              } finally {
                setSaving(false)
              }
            })
            queueRef.current = task.catch(() => {})
          }}
          className="px-2 py-1 font-sans text-[11px] text-ink-muted/70 hover:text-ink-accent disabled:opacity-50"
        >
          기준본으로
        </button>
      </div>
      {(saving || notice) && (
        <p className={`mb-8 font-sans text-xs ${saving || notice?.startsWith('저장했습니다') ? 'text-ink-muted' : 'text-red-500'}`}>
          {saving ? '저장 중…' : notice}
        </p>
      )}
      {!saving && !notice && <div className="mb-8" />}

      <h2 className="mb-4 font-serif text-base text-ink">연구진 소개</h2>
      <div className="space-y-6">
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
            onRemove={() => {
              const label = row.name.trim()
              if (!window.confirm(label ? `${label} 님을 삭제할까요?` : '이 연구진을 삭제할까요?')) return
              commit((draft) => {
                draft.team.rows.splice(index, 1)
                draft.translations = Object.fromEntries(
                  Object.entries(draft.translations).map(([lang, map]) => [lang, reindexRowKeys(map, index)]),
                )
                if (draft.translationSnapshots) {
                  draft.translationSnapshots = reindexRowKeys(draft.translationSnapshots, index)
                }
              })
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => commit((draft) => {
            draft.team.rows.push(emptyMember())
          })}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-hanji-border px-3 py-2 font-sans text-sm tracking-normal text-ink hover:bg-hanji-warm"
        >
          <span aria-hidden="true" className="text-base leading-none tracking-normal">+</span>
          연구진 추가
        </button>
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
      <div className="space-y-4">
        {data.taskInfo.rows.map((row, index) => (
          <div key={index} className="border border-hanji-border px-5 py-2">
            <FieldLine
              label="항목"
              value={row.label}
              onSave={(label) => commit((draft) => {
                draft.taskInfo.rows[index] = { ...draft.taskInfo.rows[index], label }
              })}
              translationKey={`taskInfo.rows.${index}.label`}
              translations={data.translations}
              onTranslate={(lang, value) => saveTrans(`taskInfo.rows.${index}.label`, lang, value)}
            />
            <FieldLine
              label="내용"
              value={row.value}
              multiline
              onSave={(value) => commit((draft) => {
                draft.taskInfo.rows[index] = { ...draft.taskInfo.rows[index], value }
              })}
              translationKey={`taskInfo.rows.${index}.value`}
              translations={data.translations}
              onTranslate={(lang, value) => saveTrans(`taskInfo.rows.${index}.value`, lang, value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
