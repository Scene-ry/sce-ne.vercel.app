'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { getArticleById } from '@/config/articles'
import MarkdownContent from '@/components/MarkdownContent'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { t, locale } = useLanguage()
  const [articleId, setArticleId] = React.useState<string | null>(null)
  const [article, setArticle] = React.useState<ReturnType<typeof getArticleById> | null>(null)

  useEffect(() => {
    // Set browser tab title on client
    const title = `${article?.title} - Scene's House`
    document.title = title
  }, [article?.title])

  useEffect(() => {
    params.then(({ id }) => {
      setArticleId(id)
      const foundArticle = getArticleById(id)
      if (!foundArticle) {
        notFound()
      }
      setArticle(foundArticle)
    })
  }, [params])

  if (!article || !articleId) {
    return null // Loading state
  }

  return (
    <>
      {/* Article header with optional cover image banner - full width */}
      {article.coverImage && (
        <header className="mb-8">
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover brightness-50"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 container mx-auto max-w-4xl">
              <div className="flex items-center gap-3 text-sm text-white/90 mb-4">
                {article.top !== undefined && (
                  <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                    {t.articles.topIndicator} {article.top}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
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
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{article.title}</h1>
              <p className="text-lg md:text-xl text-white/90">{article.description}</p>
            </div>
          </div>
        </header>
      )}

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-4xl">
        {/* Back button */}
        <Link
          href="/articles"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          {t.article.backToArticles}
        </Link>

        {/* Article header for non-cover articles */}
        {!article.coverImage && (
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
              {article.top !== undefined && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-bold">
                  Top {article.top}
                </span>
              )}
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
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
              <span className="px-3 py-1 bg-black/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
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

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{article.title}</h1>

            <p className="text-xl text-gray-600 dark:text-gray-400">{article.description}</p>
          </header>
        )}

        {/* Article content */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <MarkdownContent content={article.content} />
        </article>

        {/* Footer navigation */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/articles"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {t.article.viewAllArticles}
          </Link>
        </div>
      </div>
    </>
  )
}
