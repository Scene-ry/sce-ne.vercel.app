import { getAllArticles, getArticleById } from '@/lib/articles'
import { notFound } from 'next/navigation'
import ArticleClient from '@/components/ArticleClient'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ id: article.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const article = getArticleById(id)
  if (!article) return { title: 'Not Found' }
  return {
    title: `${article.title} - Scene's House`,
    description: article.description,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = getArticleById(id)
  if (!article) notFound()
  return <ArticleClient article={article} />
}
