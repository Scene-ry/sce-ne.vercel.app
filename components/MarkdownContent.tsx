import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import Image from 'next/image'

interface MarkdownContentProps {
  content: string
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-4">{children}</h3>,
    p: ({ children, node }) => {
      // Check if this paragraph only contains an image
      if (
        node &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'img'
      ) {
        return <>{children}</>
      }

      return <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{children}</p>
    },
    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">{children}</ol>,
    li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
    img: ({ src, alt }) => {
      if (!src || typeof src !== 'string') return null
      if (alt === 'bilibili') {
        return (
          <iframe
            src={src}
            allowFullScreen={true}
            className="w-full h-110"
          />
        )
      }
      return (
        <div className="my-6 relative w-full overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={alt || ''}
            width={800}
            height={600}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )
    },
    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className || '')
      const lang = match ? match[1] : ''
      const inline = !className // If there's no className, it's inline code

      if (inline) {
        return (
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-400">
            {children}
          </code>
        )
      }

      return (
        <div className="mb-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {lang && (
              <div className="px-4 py-2 bg-gray-800 text-gray-400 text-xs font-mono border-b border-gray-700">
                {lang}
              </div>
            )}
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-gray-100 font-mono">{children}</code>
            </pre>
          </div>
        </div>
      )
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  }

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
