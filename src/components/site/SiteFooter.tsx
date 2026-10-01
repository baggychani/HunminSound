'use client'

import { useLang } from '@/contexts/LanguageContext'
import { SITE_BRAND_NAME } from '@/lib/i18n'
import { getV2Messages } from '@/lib/v2-i18n'

export function SiteFooter() {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)

  return (
    <footer className="border-t border-white/10 bg-v2-contact py-10 text-white/70">
      <div className="v2-section-inner grid gap-6 sm:grid-cols-3 sm:items-center">
        <div>
          <p className="font-jamo text-lg text-white" lang="ko">{SITE_BRAND_NAME}</p>
          <p className="mt-1 text-sm">{v2.footerNrf}</p>
          <p className="mt-1 text-xs text-white/50">NRF-2023S1A5A2A21086078</p>
        </div>
        <p className="text-center text-sm sm:justify-self-center">
          서울대학교 · MRI 음성 연구
        </p>
        {/* 공개 꼬리말에는 관리자 링크를 노출하지 않음(A8) — 직접 주소로 접근 */}
        <div className="flex justify-center sm:justify-end" aria-hidden />
      </div>
    </footer>
  )
}
