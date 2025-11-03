'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLocale('zh')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          locale === 'zh'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        EN
      </button>
    </div>
  )
}
