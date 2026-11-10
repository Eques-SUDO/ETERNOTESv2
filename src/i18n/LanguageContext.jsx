import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translate } from './translations.js'

const STORAGE_KEY = 'eternotes-language'
export const LanguageContext = createContext(null)

function initialLanguage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    // Language switching also works when browser storage is unavailable.
  }
  return 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage)
  const value = useMemo(() => ({
    language,
    setLanguage: (next) => {
      if (next === 'en' || next === 'fr') setLanguage(next)
    },
    t: (message, params) => translate(language, message, params),
  }), [language])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = value.t('ETERNOTES — Music Club · Faculty of Sciences of Rabat')
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      value.t('ETERNOTES — the official music club of the Faculty of Sciences of Rabat (FSR), Mohammed V University. Where music lives forever.'))
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Keep the current selection in memory if persistence is blocked.
    }
  }, [language, value])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
