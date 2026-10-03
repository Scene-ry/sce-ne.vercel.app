'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import type { Components } from 'react-markdown'

function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const language = className?.replace('language-', '') || ''
  return (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg rounded-tr-[0.7rem] bg-white/10 text-xs text-slate-400 font-mono">
          {language}
        </div>
      )}
      <pre className="!mt-0">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

const components: Components = {
  img: ({ alt, src }) => {
    if (!src || typeof src !== 'string') return null
    const srcStr = src as string
    // Bilibili video embed
    if (alt === 'bilibili') {
      return (
        <div className="relative w-full my-6" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={srcStr.startsWith('//') ? `https:${srcStr}` : srcStr}
            className="absolute inset-0 w-full h-full rounded-xl"
            allowFullScreen
            sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
          />
        </div>
      )
    }
    return (
      <span className="block my-6">
        <Image
          src={srcStr}
          alt={alt || ''}
          width={800}
          height={600}
          className="rounded-xl w-full h-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </span>
    )
  },
  p: ({ children, ...props }) => {
    // If paragraph contains only an image, don't wrap in <p>
    const childArray = Array.isArray(children) ? children : [children]
    if (childArray.length === 1 && typeof childArray[0] === 'object' && childArray[0] !== null) {
      const child = childArray[0] as Record<string, unknown>
      if (child.type === 'img' || (child.props && (child.props as Record<string, unknown>).src)) {
        return <>{children}</>
      }
    }
    return <p {...props}>{children}</p>
  },
  code: ({ className, children, ...props }) => {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>
    }
    return <code {...props}>{children}</code>
  },
  pre: ({ children }) => <>{children}</>,
}

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
