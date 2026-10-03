import { getAllCategories, getArticlesByCategory, slugToTitle, categoryToSlug } from '@/lib/articles'
import { notFound } from 'next/navigation'
import ArticlesClient from '@/components/ArticlesClient'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ slug: categoryToSlug(cat) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const title = slugToTitle(slug)
  return {
    title: `${title} - Scene's House`,
    description: `Articles in ${title} category.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = slugToTitle(slug)
  const articles = getArticlesByCategory(title)
  if (articles.length === 0) notFound()
  return <ArticlesClient articles={articles} />
}
