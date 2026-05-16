'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'

function LoginInner() {
  const searchParams = useSearchParams()
  const rawFrom = searchParams.get('from') ?? ''
  const from = useMemo(() => {
    if (!rawFrom.startsWith('/admin')) return ''
    try {
      return decodeURIComponent(rawFrom)
    } catch {
      return ''
    }
  }, [rawFrom])
  const errorKey = searchParams.get('error')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(() => {
    if (errorKey === 'config') return '관리자 로그인이 아직 설정되지 않았습니다. 서버 설정(환경 변수)을 확인해 주세요.'
    return null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json()) as { ok?: boolean; message?: string }

      if (!res.ok) {
        if (data.message === 'not_configured') {
          setMsg('환경 변수에 관리자 계정과 세션 비밀키가 필요합니다.')
        } else {
          setMsg('아이디 또는 비밀번호가 올바르지 않습니다.')
        }
        setSubmitting(false)
        return
      }

      window.location.href = from || '/admin'
    } catch {
      setMsg('잠시 후 다시 시도해 주세요.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center px-5 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[0.07] dark:opacity-[0.12]">
        <div className="absolute left-1/2 top-[12%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gold blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[400px]"
      >
        <div className="mb-10 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.12em] text-ink-muted/90 dark:text-gold-light/80">관리자</p>
          <h1 className="font-serif text-3xl tracking-normal text-ink sm:text-[2rem]">세종말소리</h1>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted/85 dark:text-ink-muted/90">
            승인된 관리자만 들어올 수 있는 공간입니다.
          </p>
        </div>

        <div className="rounded-sm border border-hanji-border bg-hanji-warm/85 px-6 py-9 shadow-[0_24px_60px_-32px_rgb(28_25_23/0.28)] backdrop-blur-sm dark:bg-hanji-warm/50 dark:shadow-none sm:px-8 sm:py-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label htmlFor="admin-user" className="block font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                관리자 ID
              </label>
              <input
                id="admin-user"
                autoComplete="username"
                spellCheck={false}
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className="w-full rounded-sm border border-hanji-border bg-hanji px-3 py-3 font-sans text-sm text-ink outline-none ring-0 transition-[border-color,box-shadow] focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.35)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-pass" className="block font-sans text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                비밀번호
              </label>
              <input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full rounded-sm border border-hanji-border bg-hanji px-3 py-3 font-sans text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted/60 focus-visible:border-gold/70 focus-visible:shadow-[inset_0_0_0_1px_rgb(var(--gold-rgb)/0.35)]"
              />
            </div>

            {msg ? (
              <p className="font-sans text-xs leading-relaxed text-ink-accent" role="alert">
                {msg}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-sm bg-ink py-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-hanji transition-opacity hover:opacity-[0.92] disabled:pointer-events-none disabled:opacity-50 dark:bg-gold dark:text-stone-900"
            >
              {submitting ? '확인 중…' : '로그인'}
            </button>
          </form>
        </div>

        <p className="mx-auto mt-10 max-w-sm text-center font-sans text-[11px] leading-relaxed text-ink-muted/90">
          계정 문제는 설정 담당자에게 문의하세요.{' '}
          <Link href="/" className="underline decoration-hanji-border underline-offset-[5px] transition-colors hover:text-gold hover:decoration-gold/50">
            홈으로
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col justify-center px-5 pt-28">
          <p className="text-center font-sans text-sm text-ink-muted">불러오는 중…</p>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  )
}
