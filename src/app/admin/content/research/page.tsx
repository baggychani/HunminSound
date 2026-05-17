'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { ResearchContent, AchievementEntry, BulletEntry, MethodRow, TeamRow, TaskInfoRow } from '@/lib/research-content'
import { AdminFooter } from '@/components/admin/AdminFooter'
import { ResearchTranslationModal } from '@/components/admin/ResearchTranslationModal'

/* ── 번역 헬퍼 ────────────────────────────────────────────────────────── */
interface TransHelpers {
  translations: Record<string, Record<string, string>>
  snapshots: Record<string, string>
  onSave: (key: string, lang: string, value: string, koSource: string) => void
  onRemove: (key: string, lang: string) => void
  onDismissStale: (key: string, lang: string) => void
}

function langVals(translations: Record<string, Record<string, string>>, key: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [lang, map] of Object.entries(translations)) {
    if (map[key]) result[lang] = map[key]
  }
  return result
}

/* ── 유틸 ────────────────────────────────────────────────────────────── */
function cloneDeep<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

/* ── 공통 UI ──────────────────────────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-hanji-border/60 rounded-xl bg-surface p-6 space-y-5">
      <h2 className="font-serif text-lg text-ink">{title}</h2>
      {children}
    </section>
  )
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <p className="font-sans text-xs font-medium text-ink-muted/60 uppercase tracking-wide">{children}</p>
      {hint && <p className="font-sans text-[0.7rem] text-ink-muted/40 mt-0.5">{hint}</p>}
    </div>
  )
}

function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      className="w-full font-sans text-sm text-ink bg-background border border-hanji-border/60 rounded-lg px-3 py-2.5 leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-gold/50"
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      className="w-full font-sans text-sm text-ink bg-background border border-hanji-border/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gold/50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function AddButton({ onClick, label = '+ 항목 추가' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-sans text-xs text-gold/70 hover:text-gold border border-dashed border-gold/30 hover:border-gold/50 rounded-lg px-3 py-1.5 transition-colors"
    >
      {label}
    </button>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-sans text-[0.7rem] text-red-400/60 hover:text-red-500 transition-colors shrink-0"
    >
      삭제
    </button>
  )
}

/* ── 단락 목록 편집 ───────────────────────────────────────────────────── */
function ParagraphsEditor({
  paragraphs, onChange, keyPrefix, trans,
}: {
  paragraphs: string[]
  onChange: (v: string[]) => void
  keyPrefix: string
  trans: TransHelpers
}) {
  return (
    <div className="space-y-3">
      <FieldLabel hint="<b>강조</b> 태그 사용 가능">단락</FieldLabel>
      {paragraphs.map((p, i) => {
        const tKey = `${keyPrefix}.${i}`
        return (
          <div key={i} className="border border-hanji-border/40 rounded-xl bg-background overflow-hidden">
            <div className="flex gap-2 items-start p-3">
              <div className="flex-1">
                <TextArea value={p} onChange={(v) => {
                  const next = [...paragraphs]
                  next[i] = v
                  onChange(next)
                }} rows={3} />
              </div>
              <RemoveButton onClick={() => onChange(paragraphs.filter((_, idx) => idx !== i))} />
            </div>
            <ResearchTranslationModal
              translationKey={tKey}
              koreanSource={p}
              langValues={langVals(trans.translations, tKey)}
              snapshot={trans.snapshots[tKey]}
              onSave={(lang, value, snap) => trans.onSave(tKey, lang, value, snap)}
              onRemove={(lang) => trans.onRemove(tKey, lang)}
              onDismissStale={(lang) => trans.onDismissStale(tKey, lang)}
            />
          </div>
        )
      })}
      <AddButton onClick={() => onChange([...paragraphs, ''])} label="+ 단락 추가" />
    </div>
  )
}

