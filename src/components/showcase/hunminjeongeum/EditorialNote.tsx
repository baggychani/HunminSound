'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

/**
 * 일러두기 — 비고 성격의 작은 메타 정보를 펼침 버튼 뒤에 둠.
 * 디폴트로 접혀 있으며 펼치면 출처/번호 의미가 노출된다.
 */
export function EditorialNote() {
  const { lang } = useLang()
  const m = getMessages(lang)
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-hanji-border/60 pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="hunmin-editorial-note"
        className="group inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink focus-visible:text-ink"
      >
        <span
          aria-hidden
          className={[
            'inline-block text-[10px] transition-transform duration-300 ease-out',
            open ? 'rotate-90' : 'rotate-0',
          ].join(' ')}
        >
          ›
        </span>
        <span>{m.hunminEditorialNote ?? '일러두기'}</span>
        <span className="text-ink-muted/40">
          {open ? m.hunminEditorialHide : m.hunminEditorialShow}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="hunmin-editorial-note"
            key="editorial-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-4 space-y-2 text-[12px] leading-relaxed text-ink-muted sm:text-[13px]">
              <li className="flex gap-3">
                <span aria-hidden className="mt-1.5 inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-ink-muted/60" />
                <span>{m.hunminEditorialSource}</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-1.5 inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-ink-muted/60" />
                <span>{m.hunminEditorialNumbering}</span>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
