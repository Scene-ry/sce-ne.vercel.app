import type { Article } from '../articles'

export const article: Article = {
  id: 'tailwind-css-responsive-design',
  title: 'Responsive Design with Tailwind CSS',
  description: 'Master responsive design patterns using Tailwind CSS utility classes and breakpoints.',
  date: '2024-10-18',
  category: 'CSS',
  subCategory: 'Responsive Design',
  coverImage: '/images/articles/tailwind-cover.jpg',
  content: `
# Responsive Design with Tailwind CSS

Tailwind CSS makes it incredibly easy to build responsive layouts with its mobile-first utility classes.

## Mobile-First Approach

Tailwind uses a mobile-first breakpoint system. This means unprefixed utilities target all screen sizes, while prefixed utilities only apply at the specified breakpoint and above.

## Breakpoints

Tailwind includes five default breakpoints:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Example Usage

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Full width on mobile, half on tablet, third on desktop -->
</div>
\`\`\`

## Flexbox and Grid

Tailwind provides comprehensive utilities for modern layouts:

\`\`\`html
<div class="flex flex-col md:flex-row gap-4">
  <!-- Stack vertically on mobile, horizontally on desktop -->
</div>
\`\`\`

![Responsive Design Example](/images/articles/tailwind-responsive.jpg)

## Best Practices

1. Start with mobile design first
2. Add breakpoints progressively
3. Use consistent spacing scales
4. Leverage Tailwind's design system

Building responsive layouts has never been easier!
  `.trim(),
}
