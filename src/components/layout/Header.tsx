'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { LANGUAGES, NAV_LABEL_KO, getMessages } from '@/lib/i18n'

const NAV_LINKS = [
  { href: '/consonants', topKey: 'consonants' as const, subKey: 'navSubConsonants' as const },
  { href: '/vowels', topKey: 'vowels' as const, subKey: 'navSubVowels' as const },
]

export function Header() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const m = getMessages(lang)
  const [langOpen, setLangOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 relative border-b border-hanji-border bg-hanji">
      {/* 메인 헤더 바 — 불투명 배경(반투명/블러 제거로 다크 모드에서 본문 비침 방지) */}
      <div className="max-w-5xl mx-auto px-6 min-h-[4rem] py-3 flex flex-nowrap items-center justify-between gap-3">
        {/* 로고 */}
        <Link
          href="/"
          className="group flex shrink-0 items-baseline gap-2 sm:gap-3 min-w-0"
          onClick={() => setLangOpen(false)}
        >
          <span className="font-serif text-xl tracking-wide text-ink group-hover:text-ink-accent transition-colors">
            세종말소리
          </span>
          <span className="hidden sm:inline font-sans text-xs text-ink-muted tracking-widest uppercase">
            Sejong Speech Sounds
          </span>
        </Link>

        {/* 네비게이션 + 언어 (언어는 오른쪽 분리) */}
        <nav className="scrollbar-none flex min-w-0 flex-1 flex-nowrap items-center justify-end overflow-x-auto overflow-y-hidden">
          <div className="flex flex-nowrap items-center gap-4 sm:gap-8 shrink-0">
            {NAV_LINKS.map(({ href, topKey, subKey }) => {
              const isActive = pathname.startsWith(href)
              const primary = lang === 'ko' ? NAV_LABEL_KO[topKey] : m[topKey]
              const secondary =
                lang === 'ko' ? m[subKey] : NAV_LABEL_KO[topKey]

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setLangOpen(false)}
                  className="relative flex flex-col items-center justify-center gap-0.5 group pb-2"
                >
                  <span
                    className={`font-sans tracking-korean transition-colors ${
                      lang === 'hi' ? 'text-[15px] leading-snug' : 'text-sm'
                    } ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                  >
                    {primary}
                  </span>
                  <span
                    className={`font-sans text-ink-muted tracking-widest leading-none ${
                      lang === 'hi' ? 'text-[11px]' : 'text-[10px]'
                    }`}
                  >
                    {secondary}
                  </span>
                  {isActive && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-ink-accent"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className={`relative ml-4 sm:ml-8 md:ml-12 lg:ml-16 shrink-0 flex flex-row items-center gap-1 px-0.5 pb-2 transition-colors ${
              langOpen ? 'text-ink-accent' : 'text-ink-muted hover:text-ink'
            }`}
            aria-expanded={langOpen}
            aria-label={m.languagePickerAria}
          >
            <span
              className={`font-sans tracking-korean leading-tight ${
                lang === 'hi' ? 'text-[15px]' : 'text-sm'
              }`}
            >
              {m.language}
            </span>
            <motion.span
              animate={{ rotate: langOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="inline-flex shrink-0 text-[10px] leading-none self-center"
              aria-hidden
            >
              ▾
            </motion.span>
          </button>
        </nav>
      </div>

      {/* 언어 패널: 문서 흐름 밖(absolute) → 아래 본문 레이아웃 고정 */}
      <AnimatePresence initial={false}>
        {langOpen && (
          <motion.div
            key="lang-panel"
            role="region"
            aria-label="언어 목록"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-[70] border-b border-hanji-border bg-hanji shadow-[0_12px_24px_-8px_rgb(0_0_0_/0.18)] dark:shadow-[0_16px_32px_-10px_rgb(0_0_0_/0.65)]"
          >
            <div className="max-w-5xl mx-auto px-6 py-5">
              <div className="flex flex-wrap justify-end gap-x-8 gap-y-3">
                {LANGUAGES.map((l) => {
                  const isActive = lang === l.code
                  return (
                    <motion.button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLang(l.code)
                        setLangOpen(false)
                      }}
                      className={`font-sans text-sm tracking-wide transition-colors ${
                        isActive
                          ? 'text-ink-accent'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      {isActive && (
                        <span className="inline-block w-1 h-1 rounded-full bg-gold mr-2 align-middle mb-0.5" />
                      )}
                      {l.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
