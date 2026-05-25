'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSectionObserver, useSnapScroll } from '@/hooks/useSnapScroll'
import type { SectionId } from '@/lib/v2-i18n'
import { SiteHeader } from './SiteHeader'
import { SectionNav } from './SectionNav'

interface SnapScrollContextValue {
  activeSection: SectionId
  scrollToSection: (id: SectionId) => void
}

const SnapScrollContext = createContext<SnapScrollContextValue | null>(null)

export function useSnapScrollContext() {
  const ctx = useContext(SnapScrollContext)
  if (!ctx) throw new Error('useSnapScrollContext must be used within SnapScrollLayout')
  return ctx
}

export function SnapScrollLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  const onSectionChange = useCallback((id: SectionId) => {
    setActiveSection(id)
  }, [])

  const { scrollToSection } = useSnapScroll(activeSection, onSectionChange)
  useSectionObserver(onSectionChange)

  useEffect(() => {
    document.documentElement.classList.add('v2-snap')
    return () => document.documentElement.classList.remove('v2-snap')
  }, [])

  return (
    <SnapScrollContext.Provider value={{ activeSection, scrollToSection }}>
      <SiteHeader activeSection={activeSection} onNavigate={scrollToSection} />
      <SectionNav activeSection={activeSection} onNavigate={scrollToSection} />
      {children}
    </SnapScrollContext.Provider>
  )
}
