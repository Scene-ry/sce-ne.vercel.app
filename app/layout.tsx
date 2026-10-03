import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { getCategoryHierarchy } from '@/lib/articles'

export const metadata: Metadata = {
  title: "Scene's House",
  description: "A place for a salaryman & rhythm game player to share his journey.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategoryHierarchy()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          <Sidebar categories={categories} />
          <main className="min-h-screen lg:ml-64 xl:ml-72">
            <div className="pt-14 lg:pt-0">{children}</div>
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}
