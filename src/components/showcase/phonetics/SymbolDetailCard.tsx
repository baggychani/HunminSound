'use client'

import type { ReactNode } from 'react'

interface SymbolDetailCardProps {
  symbol: string
  symbolFontClass: string
  /** 이름·조음 정보 등 헤더 우측 내용 */
  header: ReactNode
  /** 설명 + 영상 등 본문 */
  children: ReactNode
}

/**
 * 자음·모음 상세 패널 — 클릭한 글자의 "프로필 카드".
 * 한지 결 표면 + 심볼 타일 + 등장 애니메이션.
 */
export function SymbolDetailCard({ symbol, symbolFontClass, header, children }: SymbolDetailCardProps) {
  return (
    <div className="detail-pop phonetics-detail-panel relative mt-5 rounded-[3px] border border-hanji-border/90 p-4 shadow-[0_2px_10px_rgb(var(--ink-rgb)/0.05),0_18px_44px_-24px_rgb(var(--ink-rgb)/0.16)] sm:p-5">
      {/* 헤더 — 심볼 타일과 이름 사이에 짧은 금선으로 간격을 둔다 */}
      <div className="flex items-center">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] border border-[#c9a962]/60 bg-white shadow-[0_1px_6px_rgb(var(--ink-rgb)/0.06)] sm:h-[3.25rem] sm:w-[3.25rem]">
          <span className={`${symbolFontClass} text-[1.65rem] leading-none text-[#1c1917] sm:text-[1.85rem]`}>
            {symbol}
          </span>
        </div>
        <span aria-hidden className="mx-5 h-8 w-px shrink-0 bg-[#c9a962]/45 sm:mx-6" />
        <div className="min-w-0 flex-1">{header}</div>
      </div>

      {/* 금실 구분선 */}
      <div
        aria-hidden
        className="mt-3.5 h-px w-full bg-gradient-to-r from-gold/50 via-hanji-border to-transparent sm:mt-4"
      />

      <div className="mt-4 sm:mt-5">{children}</div>
    </div>
  )
}
