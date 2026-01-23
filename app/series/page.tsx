import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllSeriesWithMeta } from '@/lib/series'

export const metadata: Metadata = {
  title: 'Series',
  description: '시리즈 연재물 모음',
}

export default function SeriesPage() {
  const seriesList = getAllSeriesWithMeta()

  console.log(seriesList)
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <header className='mb-8'>
        <h1 className='text-2xl font-semibold tracking-tight mb-1'>Series</h1>
        <p className='text-sm text-muted-foreground'>
          {seriesList.length}개의 시리즈
        </p>
      </header>

      {seriesList.length === 0 ? (
        <div className='text-muted-foreground text-center py-12'>
          아직 시리즈가 없습니다.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {seriesList.map((series) => (
            <Link
              key={series.slug}
              href={`/series/${series.slug}`}
              className='group block border border-border rounded-lg hover:border-foreground/20 transition-colors overflow-hidden'
            >
              {series.thumbnail && (
                <div className='relative w-full aspect-3/2'>
                  <Image
                    src={series.thumbnail}
                    alt={series.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div className='p-4'>
                <h2 className='text-lg font-semibold mb-1 group-hover:text-primary transition-colors'>
                  {series.title}
                </h2>
                {series.description && (
                  <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                    {series.description}
                  </p>
                )}
                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                  <span>{series.postCount}개의 글</span>
                  <span>
                    최근 업데이트:{' '}
                    {new Date(series.latestDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
