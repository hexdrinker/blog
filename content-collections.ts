import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const IMAGE_BASE_URL = 'https://images.hexdrinker.dev'

// reading time 계산 함수
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// excerpt 추출 함수
function extractExcerpt(content: string): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
  return plainText.substring(0, 200) + '...'
}

function resolveContentImage(src: string | undefined, basePath: string): string | undefined {
  if (!src) return src

  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) {
    return src
  }

  const normalizedBasePath = basePath.replace(/\/$/, '')
  const normalizedSrc = src.replace(/^\//, '')

  return `${IMAGE_BASE_URL}/${normalizedBasePath}/${normalizedSrc}`
}

const posts = defineCollection({
  name: 'posts',
  directory: 'content',
  include: '**/*.mdx',
  exclude: ['**/series/**/index.mdx'],
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
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
    const pathCategory = pathParts[0]
    const slug = pathParts[pathParts.length - 1]

    // series 폴더 구조인 경우: series/[시리즈명]/[파일명]
    // 시리즈명을 폴더에서 자동 추출
    const isSeriesPost = pathCategory === 'series' && pathParts.length >= 3
    const seriesFromPath = isSeriesPost ? pathParts[1] : undefined
    const category = isSeriesPost ? 'series' : document.category || pathCategory
    const imageBasePath = isSeriesPost
      ? `series/${pathParts[1]}/${slug}`
      : `${pathCategory}/${slug}`

    return {
      ...document,
      category,
      slug,
      imageBasePath,
      thumbnail: resolveContentImage(document.thumbnail, imageBasePath),
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
      thumbnail: resolveContentImage(document.thumbnail ?? undefined, `series/${slug}`),
    }
  },
})

export default defineConfig({
  collections: [posts, seriesMeta],
})
