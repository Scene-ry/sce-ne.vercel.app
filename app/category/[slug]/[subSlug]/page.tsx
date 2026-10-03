import { getCategoryHierarchy, getArticlesBySubCategory, slugToTitle, categoryToSlug } from '@/lib/articles'
import { notFound } from 'next/navigation'
import ArticlesClient from '@/components/ArticlesClient'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const hierarchy = getCategoryHierarchy()
  const params: { slug: string; subSlug: string }[] = []
  for (const cat of hierarchy) {
    for (const sub of cat.subCategories) {
      params.push({ slug: categoryToSlug(cat.name), subSlug: categoryToSlug(sub) })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; subSlug: string }> }): Promise<Metadata> {
  const { slug, subSlug } = await params
  const catTitle = slugToTitle(slug)
  const subTitle = slugToTitle(subSlug)
  return {
    title: `${subTitle} - ${catTitle} - Scene's House`,
    description: `Articles in ${catTitle} / ${subTitle}.`,
  }
}

export default async function SubCategoryPage({ params }: { params: Promise<{ slug: string; subSlug: string }> }) {
  const { slug, subSlug } = await params
  const catTitle = slugToTitle(slug)
  const subTitle = slugToTitle(subSlug)
  const articles = getArticlesBySubCategory(catTitle, subTitle)
  if (articles.length === 0) notFound()
  return <ArticlesClient articles={articles} />
}
