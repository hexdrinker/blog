import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostsByCategory, getAllCategories } from '@/lib/posts'
import { getAllSeriesWithMeta } from '@/lib/series'
import { BLOG_CATEGORIES, BLOG_CATEGORY_MAP } from '@/lib/categories'
import { PostList } from '@/components/blog'

const configuredCategories = BLOG_CATEGORIES.map((category) => category.key)
const POSTS_PER_PAGE = 10

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const categories = Array.from(
    new Set([...configuredCategories, ...getAllCategories()])
  )
  return categories.map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const validCategories = new Set([...configuredCategories, ...getAllCategories()])
  const meta = BLOG_CATEGORY_MAP.get(category)

  if (!validCategories.has(category)) {
    return {}
  }

  return {
    title: meta?.label || category,
    description: meta?.description || `${category} 카테고리의 글 목록`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { page } = await searchParams
  const validCategories = new Set([...configuredCategories, ...getAllCategories()])
  const isSeriesCategory = category === 'series'

  // 유효하지 않은 카테고리는 404
  if (!validCategories.has(category)) {
    notFound()
  }

  const posts = getPostsByCategory(category)
  const seriesList = isSeriesCategory ? getAllSeriesWithMeta() : []
  const meta = BLOG_CATEGORY_MAP.get(category)
  const totalPosts = posts.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))

  const parsedPageNumber = parseInt(page || '1', 10)
  const parsedPage = Number.isNaN(parsedPageNumber)
    ? 1
    : Math.max(1, parsedPageNumber)
  const currentPage = Math.min(parsedPage, totalPages)

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const makePageHref = (targetPage: number) =>
    targetPage === 1 ? `/${category}` : `/${category}?page=${targetPage}`
  const isPrevDisabled = currentPage === 1
  const isNextDisabled = currentPage === totalPages

  return (
    <div className='max-w-3xl mx-auto px-4 py-12'>
      <header className='mb-8'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          {meta?.label || category}
        </h1>
        <div
          className={`mt-2 flex items-end gap-4 ${
            meta?.description ? 'justify-between' : 'justify-end'
          }`}
        >
          {meta?.description && (
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {meta.description}
            </p>
          )}
          <p className='shrink-0 text-xs text-muted-foreground/80'>
            {isSeriesCategory
              ? `${seriesList.length}개의 시리즈`
              : `${totalPosts}개의 글`}
          </p>
        </div>
      </header>
      <div className='mb-6 flex flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible'>
        <Link
          href='/'
          className='inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm transition-colors border-border text-muted-foreground hover:text-foreground'
        >
          전체
        </Link>
        {BLOG_CATEGORIES.map((categoryItem) => (
          <Link
            key={categoryItem.key}
            href={`/${categoryItem.key}`}
            className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm transition-colors ${
              category === categoryItem.key
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {categoryItem.label}
          </Link>
        ))}
      </div>

      {isSeriesCategory ? (
        seriesList.length === 0 ? (
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
        )
      ) : (
        <PostList posts={paginatedPosts} />
      )}

      {!isSeriesCategory && totalPages > 1 && totalPosts > 0 && (
        <nav className='flex items-center justify-center gap-2 mt-4 pt-4'>
          <Link
            href={makePageHref(isPrevDisabled ? 1 : currentPage - 1)}
            aria-disabled={isPrevDisabled}
            className={`px-3 py-2 text-sm transition-colors ${
              isPrevDisabled
                ? 'text-muted-foreground/40 pointer-events-none'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            이전
          </Link>

          <div className='flex items-center gap-1'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1

                if (!showPage) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <span
                        key={pageNum}
                        className='px-2 text-muted-foreground'
                      >
                        ...
                      </span>
                    )
                  }
                  return null
                }

                return (
                  <Link
                    key={pageNum}
                    href={makePageHref(pageNum)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      pageNum === currentPage
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              },
            )}
          </div>

          <Link
            href={makePageHref(isNextDisabled ? totalPages : currentPage + 1)}
            aria-disabled={isNextDisabled}
            className={`px-3 py-2 text-sm transition-colors ${
              isNextDisabled
                ? 'text-muted-foreground/40 pointer-events-none'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            다음
          </Link>
        </nav>
      )}
    </div>
  )
}
