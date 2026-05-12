'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { LANGUAGES, NAV_LABEL_KO, getMessages } from '@/lib/i18n'

const NAV_LINKS = [
  { href: '/consonants', topKey: 'consonants' as const, subKey: 'navSubConsonants' as const },
  { href: '/vowels', topKey: 'vowels' as const, subKey: 'navSubVowels' as const },
]

function MenuGlyph({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="text-ink">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M6 6l12 12M18 6L6 18"
        />
      </svg>
    )
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="text-ink-muted">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M5 8h14M5 12h14M5 16h14"
      />
    </svg>
  )
}

export function Header() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const m = getMessages(lang)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    setLangOpen(false)
    setMobileNavOpen(false)
  }, [pathname])

  const openLang = () => {
    setMobileNavOpen(false)
    setLangOpen(true)
  }
  const toggleLang = () => {
    setMobileNavOpen(false)
    setLangOpen((v) => !v)
  }
  const toggleMobileNav = () => {
    setLangOpen(false)
    setMobileNavOpen((v) => !v)
  }

  const closePanels = () => {
    setLangOpen(false)
    setMobileNavOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 relative border-b border-hanji-border bg-hanji">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 min-h-[3.5rem] sm:min-h-[4rem] py-3 flex flex-nowrap items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-baseline gap-2 sm:flex-initial sm:shrink-0 sm:gap-3"
          onClick={closePanels}
        >
          <span className="font-serif text-lg sm:text-xl tracking-wide text-ink group-hover:text-ink-accent transition-colors truncate">
            세종말소리
          </span>
          <span className="hidden sm:inline font-sans text-xs text-ink-muted tracking-widest uppercase shrink-0">
            Sejong Speech Sounds
          </span>
        </Link>

        {/* 데스크톱: 기존 가로 네비 */}
        <nav className="scrollbar-none hidden min-w-0 flex-1 flex-nowrap items-center justify-end overflow-x-auto overflow-y-hidden sm:flex">
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
                  onClick={closePanels}
                  className="group relative flex flex-col items-center justify-center gap-0.5 pb-2"
                >
                  <span
                    className={`font-sans tracking-korean transition-colors ${
                      lang === 'hi' ? 'text-[15px] leading-snug' : 'text-sm'
                    } ${
                      isActive
                        ? 'text-ink group-hover:text-ink-accent'
                        : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {primary}
                  </span>
                  <span
                    className={`font-sans tracking-widest leading-none transition-colors ${
                      lang === 'hi' ? 'text-[11px]' : 'text-[10px]'
                    } ${
                      isActive
                        ? 'text-ink-muted group-hover:text-ink'
                        : 'text-ink-muted group-hover:text-ink'
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
            onClick={toggleLang}
            className={`group relative ml-4 sm:ml-8 md:ml-12 lg:ml-16 shrink-0 flex flex-row items-end gap-1 px-0.5 pb-2 transition-colors ${
              langOpen
                ? 'text-ink-accent'
                : 'text-ink-muted hover:text-ink'
            }`}
            aria-expanded={langOpen}
            aria-label={m.languagePickerAria}
          >
            <div className="flex flex-col items-center justify-center gap-0.5 text-center min-w-0">
              <span
                className={`font-sans tracking-korean leading-tight transition-colors ${
                  lang === 'hi' ? 'text-[15px]' : 'text-sm'
                } ${
                  langOpen
                    ? 'text-ink-accent'
                    : 'text-ink-muted group-hover:text-ink'
                }`}
              >
                {lang === 'ko' ? NAV_LABEL_KO.language : m.language}
              </span>
              <span
                className={`font-sans tracking-widest leading-none transition-colors ${
                  lang === 'hi' ? 'text-[11px]' : 'text-[10px]'
                } ${
                  langOpen
                    ? 'text-ink-accent'
                    : 'text-ink-muted group-hover:text-ink'
                }`}
              >
                {lang === 'ko' ? m.navSubLanguage : NAV_LABEL_KO.language}
              </span>
            </div>
            <motion.span
              animate={{ rotate: langOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`inline-flex shrink-0 text-[10px] leading-none self-center pb-0.5 transition-colors ${
                langOpen ? 'text-ink-accent' : 'text-ink-muted group-hover:text-ink'
              }`}
              aria-hidden
            >
              ▾
            </motion.span>
          </button>
        </nav>

        {/* 모바일: 메뉴 + 언어 (가로 나열 잘림 방지) */}
        <div className="flex shrink-0 items-center gap-0.5 sm:hidden">
          <button
            type="button"
            onClick={toggleMobileNav}
            className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
              mobileNavOpen ? 'text-ink-accent bg-hanji-warm' : 'text-ink-muted hover:bg-hanji-warm hover:text-ink'
            }`}
            aria-expanded={mobileNavOpen}
            aria-label={m.siteNavMenuAria}
          >
            <MenuGlyph open={mobileNavOpen} />
          </button>
          <button
            type="button"
            onClick={() => (langOpen ? setLangOpen(false) : openLang())}
            className={`flex h-10 min-w-[2.75rem] flex-row items-center justify-center gap-0.5 rounded-md px-1 transition-colors ${
              langOpen ? 'text-ink-accent bg-hanji-warm' : 'text-ink-muted hover:bg-hanji-warm hover:text-ink'
            }`}
            aria-expanded={langOpen}
            aria-label={m.languagePickerAria}
          >
            <span
              className={`font-sans tracking-korean leading-tight ${
                lang === 'hi' ? 'text-[14px]' : 'text-sm'
              }`}
            >
              {m.language}
            </span>
            <motion.span
              animate={{ rotate: langOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="inline-flex text-[10px] leading-none"
              aria-hidden
            >
              ▾
            </motion.span>
          </button>
        </div>
      </div>

      {/* 모바일 사이트 메뉴 (자음 / 모음) */}
      <AnimatePresence initial={false}>
        {mobileNavOpen && (
          <motion.div
            key="site-nav-panel"
            role="navigation"
            aria-label={m.siteNavMenuAria}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-[65] border-b border-hanji-border bg-hanji shadow-[0_12px_24px_-8px_rgb(0_0_0_/0.18)] dark:shadow-[0_16px_32px_-10px_rgb(0_0_0_/0.65)] sm:hidden"
          >
            <div className="max-w-5xl mx-auto px-4 py-2">
              {NAV_LINKS.map(({ href, topKey }) => {
                const isActive = pathname.startsWith(href)
                const label =
                  lang === 'ko' ? NAV_LABEL_KO[topKey] : m[topKey]
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closePanels}
                    className={`block border-b border-hanji-border/70 py-3.5 text-base last:border-b-0 ${
                      isActive ? 'text-ink' : 'text-ink-muted'
                    }`}
                  >
                    <span className="font-sans tracking-korean">{label}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
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
