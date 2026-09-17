'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { LANGUAGES, NAV_LABEL_KO, getMessages, SITE_BRAND_NAME } from '@/lib/i18n'

const NAV_LINKS = [
  { href: '/consonants', topKey: 'consonants' as const, subKey: 'navSubConsonants' as const },
  { href: '/vowels', topKey: 'vowels' as const, subKey: 'navSubVowels' as const },
  { href: '/hunminjeongeum', topKey: 'hunminjeongeum' as const, subKey: 'navSubHunminjeongeum' as const },
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

/** 열린 패널을 닫을 때 트리거 버튼으로 포커스를 되돌리기 위한 헬퍼(둘 중 화면에 보이는 쪽) */
function focusFirstVisible(refs: RefObject<HTMLElement | null>[]) {
  for (const ref of refs) {
    const el = ref.current
    if (el && el.offsetParent !== null) {
      el.focus()
      return
    }
  }
}

export function Header() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const m = getMessages(lang)
  const headerRef = useRef<HTMLElement>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navTrackRef = useRef<HTMLDivElement>(null)
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  /* 열림 상태인 패널(언어/모바일 메뉴)과 그 트리거들 — Esc·바깥 클릭으로 닫기 위한 참조 */
  const panelRef = useRef<HTMLDivElement>(null)
  const desktopLangBtnRef = useRef<HTMLButtonElement>(null)
  const mobileLangBtnRef = useRef<HTMLButtonElement>(null)
  const mobileNavBtnRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return undefined

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty('--site-header-h', `${el.offsetHeight}px`)
    }

    syncHeaderHeight()
    const ro = new ResizeObserver(syncHeaderHeight)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const [navIndicator, setNavIndicator] = useState<{ left: number; width: number } | null>(null)

  const activeNavIndex = NAV_LINKS.findIndex(({ href }) => pathname.startsWith(href))

  const measureNavIndicator = useCallback(() => {
    const track = navTrackRef.current
    const link = activeNavIndex >= 0 ? navLinkRefs.current[activeNavIndex] : null
    if (!track || !link) {
      setNavIndicator(null)
      return
    }
    const tr = track.getBoundingClientRect()
    const lr = link.getBoundingClientRect()
    setNavIndicator({ left: lr.left - tr.left, width: lr.width })
  }, [activeNavIndex])

  useLayoutEffect(() => {
    measureNavIndicator()
  }, [measureNavIndicator, lang])

  useLayoutEffect(() => {
    const track = navTrackRef.current
    if (!track || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measureNavIndicator())
    ro.observe(track)
    return () => ro.disconnect()
  }, [measureNavIndicator])

  useEffect(() => {
    setLangOpen(false)
    setMobileNavOpen(false)
  }, [pathname])

  /* Esc로 닫기(트리거로 포커스 복귀) + 패널 바깥 클릭으로 닫기 */
  useEffect(() => {
    if (!langOpen && !mobileNavOpen) return undefined

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      const wasLangOpen = langOpen
      setLangOpen(false)
      setMobileNavOpen(false)
      if (wasLangOpen) focusFirstVisible([desktopLangBtnRef, mobileLangBtnRef])
      else focusFirstVisible([mobileNavBtnRef])
    }

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      const insidePanel = panelRef.current?.contains(target) ?? false
      const insideTrigger =
        (desktopLangBtnRef.current?.contains(target) ?? false) ||
        (mobileLangBtnRef.current?.contains(target) ?? false) ||
        (mobileNavBtnRef.current?.contains(target) ?? false)
      if (!insidePanel && !insideTrigger) {
        setLangOpen(false)
        setMobileNavOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [langOpen, mobileNavOpen])

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
    <header
      ref={headerRef}
      className="sticky top-0 z-[10001] relative isolate border-b border-hanji-border bg-header shadow-[var(--header-shadow)]"
    >
      <div className="site-container min-h-[3.5rem] py-3 sm:min-h-[4rem] flex flex-nowrap items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-baseline gap-2 sm:flex-initial sm:shrink-0 sm:gap-3"
          onClick={closePanels}
        >
          <span className="font-jamo text-lg sm:text-xl tracking-wide text-ink group-hover:text-ink-accent transition-colors truncate" lang="ko">
            {SITE_BRAND_NAME}
          </span>
          <span className="hidden sm:inline font-sans text-xs text-ink-muted tracking-widest uppercase shrink-0">
            Sejong Speech Sounds
          </span>
        </Link>

        {/* 데스크톱: 기존 가로 네비 */}
        <nav className="scrollbar-none hidden min-w-0 flex-1 flex-nowrap items-center justify-end overflow-x-auto overflow-y-hidden sm:flex">
          <div
            ref={navTrackRef}
            className="relative flex flex-nowrap items-center gap-3 sm:gap-6 md:gap-8 shrink-0"
          >
            {navIndicator !== null && activeNavIndex >= 0 ? (
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 h-px bg-ink-accent transition-[left,width] duration-200 ease-out"
                style={{ left: navIndicator.left, width: navIndicator.width }}
              />
            ) : null}
            {NAV_LINKS.map(({ href, topKey, subKey }, index) => {
              const isActive = pathname.startsWith(href)
              const primary = lang === 'ko' ? NAV_LABEL_KO[topKey] : m[topKey]
              const secondary = lang === 'ko' ? m[subKey] : NAV_LABEL_KO[topKey]

              return (
                <Link
                  key={href}
                  ref={(el) => {
                    navLinkRefs.current[index] = el
                  }}
                  href={href}
                  onClick={closePanels}
                  className="group relative flex flex-col items-center justify-center gap-0.5 pb-2"
                >
                  <span
                    className={`font-sans tracking-korean transition-colors ${
                      lang === 'hi' ? 'text-[15px] leading-snug' : 'text-sm'
                    } ${lang === 'ko' ? 'font-bold' : 'font-normal'} ${
                      isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {primary}
                  </span>
                  <span
                    className={`font-sans tracking-widest leading-none transition-colors ${
                      lang === 'hi' ? 'text-[11.5px]' : 'text-[10.5px]'
                    } ${lang !== 'ko' ? 'font-bold' : 'font-normal'} ${
                      isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {secondary}
                  </span>
                </Link>
              )
            })}
          </div>

          <button
            ref={desktopLangBtnRef}
            type="button"
            onClick={toggleLang}
            className={`group relative ms-4 sm:ms-6 md:ms-8 shrink-0 flex flex-row items-end gap-1 px-0.5 pb-2 transition-colors ${
              langOpen
                ? 'text-ink-accent'
                : 'text-ink-muted hover:text-ink'
            }`}
            aria-expanded={langOpen}
            aria-haspopup="menu"
            aria-controls="site-lang-panel"
            aria-label={m.languagePickerAria}
          >
            <div className="flex flex-col items-center justify-center gap-0.5 text-center min-w-0">
              <span
                className={`font-sans tracking-korean leading-tight transition-colors ${
                  lang === 'hi' ? 'text-[15px]' : 'text-sm'
                } ${lang === 'ko' ? 'font-bold' : 'font-normal'} ${
                  langOpen
                    ? 'text-ink-accent'
                    : 'text-ink-muted group-hover:text-ink'
                }`}
              >
                {lang === 'ko' ? NAV_LABEL_KO.language : m.language}
              </span>
              <span
                className={`font-sans tracking-widest leading-none transition-colors ${
                  lang === 'hi' ? 'text-[11.5px]' : 'text-[10.5px]'
                } ${lang !== 'ko' ? 'font-bold' : 'font-normal'} ${
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
            ref={mobileNavBtnRef}
            type="button"
            onClick={toggleMobileNav}
            className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
              mobileNavOpen ? 'text-ink-accent bg-hanji-warm' : 'text-ink-muted hover:bg-hanji-warm hover:text-ink'
            }`}
            aria-expanded={mobileNavOpen}
            aria-controls="site-mobile-nav-panel"
            aria-label={m.siteNavMenuAria}
          >
            <MenuGlyph open={mobileNavOpen} />
          </button>
          <button
            ref={mobileLangBtnRef}
            type="button"
            onClick={() => (langOpen ? setLangOpen(false) : openLang())}
            className={`flex h-10 min-w-[2.75rem] flex-row items-center justify-center gap-0.5 rounded-md px-1 transition-colors ${
              langOpen ? 'text-ink-accent bg-hanji-warm' : 'text-ink-muted hover:bg-hanji-warm hover:text-ink'
            }`}
            aria-expanded={langOpen}
            aria-haspopup="menu"
            aria-controls="site-lang-panel"
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
            id="site-mobile-nav-panel"
            ref={panelRef}
            role="navigation"
            aria-label={m.siteNavMenuAria}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute start-0 end-0 top-full z-[65] border-b border-hanji-border bg-header shadow-[0_12px_24px_-8px_rgb(0_0_0_/0.18)] dark:shadow-[0_16px_32px_-10px_rgb(0_0_0_/0.65)] sm:hidden"
          >
            <div className="site-container py-2">
              {NAV_LINKS.map(({ href, topKey }) => {
                const isActive = pathname.startsWith(href)
                const label = lang === 'ko' ? NAV_LABEL_KO[topKey] : m[topKey]
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closePanels}
                    className={`block border-b border-hanji-border/70 py-3.5 text-base last:border-b-0 ${
                      isActive ? 'text-ink' : 'text-ink-muted'
                    }`}
                  >
                    <span
                      className={`font-sans tracking-korean ${lang === 'ko' ? 'font-bold' : 'font-normal'}`}
                    >
                      {label}
                    </span>
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
            id="site-lang-panel"
            ref={panelRef}
            role="region"
            aria-label={m.languagePickerAria}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute start-0 end-0 top-full z-[70] border-b border-hanji-border bg-header shadow-[0_12px_24px_-8px_rgb(0_0_0_/0.18)] dark:shadow-[0_16px_32px_-10px_rgb(0_0_0_/0.65)]"
          >
            <div className="site-container py-4 sm:py-5">
              <div
                role="menu"
                aria-label={m.languagePickerAria}
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5"
              >
                {LANGUAGES.map((l) => {
                  const isActive = lang === l.code
                  return (
                    <motion.button
                      key={l.code}
                      type="button"
                      role="menuitem"
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => {
                        setLang(l.code)
                        setLangOpen(false)
                        focusFirstVisible([desktopLangBtnRef, mobileLangBtnRef])
                      }}
                      className={`flex min-h-10 w-full items-center gap-2 rounded-md border border-transparent px-2.5 py-1.5 text-start font-sans text-sm leading-tight tracking-wide transition-colors ${
                        isActive
                          ? 'text-ink-accent bg-hanji-warm/70 border-hanji-border/70'
                          : 'text-ink-muted hover:text-ink hover:bg-hanji-warm/40'
                      }`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                          isActive ? 'bg-gold' : 'bg-transparent'
                        }`}
                        aria-hidden
                      />
                      <span className="min-w-0 break-words">{l.label}</span>
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
