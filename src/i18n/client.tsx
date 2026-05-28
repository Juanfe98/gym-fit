'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultLanguage, isLanguage, type Language } from './config'
import { UI } from './ui'

const STORAGE_KEY = 'gym-planner-language'

type Params = Record<string, string | number>

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: keyof typeof UI.en, params?: Params) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function interpolate(value: string, params?: Params) {
  if (!params) return value
  return Object.entries(params).reduce(
    (text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)),
    value
  )
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved && isLanguage(saved)) return saved
  const browserLang = window.navigator.language.split('-')[0]
  return isLanguage(browserLang) ? browserLang : defaultLanguage
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(defaultLanguage)

  useEffect(() => {
    setLangState(getInitialLanguage())
  }, [])

  const value = useMemo<I18nContextValue>(() => ({
    lang,
    setLang: (nextLang) => {
      setLangState(nextLang)
      window.localStorage.setItem(STORAGE_KEY, nextLang)
      document.documentElement.lang = nextLang
    },
    t: (key, params) => interpolate(UI[lang][key] ?? UI.en[key], params),
  }), [lang])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="fixed right-3 top-3 z-[60] flex rounded-full border border-gym-border bg-gym-surface/90 p-0.5 text-xs shadow backdrop-blur" aria-label={t('language')}>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`min-h-8 rounded-full px-3 font-semibold ${lang === 'en' ? 'bg-gym-accent text-white' : 'text-gym-muted'}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('es')}
        className={`min-h-8 rounded-full px-3 font-semibold ${lang === 'es' ? 'bg-gym-accent text-white' : 'text-gym-muted'}`}
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
    </div>
  )
}
