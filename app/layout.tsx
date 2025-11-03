import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: 'Scene\'s House',
  description: 'A technical blog with responsive menu-content layout',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
