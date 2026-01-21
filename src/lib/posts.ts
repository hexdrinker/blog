import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post, PostMeta } from '@/types/post'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const CATEGORIES = ['tech', 'essay', 'interest']

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
    .trim()
  return plainText.substring(0, 200) + '...'
}

function getAllMdxFiles(dir: string, category: string = ''): string[] {
  const files: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath, category || entry.name))
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }

  const posts: Post[] = []

  for (const category of CATEGORIES) {
    const categoryPath = path.join(CONTENT_DIR, category)

    if (!fs.existsSync(categoryPath)) continue
    const files = getAllMdxFiles(categoryPath, category)

    for (const filePath of files) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      if (data.draft === true) continue

      const fileName = path.basename(filePath, path.extname(filePath))
      const slug = data.slug ? data.slug.replace(/^\//, '') : fileName

      const tags = Array.isArray(data.tags)
        ? data.tags.filter((t): t is string => typeof t === 'string')
        : []

      posts.push({
        meta: {
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || '',
          authors: data.authors || 'hexdrinker',
          tags,
          keywords: data.keywords || [],
          slug,
          category,
          readingTime: readingTime(content).text,
          draft: data.draft,
          thumbnail: data.thumbnail,
        } as PostMeta,
        content,
        slug: `${category}/${slug}`,
        excerpt: extractExcerpt(content),
      })
    }
  }

  return posts.sort((a, b) =>
    new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  )
}

export function getPostBySlug(category: string, slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find(
    (post) => post.meta.category === category && post.meta.slug === slug
  ) || null
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) =>
    post.meta.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts()
  const tagMap = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.meta.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByYear(): Record<string, Post[]> {
  const posts = getAllPosts()
  const byYear: Record<string, Post[]> = {}

  for (const post of posts) {
    const year = new Date(post.meta.date).getFullYear().toString()
    if (!byYear[year]) {
      byYear[year] = []
    }
    byYear[year].push(post)
  }

  return byYear
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.meta.category === category)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set<string>()

  for (const post of posts) {
    categories.add(post.meta.category)
  }

  return Array.from(categories)
}
