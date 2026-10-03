'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import ArticleCard from '@/components/ArticleCard'
import type { Article } from '@/lib/articles'

export default function HomeClient({ articles }: { articles: Article[] }) {
  const { t } = useLanguage()
  const latest = articles.slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <section className="relative mb-12 sm:mb-16">
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-border p-8 sm:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3" suppressHydrationWarning>
              {t.home.welcome}
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed" suppressHydrationWarning>
              {t.home.description}
            </p>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground" suppressHydrationWarning>{t.home.latestArticles}</h2>
          <Link
            href="/articles"
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            suppressHydrationWarning
          >
            {t.home.viewAll} &rarr;
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2" suppressHydrationWarning>{t.home.stayUpdated}</h3>
          <p className="text-sm text-muted mb-5 max-w-md mx-auto" suppressHydrationWarning>{t.home.stayUpdatedDesc}</p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            suppressHydrationWarning
          >
            {t.home.browseAll}
          </Link>
        </div>
      </section>
    </div>
  )
}
