import { allPosts } from 'content-collections'
import type { Post } from '@/types/post'

// content-collections 데이터를 기존 Post 인터페이스에 맞게 변환
function transformPost(post: (typeof allPosts)[number]): Post {
  return {
    meta: {
      title: post.title,
      description: post.description || '',
      date: post.date,
      authors: post.authors,
      tags: post.tags,
      keywords: post.keywords,
      slug: post.slug,
      category: post.category,
      readingTime: post.readingTime,
      draft: post.draft,
      thumbnail: post.thumbnail,
    },
    content: post.content, // MDXRemote에서 사용할 원본 마크다운
    slug: `${post.category}/${post.slug}`,
    excerpt: post.excerpt,
  }
}

export function getAllPosts(): Post[] {
  return allPosts
    .filter((post) => !post.draft)
    .map(transformPost)
    .sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    )
}

export function getPostBySlug(category: string, slug: string): Post | null {
  const post = allPosts.find(
    (p) => p.category === category && p.slug === slug && !p.draft
  )
  return post ? transformPost(post) : null
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
