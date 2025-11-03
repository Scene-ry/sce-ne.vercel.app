'use client'

import ArticleCard from '@/components/ArticleCard'
import { getAllArticles } from '@/config/articles'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const articles = getAllArticles().slice(0, 3) // Show latest 3 articles
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
      {/* Hero Section */}
      <section className="mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.home.welcome}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">{t.home.description}</p>
      </section>

      {/* Latest Articles Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t.home.latestArticles}</h2>
          <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            {t.home.viewAll} →
          </Link>
        </div>

        <div className="grid gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-12 md:mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 md:p-12 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.home.stayUpdated}</h2>
        <p className="text-lg mb-6 opacity-90">{t.home.stayUpdatedDesc}</p>
        <Link
          href="/articles"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {t.home.browseAll}
        </Link>
      </section>
    </div>
  )
}
