'use client'

import { getV2Messages, SECTION_IDS, type SectionId } from '@/lib/v2-i18n'
import { useLang } from '@/contexts/LanguageContext'

const DOT_COLORS: Partial<Record<SectionId, string>> = {
  hero: 'bg-amber-400',
  overview: 'bg-orange-500',
  sound: 'bg-sky-500',
  hunmin: 'bg-emerald-500',
  publications: 'bg-violet-400',
  team: 'bg-indigo-400',
  news: 'bg-rose-400',
  contact: 'bg-amber-300',
}

interface SectionNavProps {
  activeSection: SectionId
  onNavigate: (id: SectionId) => void
}

export function SectionNav({ activeSection, onNavigate }: SectionNavProps) {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)

  const labels: Record<SectionId, string> = {
    hero: 'Home',
    overview: v2.navOverview,
    sound: v2.navSound,
    hunmin: v2.navHunmin,
    publications: v2.navPublications,
    team: v2.navTeam,
    news: v2.navNews,
    contact: v2.navContact,
  }

  return (
    <nav
      className="fixed end-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex"
      aria-label="Section navigation"
    >
      {SECTION_IDS.map((id) => (
        <button
          key={id}
          type="button"
          aria-label={labels[id]}
          aria-current={activeSection === id ? 'true' : undefined}
          onClick={() => onNavigate(id)}
          className="group flex items-center justify-end gap-2"
        >
          <span
            className={`pointer-events-none rounded bg-black/70 px-2 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100 ${
              activeSection === id ? 'opacity-100' : ''
            }`}
          >
            {labels[id]}
          </span>
          <span
            className={`block rounded-full transition-all ${
              activeSection === id
                ? `h-3 w-3 ${DOT_COLORS[id] ?? 'bg-amber-400'} ring-2 ring-white/30`
                : 'h-2 w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
