import { en } from './en'
import { zh } from './zh'

export type Locale = 'en' | 'zh'

export const locales = {
  en,
  zh,
}

export const defaultLocale: Locale = 'en'

export function getTranslations(locale: Locale) {
  return locales[locale] || locales[defaultLocale]
}
