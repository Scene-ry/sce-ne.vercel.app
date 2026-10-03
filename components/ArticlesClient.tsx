'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import ArticleCard from '@/components/ArticleCard'
import type { Article } from '@/lib/articles'

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const { t } = useLanguage()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" suppressHydrationWarning>
          {t.articles.title}
        </h1>
        <p className="text-muted" suppressHydrationWarning>
          {articles.length} {articles.length === 1 ? t.articles.articleAvailable : t.articles.articlesAvailable}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
