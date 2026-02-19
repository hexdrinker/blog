// 카테고리 타입
export type PostCategory =
  | 'tech'
  | 'log'
  | 'daily'
  | 'music'
  | 'book'
  | 'travel'
  | 'movie'
  | 'concert'
  | 'series'
  | 'essay'
  | 'interest'

// 포스트 공통 메타 정보
export interface BasePostMeta {
  title: string
  description: string
  date: string
  tags: string[]
  slug: string
  category: string
  readingTime: string
  imageBasePath?: string
  draft?: boolean
  thumbnail?: string
}

// 일반 카테고리 포스트 메타 정보 (tech, essay 등)
export interface CategoryPostMeta extends BasePostMeta {
  series?: undefined
  seriesOrder?: undefined
}

// 시리즈 포스트 메타 정보
export interface SeriesPostMeta extends BasePostMeta {
  series: string
  seriesOrder?: number
}

// 모든 포스트 메타 정보 (하위 호환성 - 유연한 타입)
export interface PostMeta extends BasePostMeta {
  series?: string
  seriesOrder?: number
}

// 포스트 공통 구조
interface BasePost {
  content: string
  slug: string
  excerpt: string
}

// 일반 카테고리 포스트
export interface CategoryPost extends BasePost {
  meta: CategoryPostMeta
}

// 시리즈 포스트
export interface SeriesPost extends BasePost {
  meta: SeriesPostMeta
}

// 모든 포스트 (하위 호환성)
export interface Post extends BasePost {
  meta: PostMeta
}

// 타입 가드
export function isSeriesPost(post: Post): post is SeriesPost {
  return post.meta.series !== undefined
}

export function isCategoryPost(post: Post): post is CategoryPost {
  return post.meta.series === undefined
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
