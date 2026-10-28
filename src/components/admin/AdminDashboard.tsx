'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { AdminFooter } from '@/components/admin/AdminFooter'

/* ── 관리 섹션 목록 ──────────────────────────────────────────────────────── */
type AdminSection = {
  id: string
  href: string
  title: string
  en: string
  desc: string
  ready: boolean
}

const MAIN_SECTION: AdminSection = {
  id: 'home',
  href: '/admin/content/home',
  title: '메인 페이지',
  en: 'Main',
  desc: '메인 페이지의 문구와 번역을 확인하고 편집합니다.',
  ready: true,
}

const SECTIONS: AdminSection[] = [
  {
    id: 'consonants',
    href: '/admin/content/consonants',
    title: '자음',
    en: 'Consonants',
    desc: '자음의 설명과 번역을 확인하고 편집합니다.',
    ready: true,
  },
  {
    id: 'vowels',
    href: '/admin/content/vowels',
    title: '모음',
    en: 'Vowels',
    desc: '모음의 설명과 번역을 확인하고 편집합니다.',
    ready: true,
  },
  {
    id: 'hunminjeongeum',
    href: '/admin/content/hunminjeongeum',
    title: '훈민정음',
    en: 'Hunminjeongeum',
    desc: '훈민정음 해례본 28자 제자 원리·정인지서 단락을 확인하고 편집합니다.',
    ready: true,
  },
  {
    id: 'research',
    href: '/admin/content/research',
    title: '연구 소개',
    en: 'Research',
    desc: '연구진, 과제 정보를 확인하고 편집합니다.',
    ready: true,
  },
]

/* ── 개발자 문의 폼 ──────────────────────────────────────────────────────── */
function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (idx: number) =>
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))

  const [error, setError] = useState<string | null>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSent(false)
    setError(null)
    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('subject', subject)
    fd.append('body', body)
    attachedFiles.forEach((f) => fd.append('attachments', f))
    try {
      const res = await fetch('/api/admin/contact', { method: 'POST', body: fd })
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string }
      if (data.ok) {
        setSent(true)
        setName(''); setEmail(''); setSubject(''); setBody(''); setAttachedFiles([])
        setTimeout(() => setSent(false), 6000)
      } else if (data.error === 'SMTP_NOT_CONFIGURED') {
        setError('SMTP 설정이 필요합니다. .env.local에 SMTP_USER와 SMTP_PASS를 입력해주세요.')
      } else {
        setError(data.message ?? '전송 중 오류가 발생했습니다.')
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    }
  }

  const inputClass =
    'w-full rounded-sm border border-hanji-border bg-hanji px-3 py-2.5 font-sans text-sm text-ink outline-none transition-[border-color,box-shadow] focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.3)] placeholder:text-ink-muted/40'

  return (
    <form ref={formRef} onSubmit={handleSend} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-normal text-ink-muted">
            이름
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="홍길동"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-normal text-ink-muted">
            답장 받을 이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@email.com"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-normal text-ink-muted">
          제목
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder="문의 제목을 입력하세요"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-normal text-ink-muted">
          내용
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          placeholder="문의 내용을 입력하세요"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* ── 이미지 첨부 ── */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-sm border border-hanji-border/70 px-3 py-1.5 font-sans text-[11px] text-ink-muted transition-colors hover:border-gold/40 hover:text-ink-soft"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
          이미지 첨부
        </button>
        {attachedFiles.length > 0 && (
          <ul className="mt-2 space-y-1">
            {attachedFiles.map((f, i) => (
              <li key={i} className="flex items-center gap-2 font-sans text-[11px] text-ink-muted/70">
                <span className="truncate max-w-xs">{f.name}</span>
                <span className="text-ink-muted/40 text-[10px]">
                  ({(f.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-ink-muted/40 hover:text-ink-accent transition-colors"
                  aria-label="파일 제거"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        {attachedFiles.length > 0 && (
          <p className="mt-2 font-sans text-[10px] text-ink-muted/50 leading-snug">
            파일 목록은 메일 본문에 포함됩니다. 메일 앱에서 직접 첨부 후 전송해주세요.
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-sm border border-red-300/50 bg-red-50/60 px-3 py-2 font-sans text-[11px] text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="flex items-center justify-end pt-1">
        <button
          type="submit"
          className="rounded-sm border border-hanji-border px-5 py-2 font-sans text-[11px] uppercase tracking-normal text-ink-muted transition-colors hover:border-gold/50 hover:text-gold dark:hover:text-gold-light disabled:opacity-50"
        >
          {sent ? '전송 완료 ✓' : '보내기'}
        </button>
      </div>
    </form>
  )
}

function SectionCard({ section, className }: { section: AdminSection; className?: string }) {
  const body = (
    <>
      <div className="flex-1">
        <div className="mb-1.5 flex items-baseline gap-2">
          <span className={`font-serif text-lg ${section.ready ? 'text-ink group-hover:text-ink-accent' : 'text-ink'} transition-colors`}>
            {section.title}
          </span>
          <span className="font-sans text-[10.5px] uppercase tracking-wider text-ink-muted/60">
            {section.en}
          </span>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted/80">
          {section.desc}
        </p>
      </div>
      {section.ready ? (
        <div className="flex items-center gap-1.5 text-gold">
          <span className="font-sans text-[11px] tracking-[0.06em]">편집하기</span>
          <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
        </div>
      ) : null}
    </>
  )

  const box = `flex h-full flex-col gap-4 bg-hanji p-7 sm:p-8 ${className ?? ''}`

  if (!section.ready) {
    return <div className={box}>{body}</div>
  }

  return (
    <Link href={section.href} className={`group ${box} transition-colors hover:bg-hanji-warm`}>
      {body}
    </Link>
  )
}

export function AdminDashboard({ username }: { username: string | null }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const logout = async () => {
    setBusy(true)
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-10 sm:py-16">
        {/* ── 헤더 ────────────────────────────────────────────────── */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-hanji-border pb-8">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-normal text-ink-muted">
              관리자 대시보드
            </p>
            <h1 className="mt-2 font-serif text-2xl tracking-normal text-ink sm:text-[1.85rem]">
              세종말소리
            </h1>
            {username && (
              <p className="mt-4 font-sans text-sm text-ink-muted/70">
                안녕하세요,{' '}
                <span className="text-ink-soft font-medium">{username}</span>님.
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={logout}
            className="font-sans text-[11px] uppercase tracking-normal text-ink-muted/70 transition-colors hover:text-ink-accent dark:hover:text-gold-light disabled:pointer-events-none"
          >
            {busy ? '로그아웃 중…' : '로그아웃'}
          </button>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-px bg-hanji-border sm:grid-cols-2">
          <div className="sm:col-span-2">
            <SectionCard section={MAIN_SECTION} />
          </div>
          {SECTIONS.map((section) => (
            <div key={section.id}>
              <SectionCard section={section} />
            </div>
          ))}
        </div>

        <div className="mt-10 border border-hanji-border bg-hanji p-7 sm:p-8">
          <h2 className="mb-1 font-sans text-base font-medium tracking-normal text-ink">
            개발자에게 문의하기
          </h2>
          <p className="mb-6 font-sans text-xs text-ink-muted/50">
            사이트 오류, 기능 요청, 수정 사항 등을 전달할 수 있습니다.
          </p>
          <ContactForm />
        </div>
      </div>
      <AdminFooter />
    </>
  )
}