/* ── BulletEntry 목록 편집 ───────────────────────────────────────────── */
function BulletListEditor({
  items, onChange, labelName = '라벨', keyPrefix, trans,
}: {
  items: BulletEntry[]
  onChange: (v: BulletEntry[]) => void
  labelName?: string
  keyPrefix?: string
  trans?: TransHelpers
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const tKey = keyPrefix ? `${keyPrefix}.${i}.text` : undefined
        return (
          <div key={i} className="border border-hanji-border/40 rounded-xl bg-background overflow-hidden">
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-sans text-xs text-ink-muted/50">{labelName} #{i + 1}</p>
                <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
              </div>
              <div>
                <FieldLabel>{labelName}</FieldLabel>
                <TextInput value={item.label} onChange={(v) => {
                  const next = cloneDeep(items)
                  next[i].label = v
                  onChange(next)
                }} />
              </div>
              <div>
                <FieldLabel hint="<b>강조</b> 태그 사용 가능">내용</FieldLabel>
                <TextArea value={item.text} onChange={(v) => {
                  const next = cloneDeep(items)
                  next[i].text = v
                  onChange(next)
                }} rows={2} />
              </div>
            </div>
            {tKey && trans && (
              <ResearchTranslationModal
                translationKey={tKey}
                koreanSource={item.text}
                langValues={langVals(trans.translations, tKey)}
                snapshot={trans.snapshots[tKey]}
                onSave={(lang, value, snap) => trans.onSave(tKey, lang, value, snap)}
                onRemove={(lang) => trans.onRemove(tKey, lang)}
                onDismissStale={(lang) => trans.onDismissStale(tKey, lang)}
              />
            )}
          </div>
        )
      })}
      <AddButton onClick={() => onChange([...items, { label: '', text: '' }])} />
    </div>
  )
}

/* ── AchievementEntry 목록 편집 ──────────────────────────────────────── */
function AchievementsEditor({ items, onChange }: { items: AchievementEntry[]; onChange: (v: AchievementEntry[]) => void }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="border border-hanji-border/40 rounded-lg p-3 space-y-3 bg-background">
          <div className="flex justify-between items-center">
            <p className="font-sans text-xs text-ink-muted/50">항목 #{i + 1}</p>
            <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          <div>
            <FieldLabel>제목 (굵게 표시)</FieldLabel>
            <TextInput value={item.title} onChange={(v) => {
              const next = cloneDeep(items)
              next[i].title = v
              onChange(next)
            }} />
          </div>
          <div className="space-y-2">
            <FieldLabel hint="<b>강조</b> 태그 사용 가능. 각 줄이 불릿 항목으로 표시됩니다.">줄 목록</FieldLabel>
            {item.lines.map((line, j) => (
              <div key={j} className="flex gap-2 items-start">
                <div className="flex-1">
                  <TextArea value={line} onChange={(v) => {
                    const next = cloneDeep(items)
                    next[i].lines[j] = v
                    onChange(next)
                  }} rows={2} />
                </div>
                <RemoveButton onClick={() => {
                  const next = cloneDeep(items)
                  next[i].lines = next[i].lines.filter((_, idx) => idx !== j)
                  onChange(next)
                }} />
              </div>
            ))}
            <AddButton onClick={() => {
              const next = cloneDeep(items)
              next[i].lines.push('')
              onChange(next)
            }} label="+ 줄 추가" />
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, { title: '', lines: [''] }])} label="+ 성과 항목 추가" />
    </div>
  )
}

/* ── 연구 방법 표 편집 ──────────────────────────────────────────────── */
function MethodTableEditor({ rows, onChange }: { rows: MethodRow[]; onChange: (v: MethodRow[]) => void }) {
  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={i} className="border border-hanji-border/40 rounded-lg p-3 space-y-3 bg-background">
          <div className="flex justify-between items-center">
            <p className="font-sans text-xs font-semibold text-ink">{row.field || `행 #${i + 1}`}</p>
            <RemoveButton onClick={() => onChange(rows.filter((_, idx) => idx !== i))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>분야</FieldLabel>
              <TextInput value={row.field} onChange={(v) => {
                const next = cloneDeep(rows)
                next[i].field = v
                onChange(next)
              }} />
            </div>
            <div>
              <FieldLabel hint="<b>강조</b> 태그 사용 가능">역할</FieldLabel>
              <TextArea value={row.role} onChange={(v) => {
                const next = cloneDeep(rows)
                next[i].role = v
                onChange(next)
              }} rows={2} />
            </div>
          </div>
          <div>
            <FieldLabel>주요 방법 (한 줄씩)</FieldLabel>
            {row.methods.map((m, j) => (
              <div key={j} className="flex gap-2 items-center mb-1.5">
                <div className="flex-1">
                  <TextInput value={m} onChange={(v) => {
                    const next = cloneDeep(rows)
                    next[i].methods[j] = v
                    onChange(next)
                  }} />
                </div>
                <RemoveButton onClick={() => {
                  const next = cloneDeep(rows)
                  next[i].methods = next[i].methods.filter((_, idx) => idx !== j)
                  onChange(next)
                }} />
              </div>
            ))}
            <AddButton onClick={() => {
              const next = cloneDeep(rows)
              next[i].methods.push('')
              onChange(next)
            }} label="+ 방법 추가" />
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...rows, { field: '', role: '', methods: [''] }])} label="+ 행 추가" />
    </div>
  )
}

