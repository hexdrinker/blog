import type { Metadata } from 'next'
import CategoryPage from '../[category]/page'
import { BLOG_CATEGORY_MAP } from '@/lib/categories'

const seriesMeta = BLOG_CATEGORY_MAP.get('series')

export const metadata: Metadata = {
  title: seriesMeta?.label || '시리즈',
  description: seriesMeta?.description || '시리즈 카테고리',
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default function SeriesPage({ searchParams }: Props) {
  return CategoryPage({
    params: Promise.resolve({ category: 'series' }),
    searchParams,
  })
}
