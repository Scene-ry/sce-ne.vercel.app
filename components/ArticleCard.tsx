'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Article } from '@/lib/articles'

function categoryToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export default function ArticleCard({ article }: { article: Article }) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const dateStr = new Date(article.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link href={`/article/${article.id}`} className="group block">
      <article className="relative rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
        {article.top && (
          <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[11px] font-semibold backdrop-blur-sm">
            {t.articles.topIndicator}
          </div>
        )}

        {article.coverImage && (
          <div className="relative h-44 sm:h-48 overflow-hidden bg-surface-hover">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              role="link"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/category/${categoryToSlug(article.category)}`)
              }}
              className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer"
            >
              {article.category}
            </span>
            {article.subCategory && (
              <span
                role="link"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(`/category/${categoryToSlug(article.category)}/${categoryToSlug(article.subCategory!)}`)
                }}
                className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors cursor-pointer"
              >
                {article.subCategory}
              </span>
            )}
            <span className="text-xs text-muted ml-auto">{dateStr}</span>
          </div>

          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>
      </article>
    </Link>
  )
}
