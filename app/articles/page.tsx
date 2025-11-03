'use client'

import ArticleCard from '@/components/ArticleCard'
import { getAllArticles } from '@/config/articles'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ArticlesPage() {
  const articles = getAllArticles()
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
      <div className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.articles.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {articles.length} {articles.length === 1 ? t.articles.articleAvailable : t.articles.articlesAvailable}
        </p>
      </div>

      <div className="grid gap-6 md:gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
