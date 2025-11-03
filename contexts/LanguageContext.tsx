'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Locale, getTranslations, defaultLocale } from '@/locales'
import type { Translations } from '@/locales/en'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with default locale to avoid hydration mismatch
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [t, setT] = useState<Translations>(() => getTranslations(defaultLocale))

  useEffect(() => {
    // Load saved locale from localStorage after mount
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      setLocaleState(savedLocale)
    }
  }, [])

  useEffect(() => {
    // Update translations when locale changes
    setT(getTranslations(locale))
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
    }
  }

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
