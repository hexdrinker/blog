export interface PostMeta {
  title: string
  description: string
  date: string
  tags: string[]
  slug: string
  category: string
  readingTime: string
  draft?: boolean
  thumbnail?: string
  series?: string
  seriesOrder?: number
}

export interface Post {
  meta: PostMeta
  content: string
  slug: string
  excerpt: string
}

export interface Author {
  name: string
  title: string
  url: string
  image_url: string
}

export type Authors = Record<string, Author>

export interface Tag {
  name: string
  count: number
}

export interface Series {
  title: string
  description?: string
  slug: string
  thumbnail?: string | null
  postCount: number
  latestDate: string
}