/* ── 연구진 표 편집 ─────────────────────────────────────────────────── */
function TeamTableEditor({ rows, onChange }: { rows: TeamRow[]; onChange: (v: TeamRow[]) => void }) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="border border-hanji-border/40 rounded-lg p-3 space-y-2.5 bg-background">
          <div className="flex justify-between items-center">
            <p className="font-sans text-xs font-semibold text-ink">{row.name || `행 #${i + 1}`}</p>
            <RemoveButton onClick={() => onChange(rows.filter((_, idx) => idx !== i))} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {([['role', '구분'], ['name', '성명'], ['affiliation', '소속'], ['field', '전공 분야']] as [keyof TeamRow, string][]).map(([key, label]) => (
              <div key={key}>
                <FieldLabel>{label}</FieldLabel>
                <TextInput value={row[key] ?? ''} onChange={(v) => {
                  const next = cloneDeep(rows)
                  next[i][key] = v
                  onChange(next)
                }} />
              </div>
            ))}
          </div>
          <div>
            <FieldLabel hint="<b>강조</b> 태그 사용 가능">역할</FieldLabel>
            <TextArea value={row.task} onChange={(v) => {
              const next = cloneDeep(rows)
              next[i].task = v
              onChange(next)
            }} rows={2} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...rows, { role: '', name: '', affiliation: '', task: '', field: '' }])} label="+ 연구원 추가" />
    </div>
  )
}

/* ── 과제 정보 표 편집 ──────────────────────────────────────────────── */
function TaskInfoEditor({ rows, onChange }: { rows: TaskInfoRow[]; onChange: (v: TaskInfoRow[]) => void }) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-44 shrink-0">
            <FieldLabel>항목명</FieldLabel>
            <TextInput value={row.label} onChange={(v) => {
              const next = cloneDeep(rows)
              next[i].label = v
              onChange(next)
            }} />
          </div>
          <div className="flex-1">
            <FieldLabel hint="<b>강조</b> 태그 사용 가능">값</FieldLabel>
            <TextArea value={row.value} onChange={(v) => {
              const next = cloneDeep(rows)
              next[i].value = v
              onChange(next)
            }} rows={2} />
          </div>
          <div className="pt-6">
            <RemoveButton onClick={() => onChange(rows.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...rows, { label: '', value: '' }])} label="+ 행 추가" />
    </div>
  )
}

/* ── 저장 버튼 ───────────────────────────────────────────────────────── */
function SaveBar({ dirty, saving, onSave, onReset }: { dirty: boolean; saving: boolean; onSave: () => void; onReset: () => void }) {
  if (!dirty && !saving) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-hanji border border-hanji-border shadow-xl rounded-2xl px-5 py-3">
      <p className="font-sans text-sm text-ink-muted">저장되지 않은 변경사항이 있습니다.</p>
      <button
        onClick={onReset}
        className="font-sans text-sm text-ink-muted/60 hover:text-ink transition-colors"
      >
        되돌리기
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="font-sans text-sm font-medium bg-gold text-white rounded-lg px-4 py-1.5 hover:bg-gold/90 transition-colors disabled:opacity-60"
      >
        {saving ? '저장 중…' : '저장'}
      </button>
    </div>
  )
}

