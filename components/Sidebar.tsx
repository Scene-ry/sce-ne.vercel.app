'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import type { CategoryHierarchy } from '@/lib/articles'

function NavLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted hover:bg-surface-hover hover:text-foreground'
      }`}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  )
}

const HomeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
)
const ArticlesIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
)
const ToolIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
)
const FolderIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
)
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
)
const ExternalIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 opacity-40"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>
)

function categoryToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export default function Sidebar({ categories }: { categories: CategoryHierarchy[] }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const { t, locale, setLocale } = useLanguage()

  // Close the mobile drawer whenever the route changes (e.g. back/forward navigation)
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  const closeMobile = () => setMobileOpen(false)

  const toggleCategory = (name: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const obsUrl = locale === 'zh'
    ? 'https://gitee.com/scenedx/obs-portable-config/repository/archive/master.zip'
    : 'https://github.com/Scene-ry/obs-portable-config/archive/refs/heads/master.zip'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link href="/" className="block" onClick={closeMobile}>
          <h1 className="text-lg font-bold text-foreground">{t.nav.techBlog}</h1>
          <p className="text-xs text-muted mt-0.5">{t.nav.tagline}</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Navigation */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70">{t.sections.navigation}</p>
          <div className="space-y-0.5">
            <NavLink href="/" label={t.nav.home} icon={<HomeIcon />} active={pathname === '/'} onNavigate={closeMobile} />
            <NavLink href="/articles" label={t.nav.allArticles} icon={<ArticlesIcon />} active={pathname === '/articles'} onNavigate={closeMobile} />
          </div>
        </div>

        {/* Tools */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70">{t.sections.tools}</p>
          <div className="space-y-0.5">
            <NavLink href="/tools/bin-file-analyzer" label={t.tools.binFileAnalyzer} icon={<ToolIcon />} active={pathname === '/tools/bin-file-analyzer'} onNavigate={closeMobile} />
            <NavLink href="/tools/class-course-reader" label={t.tools.classCourseReader} icon={<ToolIcon />} active={pathname === '/tools/class-course-reader'} onNavigate={closeMobile} />
            <NavLink href="/tools/bililive" label={t.tools.bililive} icon={<ToolIcon />} active={pathname.startsWith('/tools/bililive')} onNavigate={closeMobile} />
            <NavLink href="/tools/key-sync" label={t.tools.keySync} icon={<ToolIcon />} active={pathname === '/tools/key-sync'} onNavigate={closeMobile} />
            <a
              href="/archives/BiliLive-win64.zip"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface-hover hover:text-foreground transition-all duration-150"
            >
              <span className="w-5 h-5 flex-shrink-0"><ToolIcon /></span>
              <span className="truncate flex-1">{t.tools.bililiveDesktop}</span>
              <ExternalIcon />
            </a>
            <a
              href={obsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface-hover hover:text-foreground transition-all duration-150"
            >
              <span className="w-5 h-5 flex-shrink-0"><ToolIcon /></span>
              <span className="truncate flex-1">{t.tools.obsConfig}</span>
              <ExternalIcon />
            </a>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70">{t.sections.categories}</p>
            <div className="space-y-0.5">
              {categories.map((cat) => {
                const catSlug = categoryToSlug(cat.name)
                const isActive = pathname.startsWith(`/category/${catSlug}`)
                const isExpanded = expandedCats.has(cat.name)

                return (
                  <div key={cat.name}>
                    <div className="flex items-center">
                      <Link
                        href={`/category/${catSlug}`}
                        onClick={closeMobile}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surface-hover hover:text-foreground'
                        }`}
                      >
                        <span className="w-5 h-5 flex-shrink-0"><FolderIcon /></span>
                        <span className="truncate">{cat.name}</span>
                      </Link>
                      {cat.subCategories.length > 0 && (
                        <button
                          onClick={() => toggleCategory(cat.name)}
                          className="p-1.5 mr-1 rounded-md hover:bg-surface-hover text-muted transition-colors"
                        >
                          <ChevronIcon open={isExpanded} />
                        </button>
                      )}
                    </div>
                    {isExpanded && cat.subCategories.length > 0 && (
                      <div className="ml-8 mt-0.5 space-y-0.5">
                        {cat.subCategories.map((sub) => {
                          const subSlug = categoryToSlug(sub)
                          const subActive = pathname === `/category/${catSlug}/${subSlug}`
                          return (
                            <Link
                              key={sub}
                              href={`/category/${catSlug}/${subSlug}`}
                              onClick={closeMobile}
                              className={`block px-3 py-1.5 rounded-md text-sm transition-all duration-150 ${
                                subActive ? 'text-primary font-medium' : 'text-muted hover:text-foreground'
                              }`}
                            >
                              {sub}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface-hover hover:text-foreground transition-all duration-150"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
          </svg>
          <span>{locale === 'en' ? '中文' : 'English'}</span>
        </button>
        <p className="text-[11px] text-muted/50 text-center mt-2" suppressHydrationWarning>{t.footer.builtWith}</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger / close toggle */}
      <button
        onClick={() => setMobileOpen((open) => !open)}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-surface border border-border shadow-md lg:hidden"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-foreground">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-foreground">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        )}
      </button>

      {/* Mobile overlay — always mounted so open/close both animate */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop: tap outside the drawer to close */}
        <div
          onClick={closeMobile}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Drawer */}
        <aside
          className={`relative w-72 max-w-[80vw] h-full pt-14 bg-surface border-r border-border shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:fixed lg:inset-y-0 lg:left-0 bg-surface border-r border-border">
        {sidebarContent}
      </aside>
    </>
  )
}
