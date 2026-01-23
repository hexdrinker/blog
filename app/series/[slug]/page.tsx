import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostsBySeries } from '@/lib/posts'
import { getSeriesBySlug, getAllSeriesSlugs } from '@/lib/series'

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

  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <header className='mb-8'>
        <Link
          href='/series'
          className='text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block'
        >
          &larr; 시리즈 목록
        </Link>
        <h1 className='text-2xl font-semibold tracking-tight mb-1'>
          {series.title}
        </h1>
        <p className='text-sm text-muted-foreground'>{series.postCount}개의 글</p>
      </header>

      <div className='space-y-4'>
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            className='group block p-4 border border-border rounded-lg hover:border-foreground/20 transition-colors'
          >
            <div className='flex items-start gap-4'>
              <span className='flex-shrink-0 w-8 h-8 flex items-center justify-center bg-muted rounded-full text-sm font-medium'>
                {post.meta.seriesOrder ?? index + 1}
              </span>
              <div className='flex-1 min-w-0'>
                <h2 className='font-medium group-hover:text-primary transition-colors mb-1'>
                  {post.meta.title}
                </h2>
                {post.meta.description && (
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {post.meta.description}
                  </p>
                )}
                <div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
                  <span>
                    {new Date(post.meta.date).toLocaleDateString('ko-KR')}
                  </span>
                  <span>{post.meta.readingTime}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