/* ── 메인 페이지 ─────────────────────────────────────────────────────── */
export default function AdminResearchPage() {
  const [original, setOriginal] = useState<ResearchContent | null>(null)
  const [data, setData] = useState<ResearchContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/research-content')
      .then((r) => r.json())
      .then((d: ResearchContent) => {
        setOriginal(cloneDeep(d))
        setData(cloneDeep(d))
      })
      .catch(() => setError('데이터를 불러오지 못했습니다.'))
  }, [])

  const dirty = !!data && JSON.stringify(data) !== JSON.stringify(original)

  const save = useCallback(async () => {
    if (!data) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/research-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('저장 실패')
      setOriginal(cloneDeep(data))
    } catch {
      setError('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }, [data])

  const reset = useCallback(() => {
    if (original) setData(cloneDeep(original))
  }, [original])

  const update = useCallback((patch: Partial<ResearchContent>) => {
    setData((prev) => prev ? { ...prev, ...patch } : prev)
  }, [])

  const updateTrans = useCallback((key: string, lang: string, value: string, koSource: string) => {
    setData((prev) => {
      if (!prev) return prev
      const existing = prev.translations ?? {}
      const langMap = { ...(existing[lang] ?? {}) }
      if (value.trim()) { langMap[key] = value } else { delete langMap[key] }
      const snaps = { ...(prev.translationSnapshots ?? {}), [key]: koSource }
      return { ...prev, translations: { ...existing, [lang]: langMap }, translationSnapshots: snaps }
    })
  }, [])

  const removeTrans = useCallback((key: string, lang: string) => {
    setData((prev) => {
      if (!prev) return prev
      const existing = prev.translations ?? {}
      const langMap = { ...(existing[lang] ?? {}) }
      delete langMap[key]
      return { ...prev, translations: { ...existing, [lang]: langMap } }
    })
  }, [])

  const dismissStale = useCallback((key: string, _lang: string) => {
    setData((prev) => {
      if (!prev) return prev
      const koreanText = (() => {
        if (key.startsWith('motivation.paragraphs.')) {
          const idx = parseInt(key.split('.').pop() ?? '0')
          return prev.motivation.paragraphs[idx] ?? ''
        }
        if (key === 'goals.final') return prev.goals.final
        if (key.startsWith('goals.specific.')) {
          const idx = parseInt(key.split('.')[2])
          return prev.goals.specific[idx]?.text ?? ''
        }
        if (key === 'overview.method.intro') return prev.overview.method.intro
        if (key.startsWith('significance.paragraphs.')) {
          const idx = parseInt(key.split('.').pop() ?? '0')
          return prev.significance.paragraphs[idx] ?? ''
        }
        return ''
      })()
      const snaps = { ...(prev.translationSnapshots ?? {}), [key]: koreanText }
      return { ...prev, translationSnapshots: snaps }
    })
  }, [])


  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-sans text-red-500">{error}</p>
    </div>
  )
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-sans text-sm text-ink-muted">불러오는 중…</p>
    </div>
  )

  const trans: TransHelpers = {
    translations: data.translations ?? {},
    snapshots: data.translationSnapshots ?? {},
    onSave: updateTrans,
    onRemove: removeTrans,
    onDismissStale: dismissStale,
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin" className="font-sans text-sm text-ink-muted/50 hover:text-ink-muted transition-colors">
            ← 대시보드
          </Link>
          <span className="text-ink-muted/30">/</span>
          <p className="font-sans text-sm text-ink-muted">연구 소개 편집</p>
        </div>

        <div>
          <h1 className="font-serif text-2xl text-ink mb-1">연구 소개 편집</h1>
          <p className="font-sans text-xs text-ink-muted/50">
            <span className="font-mono bg-hanji-border/30 px-1 rounded">&lt;b&gt;강조할 텍스트&lt;/b&gt;</span>
            를 입력하면 굵게 표시됩니다.
          </p>
        </div>

        {/* 1. 연구 동기 */}
        <SectionCard title="연구 동기">
          <ParagraphsEditor
            paragraphs={data.motivation.paragraphs}
            onChange={(v) => update({ motivation: { paragraphs: v } })}
            keyPrefix="motivation.paragraphs"
            trans={trans}
          />
        </SectionCard>

        {/* 2. 연구 목표 */}
        <SectionCard title="연구 목표">
          <div className="space-y-6">
            <div>
              <FieldLabel hint="<b>강조</b> 태그 사용 가능">최종 목표</FieldLabel>
              <div className="border border-hanji-border/40 rounded-xl bg-background overflow-hidden">
                <div className="p-3">
                  <TextArea
                    value={data.goals.final}
                    onChange={(v) => update({ goals: { ...data.goals, final: v } })}
                    rows={3}
                  />
                </div>
                <ResearchTranslationModal
                  translationKey="goals.final"
                  koreanSource={data.goals.final}
                  langValues={langVals(trans.translations, 'goals.final')}
                  snapshot={trans.snapshots['goals.final']}
                  onSave={(lang, value, snap) => trans.onSave('goals.final', lang, value, snap)}
                  onRemove={(lang) => trans.onRemove('goals.final', lang)}
                  onDismissStale={(lang) => trans.onDismissStale('goals.final', lang)}
                />
              </div>
            </div>
            <div>
              <p className="font-sans text-xs font-medium text-ink-muted/60 uppercase tracking-wide mb-3">세부 목표</p>
              <BulletListEditor
                items={data.goals.specific}
                onChange={(v) => update({ goals: { ...data.goals, specific: v } })}
                labelName="목표명"
                keyPrefix="goals.specific"
                trans={trans}
              />
            </div>
          </div>
        </SectionCard>

        {/* 3. 연구 개요 — 연구 방법 */}
        <SectionCard title="연구 개요 — 연구 방법">
          <div className="space-y-4">
            <div>
              <FieldLabel>소개 문장</FieldLabel>
              <div className="border border-hanji-border/40 rounded-xl bg-background overflow-hidden">
                <div className="p-3">
                  <TextArea
                    value={data.overview.method.intro}
                    onChange={(v) => update({ overview: { ...data.overview, method: { ...data.overview.method, intro: v } } })}
                    rows={2}
                  />
                </div>
                <ResearchTranslationModal
                  translationKey="overview.method.intro"
                  koreanSource={data.overview.method.intro}
                  langValues={langVals(trans.translations, 'overview.method.intro')}
                  snapshot={trans.snapshots['overview.method.intro']}
                  onSave={(lang, value, snap) => trans.onSave('overview.method.intro', lang, value, snap)}
                  onRemove={(lang) => trans.onRemove('overview.method.intro', lang)}
                  onDismissStale={(lang) => trans.onDismissStale('overview.method.intro', lang)}
                />
              </div>
            </div>
            <p className="font-sans text-xs font-medium text-ink-muted/60 uppercase tracking-wide">표 행</p>
            <MethodTableEditor
              rows={data.overview.method.rows}
              onChange={(v) => update({ overview: { ...data.overview, method: { ...data.overview.method, rows: v } } })}
            />
          </div>
        </SectionCard>

        {/* 4. 연구 개요 — 연구 규모 */}
        <SectionCard title="연구 개요 — 연구 규모">
          <BulletListEditor
            items={data.overview.scale}
            onChange={(v) => update({ overview: { ...data.overview, scale: v } })}
            labelName="항목명"
          />
        </SectionCard>

        {/* 5. 연구 개요 — 주요 성과 */}
        <SectionCard title="연구 개요 — 주요 성과: 모음 체계">
          <AchievementsEditor
            items={data.overview.achievements.vowels}
            onChange={(v) => update({ overview: { ...data.overview, achievements: { ...data.overview.achievements, vowels: v } } })}
          />
        </SectionCard>

        <SectionCard title="연구 개요 — 주요 성과: 자음 체계">
          <AchievementsEditor
            items={data.overview.achievements.consonants}
            onChange={(v) => update({ overview: { ...data.overview, achievements: { ...data.overview.achievements, consonants: v } } })}
          />
        </SectionCard>

        <SectionCard title="연구 개요 — 주요 성과: 기술 개발">
          <AchievementsEditor
            items={data.overview.achievements.tech}
            onChange={(v) => update({ overview: { ...data.overview, achievements: { ...data.overview.achievements, tech: v } } })}
          />
        </SectionCard>

        {/* 6. 연구의 의의 */}
        <SectionCard title="연구의 의의">
          <ParagraphsEditor
            paragraphs={data.significance.paragraphs}
            onChange={(v) => update({ significance: { paragraphs: v } })}
            keyPrefix="significance.paragraphs"
            trans={trans}
          />
        </SectionCard>

        {/* 7. 연구진 소개 */}
        <SectionCard title="연구진 소개">
          <TeamTableEditor
            rows={data.team.rows}
            onChange={(v) => update({ team: { rows: v } })}
          />
        </SectionCard>

        {/* 8. 과제 정보 */}
        <SectionCard title="과제 정보">
          <TaskInfoEditor
            rows={data.taskInfo.rows}
            onChange={(v) => update({ taskInfo: { rows: v } })}
          />
        </SectionCard>

        <div className="h-20" />
      </main>

      <AdminFooter />
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />
    </div>
  )
}