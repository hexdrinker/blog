import type { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const baseUrl = 'https://hexdrinker.dev'

  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.meta.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...categoryPages,
    ...blogPosts,
  ]
}
