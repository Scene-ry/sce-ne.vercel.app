import { getAllArticles } from '@/lib/articles'
import HomeClient from '@/components/HomeClient'

export default function HomePage() {
  const articles = getAllArticles()
  return <HomeClient articles={articles} />
}
