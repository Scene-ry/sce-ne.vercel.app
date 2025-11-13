'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/config/articles'
import { useLanguage } from '@/contexts/LanguageContext'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { t, locale } = useLanguage()

  return (
    <Link href={`/article/${article.id}`} className="block group">
      <article
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 ${
          article.top !== undefined
            ? 'border-2 border-yellow-500 dark:border-yellow-400'
            : 'border border-gray-200 dark:border-gray-700'
        }`}
      >
        {article.coverImage && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-all duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
            {article.top !== undefined && (
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-bold">
                {t.articles.topIndicator} {article.top}
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
              {article.category}
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
              {article.subCategory}
            </span>
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{article.description}</p>

          <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1">
            {t.articles.readMore}
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  )
}
