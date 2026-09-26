import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostsBySeries } from '@/lib/posts'
import { getSeriesBySlug, getAllSeriesSlugs } from '@/lib/series'
import { format } from 'date-fns'
import { SeriesCarousel } from '@/components/blog/SeriesCarousel'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSeriesSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) {
    return {}
  }

  return {
    title: series.title,
    description: series.description || `${series.title} 시리즈 연재물`,
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) {
    notFound()
  }

  const posts = getPostsBySeries(slug)

  const cards = posts.map((post, index) => ({
    href: `/${post.slug}`,
    order: post.meta.seriesOrder ?? index + 1,
    title: post.meta.title,
    description: post.meta.description,
    date: format(new Date(post.meta.date), 'yyyy.MM.dd'),
    readingTime: post.meta.readingTime,
    thumbnail: post.meta.thumbnail,
  }))

  return (
    <div className='max-w-3xl mx-auto px-4 py-12'>
      <header className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight text-balance'>
          {series.title}
        </h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          {series.description && `${series.description} · `}
          {series.postCount}개의 글
        </p>
      </header>

      <SeriesCarousel cards={cards} />
    </div>
  )
}
