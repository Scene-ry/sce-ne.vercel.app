import fs from 'fs'
import path from 'path'

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

export interface CategoryHierarchy {
  name: string
  subCategories: string[]
}

const articlesDirectory = path.join(process.cwd(), 'content/articles')

function parseFrontmatter(fileContent: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = fileContent.match(frontmatterRegex)
  if (!match) {
    return { data: {}, content: fileContent }
  }

  const frontmatterBlock = match[1]
  const content = match[2].trim()
  const data: Record<string, unknown> = {}

  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    let value: string | number = line.slice(colonIndex + 1).trim()
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    // Parse numbers
    if (/^\d+$/.test(value)) {
      data[key] = parseInt(value, 10)
    } else {
      data[key] = value
    }
  }

  return { data, content }
}

function readArticle(fileName: string): Article {
  const id = fileName.replace(/\.md$/, '')
  const fullPath = path.join(articlesDirectory, fileName)
  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = parseFrontmatter(fileContent)

  return {
    id,
    title: (data.title as string) || id,
    description: (data.description as string) || '',
    date: (data.date as string) || '',
    category: (data.category as string) || 'Uncategorized',
    subCategory: data.subCategory as string | undefined,
    content,
    coverImage: data.coverImage as string | undefined,
    top: data.top as number | undefined,
  }
}

let cachedArticles: Article[] | null = null

function loadAllArticles(): Article[] {
  if (cachedArticles) return cachedArticles
  const fileNames = fs.readdirSync(articlesDirectory).filter((f) => f.endsWith('.md'))
  cachedArticles = fileNames.map(readArticle)
  return cachedArticles
}

function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const topDiff = (b.top ?? 0) - (a.top ?? 0)
    if (topDiff !== 0) return topDiff
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getAllArticles(): Article[] {
  return sortArticles(loadAllArticles())
}

export function getArticleById(id: string): Article | undefined {
  return loadAllArticles().find((article) => article.id === id)
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = loadAllArticles().filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  )
  return sortArticles(articles)
}

export function getArticlesBySubCategory(category: string, subCategory: string): Article[] {
  const articles = loadAllArticles().filter(
    (a) =>
      a.category.toLowerCase() === category.toLowerCase() &&
      a.subCategory?.toLowerCase() === subCategory.toLowerCase()
  )
  return sortArticles(articles)
}

export function getAllCategories(): string[] {
  const categories = loadAllArticles().map((a) => a.category)
  return Array.from(new Set(categories)).sort()
}

export function getCategoryHierarchy(): CategoryHierarchy[] {
  const categoryMap = new Map<string, Set<string>>()
  for (const article of loadAllArticles()) {
    if (!categoryMap.has(article.category)) {
      categoryMap.set(article.category, new Set())
    }
    if (article.subCategory) {
      categoryMap.get(article.category)!.add(article.subCategory)
    }
  }
  return Array.from(categoryMap.entries())
    .map(([name, subs]) => ({ name, subCategories: Array.from(subs).sort() }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function slugToTitle(slug: string): string {
  // Try to find matching category/subcategory name (case-insensitive) to preserve original casing
  const allArticles = loadAllArticles()
  const slugLower = slug.toLowerCase().replace(/-/g, ' ')

  for (const a of allArticles) {
    if (a.category.toLowerCase() === slugLower) return a.category
    if (a.subCategory && a.subCategory.toLowerCase() === slugLower) return a.subCategory
  }

  // Fallback: capitalize each word
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function categoryToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}
