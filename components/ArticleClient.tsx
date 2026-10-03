'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import MarkdownContent from '@/components/MarkdownContent'
import type { Article } from '@/lib/articles'

function categoryToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export default function ArticleClient({ article }: { article: Article }) {
  const { t, locale } = useLanguage()
  const dateStr = new Date(article.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back link */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
        suppressHydrationWarning
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t.article.backToArticles}
      </Link>

      {/* Cover image */}
      {article.coverImage && (
        <div className="relative h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden mb-8">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Link
          href={`/category/${categoryToSlug(article.category)}`}
          className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          {article.category}
        </Link>
        {article.subCategory && (
          <Link
            href={`/category/${categoryToSlug(article.category)}/${categoryToSlug(article.subCategory)}`}
            className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
          >
            {article.subCategory}
          </Link>
        )}
        <span className="text-sm text-muted">{dateStr}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
        {article.title}
      </h1>

      {/* Content */}
      <article>
        <MarkdownContent content={article.content} />
      </article>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border text-center">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          suppressHydrationWarning
        >
          {t.article.viewAllArticles}
        </Link>
      </div>
    </div>
  )
}
