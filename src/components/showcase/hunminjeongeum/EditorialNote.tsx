'use client'

import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

/**
 * 일러두기 — 비고 성격의 작은 메타 정보(출처/번호 의미).
 *
 * 디자인 결정: 접고 펼침 토글은 제거하고 항상 노출한다. 항목이 두 줄뿐이라
 * 토글의 가치가 낮고, 사용자가 본문을 읽기 전 맥락을 빠르게 잡는 데 유리.
 */
export function EditorialNote() {
  const { lang } = useLang()
  const m = getMessages(lang)

  return (
    <div className="pt-1">
      <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {m.hunminEditorialNote ?? '일러두기'}
      </p>
      <ul className="space-y-2 text-[12px] leading-relaxed text-ink-muted sm:text-[13px]">
        <li className="flex gap-3 break-keep [overflow-wrap:break-word]">
          <span
            aria-hidden
            className="mt-1.5 inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-ink-muted/60"
          />
          <span>{m.hunminEditorialSource}</span>
        </li>
        <li className="flex gap-3 break-keep [overflow-wrap:break-word]">
          <span
            aria-hidden
            className="mt-1.5 inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-ink-muted/60"
          />
          <span>{m.hunminEditorialNumbering}</span>
        </li>
      </ul>
    </div>
  )
}
