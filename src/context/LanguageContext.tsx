'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react'
import { Locale, translations } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof translations.ar
  dir: 'rtl' | 'ltr'
  isAr: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kobisto-locale') as Locale | null
    if (saved === 'ar' || saved === 'en') {
      return saved
    }
  }
  return 'ar'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const initialized = useRef(false)

  // Sync DOM attributes when locale changes
  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale])

  // Mark as initialized after first render
  useEffect(() => {
    initialized.current = true
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('kobisto-locale', newLocale)
  }, [])

  const t = translations[locale]
  const dir = locale === 'ar' ? 'rtl' as const : 'ltr' as const
  const isAr = locale === 'ar'

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, isAr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
