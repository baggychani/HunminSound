'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useLang } from '@/contexts/LanguageContext'
import { getPrivacyMessages } from '@/lib/privacy-i18n'

export function SiteFooter() {
  const { lang } = useLang()
  const pm = getPrivacyMessages(lang)

  return (
    <footer className="relative z-10 mt-12 border-t border-hanji-border bg-hanji">
      <div className="site-container py-8">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-x-4 sm:items-center">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-baseline sm:gap-5 sm:justify-self-start">
            <span className="shrink-0 font-serif text-sm text-ink-muted">세종말소리 · Sejong Speech Sounds</span>
            {/* 개인정보 처리방침은 다른 링크와 구분되게 굵게(개인정보 보호법 시행령 제31조) */}
            <Link
              href="/privacy"
              className="font-sans text-[12px] font-bold text-ink-soft transition-colors hover:text-gold"
            >
              {pm.policyLink}
            </Link>
          </div>
          <div className="flex shrink-0 justify-center sm:justify-self-end">
            <ThemeToggle />
          </div>
        </div>
        {/* B18: 저작권·지원기관·주관기관·갱신일 — 공공 누리집 필수 고지 */}
        <div className="mt-6 border-t border-hanji-border/50 pt-5 font-sans text-[11.5px] leading-[1.8] text-ink-muted">
          <p className="break-keep">
            © 2026 세종국어문화원 · 한국연구재단 글로벌인문사회융합연구지원사업(연구그룹형) 지원
            (NRF-2023S1A5A2A21086078)
          </p>
          <p className="break-keep">
            주관: 세종국어문화원 · 협력: (사)세종대왕기념사업회 · 최종 갱신일: 2026년 10월 1일
          </p>
        </div>
      </div>
    </footer>
  )
}
