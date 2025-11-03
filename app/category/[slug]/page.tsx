import ArticleCard from '@/components/ArticleCard'
import { getAllCategories, getArticlesByCategory, slugToTitle } from '@/config/articles'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    slug: category.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = slugToTitle(slug)

  return {
    title: `${category} Articles - Tech Blog`,
    description: `Browse all articles in the ${category} category.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  // Convert slug back to category name
  const categoryName = slugToTitle(slug)

  // Try to find articles with case-insensitive matching
  const allCategories = getAllCategories()
  const matchedCategory = allCategories.find((cat) => cat.toLowerCase() === categoryName.toLowerCase())

  if (!matchedCategory) {
    notFound()
  }

  const articles = getArticlesByCategory(matchedCategory)

  if (articles.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
      {/* Back button */}
      <Link href="/articles" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
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
        Back to all articles
      </Link>

      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {matchedCategory}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {matchedCategory} Articles
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'} in this category
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
