'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { describeAction, type HistoryEntry } from '@/lib/admin-history'

type NoticeLevel = 'info' | 'warning'

export type AdminNotice = {
  id: string
  level: NoticeLevel
  title: string
  detail: string
}

const STORAGE_PREFIX = 'hunmin-admin-notif-dismissed:'

export function AdminTopBar({ sanityProjectIdConfigured }: { sanityProjectIdConfigured: boolean }) {
  const notifications = useMemo(
    (): AdminNotice[] => [
      {
        id: 'admin-shell',
        level: 'info',
        title: '관리자 화면은 단계적으로 채워집니다.',
        detail:
          '로그인과 이 알림은 동작합니다. 페이지 문장 편집·영상 올리기 UI는 순서대로 붙입니다. 오류 나면 프로젝트 폴더에서 .next 삭제 후 `npm run dev` 다시 켜 보세요.',
      },
      ...(sanityProjectIdConfigured
        ? []
        : [
            {
              id: 'sanity-id-empty',
              level: 'warning' as const,
              title: 'Sanity「프로젝트 번호」가 비어 있습니다.',
              detail:
                '웹만 볼 때는 그대로 둬도 됩니다. CMS에 저장하려면 가입 후 받은 번호를 이 파일 안의 SANITY 줄에 적으면 됩니다.',
            },
          ]),
    ],
    [sanityProjectIdConfigured],
  )

  const ids = notifications.map((n) => n.id)
  const [dismissTick, setDismissTick] = useState(0)
  const dismissed = useMemo(() => readDismissed(ids), [ids.join('|'), dismissTick])
  const shown = notifications.filter((n) => !dismissed.has(n.id))
  const unreadCount = shown.length

  /* ── 알림 패널 ── */
  const [notifOpen, setNotifOpen] = useState(false)
  const notifPanelRef = useRef<HTMLDivElement>(null)
  const notifBtnRef = useRef<HTMLButtonElement>(null)

  /* ── 히스토리 패널 ── */
  const [histOpen, setHistOpen] = useState(false)
  const histPanelRef = useRef<HTMLDivElement>(null)
  const histBtnRef = useRef<HTMLButtonElement>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [histLoading, setHistLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchHistory = () => {
    setHistLoading(true)
    fetch('/api/admin/history')
      .then((r) => r.json())
      .then((data) => setHistory(data as HistoryEntry[]))
      .catch(() => {})
      .finally(() => setHistLoading(false))
  }

  const toggleHist = () => {
    setNotifOpen(false)
    if (!histOpen) fetchHistory()
    setHistOpen((v) => !v)
  }

  /* ── 외부 클릭 닫기 ── */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node
      if (notifOpen && !notifPanelRef.current?.contains(t) && !notifBtnRef.current?.contains(t)) {
        setNotifOpen(false)
      }
      if (histOpen && !histPanelRef.current?.contains(t) && !histBtnRef.current?.contains(t)) {
        setHistOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') { setNotifOpen(false); setHistOpen(false) }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [notifOpen, histOpen])

  const dismissOne = (id: string) => {
    try { sessionStorage.setItem(STORAGE_PREFIX + id, '1') } catch { /* ignore */ }
    setDismissTick((x) => x + 1)
  }
  const clearDismissed = () => {
    ids.forEach((id) => { try { sessionStorage.removeItem(STORAGE_PREFIX + id) } catch { /* ignore */ } })
    setDismissTick((x) => x + 1)
  }

  return (
    <>
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 font-sans text-[11px] text-ink-muted/90 transition-colors hover:text-gold sm:left-6 sm:top-5 sm:text-xs"
      >
        ← 사이트로
      </Link>

      <div className="fixed right-4 top-4 z-50 flex items-center gap-1 sm:right-6 sm:top-5">

        {/* ── 히스토리 아이콘 ── */}
        <div className="relative flex items-center">
          <button
            ref={histBtnRef}
            type="button"
            onClick={toggleHist}
            aria-expanded={histOpen}
            aria-label={histOpen ? '내역 닫기' : '수정 내역'}
            className="relative flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-hanji-border/40 hover:text-ink dark:text-ink-muted dark:hover:bg-hanji-border/35 dark:hover:text-ink"
          >
            <HistoryIcon />
          </button>

          {histOpen && (
            <div
              ref={histPanelRef}
              role="dialog"
              aria-label="수정 내역"
              className="absolute right-0 top-[calc(100%+6px)] z-[60] w-[min(calc(100vw-32px),420px)] rounded-sm border border-hanji-border bg-hanji-warm shadow-lg dark:shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)]"
            >
              <div className="flex items-center justify-between border-b border-hanji-border px-4 py-2.5">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                  수정 내역
                </span>
                <button
                  type="button"
                  onClick={fetchHistory}
                  className="font-sans text-[11px] text-ink-accent underline underline-offset-2 hover:text-gold dark:text-gold-light"
                >
                  새로고침
                </button>
              </div>

              <ul className="max-h-[min(75vh,26rem)] divide-y divide-hanji-border/70 overflow-y-auto">
                {histLoading ? (
                  <li className="px-4 py-8 text-center font-sans text-xs text-ink-muted/50">불러오는 중…</li>
                ) : history.length === 0 ? (
                  <li className="px-4 py-8 text-center font-sans text-xs text-ink-muted/40">
                    아직 수정 내역이 없습니다.
                  </li>
                ) : (
                  history.map((entry) => {
                    const isExpanded = expandedId === entry.id
                    const d = new Date(entry.timestamp)
                    const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-hanji-border/20 transition-colors"
                          onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-sans text-xs font-medium leading-snug text-ink-soft">
                                관리자 <span className="text-ink">{entry.username}</span>님이 수정했습니다.
                              </p>
                              <p className="mt-0.5 font-sans text-[11px] leading-snug text-ink-muted/70">
                                {describeAction(entry)}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              <span className="font-sans text-[10px] text-ink-muted/40 whitespace-nowrap">
                                {dateStr}
                              </span>
                              <svg
                                width="10" height="10" viewBox="0 0 10 10"
                                className={`transition-transform text-ink-muted/40 ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                aria-hidden
                              >
                                <path d="M2 4l3 3 3-3" />
                              </svg>
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-hanji-border/40 bg-hanji-warm/40 px-4 py-3 dark:bg-hanji-warm/15">
                            <div className="space-y-2">
                              {entry.action === 'save' && (
                                <>
                                  <DetailRow label="이전">
                                    {entry.oldValue ?? <span className="italic text-ink-muted/40">오버라이드 없음</span>}
                                  </DetailRow>
                                  <DetailRow label="저장">
                                    <span className="text-emerald-600 dark:text-emerald-400">{entry.newValue ?? '—'}</span>
                                  </DetailRow>
                                </>
                              )}
                              {entry.action === 'remove' && (
                                <DetailRow label="삭제된 번역">
                                  <span className="line-through text-ink-muted/60">{entry.oldValue ?? '—'}</span>
                                </DetailRow>
                              )}
                              {entry.action === 'dismiss' && (
                                <DetailRow label="처리">원본이 바뀌었지만 번역을 수정하지 않아도 된다고 확인했습니다.</DetailRow>
                              )}
                              <DetailRow label="키">
                                <code className="rounded bg-hanji-border/40 px-1 text-[10px]">{entry.key}</code>
                              </DetailRow>
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  })
                )}
              </ul>

              <div className="border-t border-hanji-border px-4 py-2 text-center font-sans text-[10px] leading-snug text-ink-muted/60">
                최근 {history.length}건 표시 (최대 100건 유지)
              </div>
            </div>
          )}
        </div>

        {/* ── 알림 아이콘 ── */}
        <div className="relative flex items-center">
          <button
            ref={notifBtnRef}
            type="button"
            onClick={() => { setHistOpen(false); setNotifOpen((o) => !o) }}
            aria-expanded={notifOpen}
            aria-haspopup="dialog"
            className="relative flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-hanji-border/40 hover:text-ink dark:text-ink-muted dark:hover:bg-hanji-border/35 dark:hover:text-ink"
            aria-label={notifOpen ? '알림 닫기' : '알림 열기'}
          >
            <BellIcon />
            {unreadCount > 0 ? (
              <span className="absolute right-1 top-1 flex h-[7px] w-[7px] rounded-full bg-gold ring-2 ring-hanji dark:bg-gold-light dark:ring-hanji" />
            ) : null}
          </button>

          {notifOpen ? (
            <div
              ref={notifPanelRef}
              role="dialog"
              aria-label="관리 알림"
              className="absolute right-0 top-[calc(100%+6px)] z-[60] w-[min(calc(100vw-32px),380px)] rounded-sm border border-hanji-border bg-hanji-warm shadow-lg dark:bg-hanji-warm dark:shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)]"
            >
              <div className="flex items-center justify-between border-b border-hanji-border px-4 py-2.5">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                  알림
                </span>
                <button
                  type="button"
                  className="font-sans text-[11px] text-ink-accent underline underline-offset-2 hover:text-gold dark:text-gold-light"
                  onClick={() => clearDismissed()}
                >
                  가리기 초기화
                </button>
              </div>
              <ul className="max-h-[min(70vh,21rem)] divide-y divide-hanji-border/80 overflow-y-auto">
                {shown.length === 0 ? (
                  <li className="px-4 py-8 text-center font-sans text-xs leading-relaxed text-ink-muted">
                    새 알림이 없습니다.
                  </li>
                ) : (
                  shown.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <div className="flex gap-3">
                        <span
                          className={
                            n.level === 'warning'
                              ? 'mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ink-accent dark:bg-gold-light'
                              : 'mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gold/80 dark:bg-gold-light/75'
                          }
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-xs font-medium leading-snug text-ink-soft">{n.title}</p>
                          <p className="mt-1 font-sans text-[11px] leading-relaxed text-ink-muted">{n.detail}</p>
                          <button
                            type="button"
                            className="mt-2 font-sans text-[10px] uppercase tracking-wider text-ink-muted/40 underline-offset-2 hover:text-ink-accent hover:underline dark:hover:text-gold-light"
                            onClick={() => dismissOne(n.id)}
                          >
                            가리기
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="border-t border-hanji-border px-4 py-2 text-center font-sans text-[10px] leading-snug text-ink-muted/90">
                브라우저 이 컴퓨터 안에만「가린 항목」이 저장됩니다.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

/* ── 인라인 헬퍼 ─────────────────────────────────────────────────────────── */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-2 text-xs">
      <span className="font-sans text-[10.5px] text-ink-muted/50">{label}</span>
      <span className="font-sans text-[11px] leading-relaxed text-ink-soft break-words">{children}</span>
    </div>
  )
}

function readDismissed(ids: string[]): Set<string> {
  const next = new Set<string>()
  if (typeof window === 'undefined') return next
  for (const id of ids) {
    try { if (sessionStorage.getItem(STORAGE_PREFIX + id)) next.add(id) } catch { /* ignore */ }
  }
  return next
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="-translate-y-px opacity-95">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-90">
      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.05 11a9 9 0 1 0 .5-3M3 4v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
