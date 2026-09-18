'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { LANGUAGES, type Lang } from '@/lib/i18n'

const LANGUAGE_KEY = 'sejong-language'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ko')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY)
      if (LANGUAGES.some(({ code }) => code === saved)) setLangState(saved as Lang)
    } catch {
      // 저장소 접근 제한 시 현재 방문 동안만 유지한다.
    }
  }, [])

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    try {
      localStorage.setItem(LANGUAGE_KEY, newLang)
    } catch {}
  }, [])

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang === 'zh' ? 'zh-Hans' : lang
    html.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
