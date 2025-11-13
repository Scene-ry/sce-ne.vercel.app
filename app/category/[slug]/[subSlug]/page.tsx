import ArticleCard from '@/components/ArticleCard'
import { getCategoryHierarchy, getArticlesBySubCategory, getAllCategories, slugToTitle } from '@/config/articles'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface SubCategoryPageProps {
  params: Promise<{ slug: string; subSlug: string }>
}

export async function generateStaticParams() {
  const hierarchy = getCategoryHierarchy()
  const params: { slug: string; subSlug: string }[] = []

  hierarchy.forEach((category) => {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-')
    category.subCategories.forEach((subCategory) => {
      const subCategorySlug = subCategory.toLowerCase().replace(/\s+/g, '-')
      params.push({
        slug: categorySlug,
        subSlug: subCategorySlug,
      })
    })
  })

  return params
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { slug, subSlug } = await params
  const category = slugToTitle(slug)
  const subCategory = slugToTitle(subSlug)

  return {
    title: `${category} - ${subCategory} Articles - Scene's House`,
    description: `Browse all ${subCategory} articles in the ${category} category.`,
  }
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { slug, subSlug } = await params

  // Convert slugs back to names
  const categoryName = slugToTitle(slug)
  const subCategoryName = slugToTitle(subSlug)

  // Try to find matching category with case-insensitive matching
  const allCategories = getAllCategories()
  const matchedCategory = allCategories.find((cat) => cat.toLowerCase() === categoryName.toLowerCase())

  if (!matchedCategory) {
    notFound()
  }

  // Find the sub-category in the hierarchy
  const hierarchy = getCategoryHierarchy()
  const categoryHierarchy = hierarchy.find((cat) => cat.name.toLowerCase() === matchedCategory.toLowerCase())

  if (!categoryHierarchy) {
    notFound()
  }

  const matchedSubCategory = categoryHierarchy.subCategories.find(
    (sub) => sub.toLowerCase() === subCategoryName.toLowerCase()
  )

  if (!matchedSubCategory) {
    notFound()
  }

  const articles = getArticlesBySubCategory(matchedCategory, matchedSubCategory)

  if (articles.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
      {/* Back button */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/category/${slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
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
          Back to {matchedCategory}
        </Link>
      </div>

      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
            {matchedCategory}
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
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {matchedSubCategory}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{matchedSubCategory}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'} in this sub-category
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
