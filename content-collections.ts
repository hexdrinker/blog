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
  exclude: ['**/series/**/index.mdx'],
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    tags: z.array(z.coerce.string()).default([]),
    draft: z.boolean().default(false),
    thumbnail: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
  }),
  transform: (document) => {
    // 파일 경로에서 category와 slug 추출
    // _meta.path는 "tech/shadow-dom" 또는 "series/clean-architecture/01-intro" 형식
    const pathParts = document._meta.path.split('/')
    const category = pathParts[0]
    const slug = pathParts[pathParts.length - 1]

    // series 폴더 구조인 경우: series/[시리즈명]/[파일명]
    // 시리즈명을 폴더에서 자동 추출
    const isSeriesPost = category === 'series' && pathParts.length >= 3
    const seriesFromPath = isSeriesPost ? pathParts[1] : undefined

    return {
      ...document,
      category,
      slug,
      // series 폴더 구조면 폴더명에서 시리즈 추출, 아니면 frontmatter에서
      series: seriesFromPath || document.series,
      permalink: isSeriesPost
        ? `/series/${pathParts[1]}/${slug}`
        : `/${category}/${slug}`,
      readingTime: calculateReadingTime(document.content),
      excerpt: extractExcerpt(document.content),
    }
  },
})

// 시리즈 메타 정보 컬렉션
const seriesMeta = defineCollection({
  name: 'seriesMeta',
  directory: 'content',
  include: 'series/*/index.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z.string().optional().nullable(),
  }),
  transform: (document) => {
    // _meta.path는 "series/clean-architecture-deep-dive/index" 형식
    const pathParts = document._meta.path.split('/')
    const slug = pathParts[1] // series 다음의 폴더명

    return {
      ...document,
      slug,
    }
  },
})

export default defineConfig({
  collections: [posts, seriesMeta],
})
