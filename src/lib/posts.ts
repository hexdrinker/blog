import { allPosts } from 'content-collections'
import type { Post } from '@/types/post'

// content-collections 데이터를 기존 Post 인터페이스에 맞게 변환
function transformPost(post: (typeof allPosts)[number]): Post {
  // permalink에서 앞의 / 제거하여 slug로 사용
  const slug = post.permalink.startsWith('/')
    ? post.permalink.slice(1)
    : post.permalink

  return {
    meta: {
      title: post.title,
      description: post.description || '',
      date: post.date,
      tags: post.tags,
      slug: post.slug,
      category: post.category,
      readingTime: post.readingTime,
      imageBasePath: (post as { imageBasePath?: string }).imageBasePath,
      draft: post.draft,
      thumbnail: post.thumbnail,
      series: post.series,
      seriesOrder: post.seriesOrder,
    },
    content: post.content, // MDXRemote에서 사용할 원본 마크다운
    slug,
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

// 메인 페이지용: 모든 포스트 반환
export function getMainPagePosts(): Post[] {
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

export function getSeriesPostBySlug(
  seriesSlug: string,
  postSlug: string
): Post | null {
  const post = allPosts.find(
    (p) =>
      p.category === 'series' &&
      p.series === seriesSlug &&
      p.slug === postSlug &&
      !p.draft
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
  if (category === 'series' || category === 'study') {
    return getAllPosts().filter(
      (post) => post.meta.category === 'study' || post.meta.category === 'series',
    )
  }

  return getAllPosts().filter((post) => post.meta.category === category)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set<string>()

  for (const post of posts) {
    categories.add(post.meta.category === 'study' ? 'series' : post.meta.category)
  }

  return Array.from(categories)
}

// 시리즈 관련 함수들
export function getAllSeries(): string[] {
  const posts = getAllPosts()
  const seriesSet = new Set<string>()

  for (const post of posts) {
    if (post.meta.series) {
      seriesSet.add(post.meta.series)
    }
  }

  return Array.from(seriesSet)
}

export function getPostsBySeries(series: string): Post[] {
  return getAllPosts()
    .filter((post) => post.meta.series === series)
    .sort((a, b) => {
      // seriesOrder가 있으면 순서대로, 없으면 날짜순
      if (a.meta.seriesOrder !== undefined && b.meta.seriesOrder !== undefined) {
        return a.meta.seriesOrder - b.meta.seriesOrder
      }
      return new Date(a.meta.date).getTime() - new Date(b.meta.date).getTime()
    })
}

export function getSeriesInfo(series: string): {
  name: string
  slug: string
  postCount: number
  latestDate: string
  firstPost: Post | null
} | null {
  const posts = getPostsBySeries(series)
  if (posts.length === 0) return null

  const latestPost = posts.reduce((latest, post) =>
    new Date(post.meta.date) > new Date(latest.meta.date) ? post : latest
  )

  return {
    name: series,
    // 폴더 구조에서는 이미 slug 형태, 아닌 경우 변환
    slug: series.includes(' ') ? series.toLowerCase().replace(/\s+/g, '-') : series,
    postCount: posts.length,
    latestDate: latestPost.meta.date,
    firstPost: posts[0],
  }
}

export function getAllSeriesInfo(): Array<{
  name: string
  slug: string
  postCount: number
  latestDate: string
  firstPost: Post | null
}> {
  const seriesList = getAllSeries()
  return seriesList
    .map((series) => getSeriesInfo(series))
    .filter((info): info is NonNullable<typeof info> => info !== null)
    .sort((a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime())
}
