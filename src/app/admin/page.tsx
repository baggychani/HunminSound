'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { AdminFooter } from '@/components/admin/AdminFooter'

/* ── 관리 섹션 목록 ──────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: 'consonants',
    href: '/admin/content/consonants',
    glyph: 'ㄱ',
    title: '자음',
    en: 'Consonants',
    desc: '19개 자음의 설명 텍스트, 분류, 영상 파일명을 확인하고 편집합니다.',
    meta: '19개 항목',
    ready: true,
  },
  {
    id: 'vowels',
    href: '/admin/content/vowels',
    glyph: 'ㅏ',
    title: '모음',
    en: 'Vowels',
    desc: '21개 모음의 설명 텍스트, 분류, 애니메이션·MRI 파일명을 확인하고 편집합니다.',
    meta: '21개 항목',
    ready: true,
  },
  {
    id: 'home',
    href: '/admin/content/home',
    glyph: '主',
    title: '홈 페이지',
    en: 'Home',
    desc: '히어로 문구, 섹션 설명, 카드 내용 등 홈 화면의 텍스트를 관리합니다.',
    meta: '',
    ready: false,
  },
  {
    id: 'hunminjeongeum',
    href: '/admin/content/hunminjeongeum',
    glyph: '訓',
    title: '훈민정음',
    en: 'Hunminjeongeum',
    desc: '훈민정음 제자 원리 페이지의 각 섹션 내용을 관리합니다.',
    meta: '4개 섹션',
    ready: false,
  },
  {
    id: 'research',
    href: '/admin/content/research',
    glyph: '研',
    title: '연구 소개',
    en: 'Research',
    desc: '연구진 소개, 연구 목적과 의의, NRF 과제 정보를 관리합니다.',
    meta: '3개 섹션',
    ready: false,
  },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
}

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
          <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-[0.08em] text-ink-muted">
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
          <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-[0.08em] text-ink-muted">
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
        <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-[0.08em] text-ink-muted">
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
        <label className="mb-1.5 block font-sans text-[10.5px] uppercase tracking-[0.08em] text-ink-muted">
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
          className="rounded-sm border border-hanji-border px-5 py-2 font-sans text-[11px] uppercase tracking-[0.08em] text-ink-muted transition-colors hover:border-gold/50 hover:text-gold dark:hover:text-gold-light disabled:opacity-50"
        >
          {sent ? '전송 완료 ✓' : '보내기'}
        </button>
      </div>
    </form>
  )
}

function useAdminUsername() {
  const [username, setUsername] = useState<string | null>(null)
  useEffect(() => {
    fetch('/api/auth/admin/me')
      .then((r) => r.json())
      .then((d) => { if (d.username) setUsername(d.username as string) })
      .catch(() => {})
  }, [])
  return username
}

export default function AdminHomePage() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const username = useAdminUsername()

  const logout = async () => {
    setBusy(true)
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  const readySections = SECTIONS.filter((s) => s.ready)
  const pendingSections = SECTIONS.filter((s) => !s.ready)

  return (
    <>
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-10 sm:py-16">
        {/* ── 헤더 ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-hanji-border pb-8"
        >
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted">
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
            className="font-sans text-[11px] uppercase tracking-[0.08em] text-ink-muted/70 transition-colors hover:text-ink-accent dark:hover:text-gold-light disabled:pointer-events-none"
          >
            {busy ? '로그아웃 중…' : '로그아웃'}
          </button>
        </motion.div>

        {/* ── 편집 가능 섹션 ──────────────────────────────────────── */}
        <div className="mb-12">
          <p className="mb-5 font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted">
            편집 가능
          </p>
          <div className="grid grid-cols-1 gap-px bg-hanji-border sm:grid-cols-2">
            {readySections.map((s, i) => (
              <motion.div
                key={s.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
              >
                <Link
                  href={s.href}
                  className="group flex h-full flex-col gap-4 bg-hanji p-7 transition-colors hover:bg-hanji-warm sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-3xl leading-none text-ink-muted/40 group-hover:text-ink-muted/60 transition-colors select-none" lang="ko">
                      {s.glyph}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-[0.08em] text-gold/80 dark:text-gold-light/70">
                      {s.meta}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="font-serif text-lg text-ink group-hover:text-ink-accent transition-colors">
                        {s.title}
                      </span>
                      <span className="font-sans text-[10.5px] text-ink-muted/60 uppercase tracking-wider">
                        {s.en}
                      </span>
                    </div>
                    <p className="font-sans text-xs leading-relaxed text-ink-muted/80">
                      {s.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gold">
                    <span className="font-sans text-[11px] tracking-[0.06em]">편집하기</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 준비 중 섹션 ────────────────────────────────────────── */}
        <div>
          <p className="mb-5 font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted/60">
            준비 중
          </p>
          <div className="grid grid-cols-1 gap-px bg-hanji-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {pendingSections.map((s, i) => (
              <motion.div
                key={s.id}
                custom={readySections.length + i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
              >
                <div className="flex h-full flex-col gap-4 bg-hanji p-7 opacity-50 sm:p-8">
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-3xl leading-none text-ink-muted/30 select-none">
                      {s.glyph}
                    </span>
                    {s.meta ? (
                      <span className="font-sans text-[10px] uppercase tracking-[0.08em] text-ink-muted/50">
                        {s.meta}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="font-serif text-lg text-ink-muted">{s.title}</span>
                      <span className="font-sans text-[10.5px] text-ink-muted/50 uppercase tracking-wider">
                        {s.en}
                      </span>
                    </div>
                    <p className="font-sans text-xs leading-relaxed text-ink-muted/60">
                      {s.desc}
                    </p>
                  </div>
                  <span className="font-sans text-[11px] text-ink-muted/40 tracking-[0.06em]">
                    준비 중
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 개발자 문의 ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-16 border-t border-hanji-border pt-10"
        >
          <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted/60">
            개발자에게 문의하기
          </p>
          <p className="mb-6 font-sans text-xs text-ink-muted/50">
            사이트 오류, 기능 요청, 수정 사항 등을 전달할 수 있습니다.
          </p>
          <ContactForm />
        </motion.div>
      </div>
      <AdminFooter />
    </>
  )
}
