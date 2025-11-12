import { article as gettingStartedWithNextjs } from './articles/getting-started-with-nextjs'
import { article as tailwindCssResponsiveDesign } from './articles/tailwind-css-responsive-design'
import { article as typescriptBestPractices } from './articles/typescript-best-practices'
import { article as reactServerComponents } from './articles/react-server-components'
import { article as webPerformanceOptimization } from './articles/web-performance-optimization'
import { article as iidxHistoricalCabinets } from './articles/iidx-historical-cabinets'

export interface Article {
  id: string
  title: string
  description: string
  date: string
  category: string
  subCategory?: string
  content: string
  coverImage?: string
  top?: number
}

export const articles: Article[] = [
  gettingStartedWithNextjs,
  tailwindCssResponsiveDesign,
  typescriptBestPractices,
  reactServerComponents,
  webPerformanceOptimization,
  iidxHistoricalCabinets,
]

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id)
}

export function getAllArticles(): Article[] {
  return articles.sort((a, b) => {
    const topDiff = (b.top ?? 0) - (a.top ?? 0)
    if (topDiff !== 0) return topDiff
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getArticlesByCategory(category: string): Article[] {
  return articles
    .filter((article) => article.category === category)
    .sort((a, b) => {
      const topDiff = (b.top ?? 0) - (a.top ?? 0)
      if (topDiff !== 0) return topDiff
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export function getAllCategories(): string[] {
  const categories = articles.map((article) => article.category)
  return Array.from(new Set(categories)).sort()
}

export interface CategoryHierarchy {
  name: string
  subCategories: string[]
}

export function getCategoryHierarchy(): CategoryHierarchy[] {
  const categoryMap = new Map<string, Set<string>>()

  articles.forEach((article) => {
    if (!categoryMap.has(article.category)) {
      categoryMap.set(article.category, new Set())
    }
    if (article.subCategory) {
      const subCategories = categoryMap.get(article.category)
      if (subCategories) {
        subCategories.add(article.subCategory)
      }
    }
  })

  return Array.from(categoryMap.entries())
    .map(([name, subCategories]) => ({
      name,
      subCategories: Array.from(subCategories).sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getArticlesBySubCategory(category: string, subCategory: string): Article[] {
  return articles
    .filter((article) => article.category === category && article.subCategory === subCategory)
    .sort((a, b) => {
      const topDiff = (b.top ?? 0) - (a.top ?? 0)
      if (topDiff !== 0) return topDiff
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
