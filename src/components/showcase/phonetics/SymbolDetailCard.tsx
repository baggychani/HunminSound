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
 * 한지 결 표면 + 코너 브래킷 + 심볼 타일(금빛 헤일로) + 등장 애니메이션.
 */
export function SymbolDetailCard({ symbol, symbolFontClass, header, children }: SymbolDetailCardProps) {
  return (
    <div className="detail-pop phonetics-detail-panel corner-brackets relative mt-8 rounded-[3px] border border-hanji-border/90 p-5 shadow-[0_2px_10px_rgb(var(--ink-rgb)/0.05),0_18px_44px_-24px_rgb(var(--ink-rgb)/0.16)] sm:p-8">
      {/* 헤더 — 심볼 타일 + 이름/조음 정보 */}
      <div className="flex flex-wrap items-center gap-5 sm:gap-7">
        <div className="relative shrink-0">
          {/* 금빛 헤일로 — 은은하게 */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-full bg-gold/[0.06] blur-lg"
          />
          <div className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-[3px] border border-[#c9a962]/60 bg-white shadow-[0_1px_6px_rgb(var(--ink-rgb)/0.06)] sm:h-[4.75rem] sm:w-[4.75rem]">
            {/* 타일 코너 포인트 */}
            <span aria-hidden className="absolute left-1.5 top-1.5 h-2 w-2 border-l border-t border-[#c9a962]/50" />
            <span aria-hidden className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b border-r border-[#c9a962]/50" />
            <span className={`${symbolFontClass} text-[2.35rem] leading-none text-[#1c1917] sm:text-[2.65rem]`}>
              {symbol}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">{header}</div>
      </div>

      {/* 금실 구분선 */}
      <div
        aria-hidden
        className="mt-6 h-px w-full bg-gradient-to-r from-gold/50 via-hanji-border to-transparent sm:mt-7"
      />

      <div className="mt-6 sm:mt-7">{children}</div>
    </div>
  )
}
