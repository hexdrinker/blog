import Link from 'next/link'
import { getMainPagePosts } from '@/lib/posts'
import { BLOG_CATEGORIES } from '@/lib/categories'
import { PostList } from '@/components/blog'

const POSTS_PER_PAGE = 10

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { page } = await searchParams
  const allPosts = getMainPagePosts()
  const totalPosts = allPosts.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))

  const parsedPageNumber = parseInt(page || '1', 10)
  const parsedPage = Number.isNaN(parsedPageNumber)
    ? 1
    : Math.max(1, parsedPageNumber)
  const currentPage = Math.min(parsedPage, totalPages)

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const makePageHref = (targetPage: number) =>
    targetPage === 1 ? '/' : `/?page=${targetPage}`
  const isPrevDisabled = currentPage === 1
  const isNextDisabled = currentPage === totalPages

  return (
    <div className='max-w-3xl mx-auto px-4 py-12'>
      <header className='mb-8'>
        <h1 className='text-2xl font-semibold tracking-tight mb-1'>
          전체
        </h1>
        <p className='text-sm text-muted-foreground'>{totalPosts}개의 글</p>
      </header>

      <div className='mb-6 flex flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible'>
        <Link
          href='/'
          className='inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm transition-colors border-foreground bg-foreground text-background'
        >
          전체
        </Link>
        {BLOG_CATEGORIES.map((categoryItem) => (
          <Link
            key={categoryItem.key}
            href={`/${categoryItem.key}`}
            className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm transition-colors ${
              'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {categoryItem.label}
          </Link>
        ))}
      </div>

      <PostList
        posts={posts}
        showCategory
      />

      {totalPages > 1 && totalPosts > 0 && (
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
