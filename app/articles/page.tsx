import { getAllArticles } from '@/lib/articles'
import ArticlesClient from '@/components/ArticlesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "All Articles - Scene's House",
  description: 'Browse through our collection of articles and tutorials.',
}

export default function ArticlesPage() {
  const articles = getAllArticles()
  return <ArticlesClient articles={articles} />
}
