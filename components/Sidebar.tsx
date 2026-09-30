'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getCategoryHierarchy } from '@/config/articles'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const categoryHierarchy = getCategoryHierarchy()
  const { locale, t } = useLanguage()

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName)
      } else {
        newSet.add(categoryName)
      }
      return newSet
    })
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-200"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo/Title */}
          <div className="mb-8 mt-12 md:mt-0">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white"
            >
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span suppressHydrationWarning>{t.nav.techBlog}</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2" suppressHydrationWarning>
              {t.nav.tagline}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
                  suppressHydrationWarning
                >
                  {t.sections.navigation}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span suppressHydrationWarning>{t.nav.home}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/articles"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/articles'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span suppressHydrationWarning>{t.nav.allArticles}</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
                  suppressHydrationWarning
                >
                  {t.sections.tools}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/tools/bin-file-analyzer"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/tools/bin-file-analyzer'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span suppressHydrationWarning>{t.tools.binFileAnalyzer}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tools/class-course-reader"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/tools/class-course-reader'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span suppressHydrationWarning>{t.tools.classCourseReader}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tools/bililive"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/tools/bililive'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span suppressHydrationWarning>{t.tools.bililive}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/archives/BiliLive-win64.zip"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span suppressHydrationWarning>{t.tools.bililiveDesktop}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      target={locale === 'en' ? '_self' : '_blank'}
                      href={locale === 'en'
                        ? 'https://github.com/Scene-ry/obs-portable-config/archive/refs/heads/master.zip'
                        : 'https://gitee.com/scenedx/obs-portable-config/repository/archive/master.zip'}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span suppressHydrationWarning>{t.tools.obsConfig}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tools/key-sync"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span suppressHydrationWarning>{t.tools.keySync}</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
                  suppressHydrationWarning
                >
                  {t.sections.categories}
                </h3>
                <ul className="space-y-1">
                  {categoryHierarchy.map((category) => {
                    const categorySlug = encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))
                    const isCategoryActive = pathname === `/category/${categorySlug}`
                    const isExpanded = expandedCategories.has(category.name)
                    const hasSubCategories = category.subCategories.length > 0

                    return (
                      <li key={category.name}>
                        <div className="flex items-center">
                          {hasSubCategories ? (
                            <button
                              onClick={() => toggleCategory(category.name)}
                              className="p-1 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                              aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <svg
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ) : (
                            <span className="w-6 mr-1" aria-hidden="true"></span>
                          )}
                          <Link
                            href={`/category/${categorySlug}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex-1 block px-3 py-2 rounded-lg transition-colors ${
                              isCategoryActive
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {category.name}
                          </Link>
                        </div>

                        {hasSubCategories && isExpanded && (
                          <ul className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                            {category.subCategories.map((subCategory) => {
                              const subCategorySlug = encodeURIComponent(subCategory.toLowerCase().replace(/\s+/g, '-'))
                              const isSubCategoryActive = pathname === `/category/${categorySlug}/${subCategorySlug}`

                              return (
                                <li key={subCategory}>
                                  <Link
                                    href={`/category/${categorySlug}/${subCategorySlug}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                                      isSubCategoryActive
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    {subCategory}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <LanguageSwitcher />
            <p className="text-xs text-gray-500 dark:text-gray-400" suppressHydrationWarning>
              {t.footer.builtWith}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
