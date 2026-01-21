import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

// reading time 계산 함수
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// excerpt 추출 함수
function extractExcerpt(content: string): string {
  const truncateIndex = content.indexOf('<!--truncate-->')
  if (truncateIndex > -1) {
    return content.substring(0, truncateIndex).trim()
  }
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
  return plainText.substring(0, 200) + '...'
}

const posts = defineCollection({
  name: 'posts',
  directory: 'content',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    authors: z.string().default('hexdrinker'),
    tags: z.array(z.coerce.string()).default([]),
    keywords: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    thumbnail: z.string().optional(),
  }),
  transform: (document) => {
    // 파일 경로에서 category와 slug 추출
    // _meta.path는 "tech/shadow-dom" 형식
    const pathParts = document._meta.path.split('/')
    const category = pathParts[0]
    const slug = pathParts[pathParts.length - 1]

    return {
      ...document,
      category,
      slug,
      permalink: `/${category}/${slug}`,
      readingTime: calculateReadingTime(document.content),
      excerpt: extractExcerpt(document.content),
    }
  },
})

export default defineConfig({
  collections: [posts],
})
