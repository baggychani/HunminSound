'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages, LANGUAGES } from '@/lib/i18n'
import { getV2Messages, type SectionId } from '@/lib/v2-i18n'

const NAV_ITEMS: { id: SectionId; labelKey: keyof ReturnType<typeof getV2Messages> }[] = [
  { id: 'overview', labelKey: 'navOverview' },
  { id: 'sound', labelKey: 'navSound' },
  { id: 'hunmin', labelKey: 'navHunmin' },
  { id: 'publications', labelKey: 'navPublications' },
  { id: 'team', labelKey: 'navTeam' },
  { id: 'news', labelKey: 'navNews' },
  { id: 'contact', labelKey: 'navContact' },
]

interface SiteHeaderProps {
  activeSection: SectionId
  onNavigate: (id: SectionId) => void
}

export function SiteHeader({ activeSection, onNavigate }: SiteHeaderProps) {
  const { lang, setLang } = useLang()
  const m = getMessages(lang)
  const v2 = getV2Messages(lang)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navTrackRef = useRef<HTMLDivElement>(null)
  const navLinkRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const updateIndicator = useCallback(() => {
    const idx = NAV_ITEMS.findIndex((item) => item.id === activeSection)
    const el = navLinkRefs.current[idx]
    const track = navTrackRef.current
    if (!el || !track) return
    const trackRect = track.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicator({ left: elRect.left - trackRect.left, width: elRect.width })
  }, [activeSection])

  useLayoutEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  const solid = activeSection !== 'hero'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-v2-hero/95 backdrop-blur-md shadow-lg shadow-black/10' : 'bg-transparent'
      }`}
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: solid ? 1 : 0.5 }}
      />
      <motion.div
        className="v2-section-inner flex h-16 items-center justify-between sm:h-[4.5rem]"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          onClick={() => onNavigate('hero')}
          className="font-jamo text-xl tracking-wide text-white sm:text-2xl"
        >
          {m.siteTitle}
        </button>

        <nav ref={navTrackRef} className="relative hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => { navLinkRefs.current[i] = el }}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                activeSection === item.id ? 'text-amber-300' : 'text-white/70 hover:text-white'
              }`}
            >
              {v2[item.labelKey]}
            </button>
          ))}
          <motion.span
            className="absolute -bottom-1 h-0.5 rounded-full bg-amber-400"
            animate={{ left: indicator.left, width: indicator.width }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        </nav>

        <motion.div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:border-amber-400/50 hover:text-white"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              {LANGUAGES.find((l) => l.code === lang)?.label ?? lang}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute end-0 top-full z-50 mt-2 max-h-64 w-40 overflow-y-auto rounded-lg border border-white/10 bg-v2-hero py-1 shadow-xl"
                  role="listbox"
                >
                  {LANGUAGES.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={lang === l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false) }}
                        className={`block w-full px-3 py-2 text-start text-sm ${
                          lang === l.code ? 'bg-amber-500/20 text-amber-200' : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-white lg:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
              {mobileOpen ? (
                <path fill="none" stroke="currentColor" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path fill="none" stroke="currentColor" strokeWidth="1.75" d="M5 8h14M5 12h14M5 16h14" />
              )}
            </svg>
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-v2-hero/98 lg:hidden"
          >
            <div className="v2-section-inner flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
                  className={`rounded-lg px-4 py-3 text-start text-sm ${
                    activeSection === item.id ? 'bg-amber-500/15 text-amber-200' : 'text-white/80'
                  }`}
                >
                  {v2[item.labelKey]}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
