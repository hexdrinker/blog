import { allSeriesMetas } from 'content-collections'
import { getPostsBySeries } from './posts'
import type { Series } from '@/types/post'

export function getAllSeriesWithMeta(): Series[] {
  return allSeriesMetas
    .map((meta) => {
      const posts = getPostsBySeries(meta.slug)
      const latestPost =
        posts.length > 0
          ? posts.reduce((latest, post) =>
              new Date(post.meta.date) > new Date(latest.meta.date)
                ? post
                : latest,
            )
          : null

      return {
        title: meta.title,
        description: meta.description,
        slug: meta.slug,
        thumbnail: meta.thumbnail,
        postCount: posts.length,
        latestDate: latestPost?.meta.date || '',
      }
    })
    .sort(
      (a, b) =>
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime(),
    )
}

export function getSeriesBySlug(slug: string): Series | null {
  const meta = allSeriesMetas.find((s) => s.slug === slug)
  if (!meta) return null

  const posts = getPostsBySeries(slug)
  const latestPost =
    posts.length > 0
      ? posts.reduce((latest, post) =>
          new Date(post.meta.date) > new Date(latest.meta.date) ? post : latest,
        )
      : null

  return {
    title: meta.title,
    description: meta.description,
    slug: meta.slug,
    thumbnail: meta.thumbnail,
    postCount: posts.length,
    latestDate: latestPost?.meta.date || '',
  }
}

export function getAllSeriesSlugs(): string[] {
  return allSeriesMetas.map((meta) => meta.slug)
}
