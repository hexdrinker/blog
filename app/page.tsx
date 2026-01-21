import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { PostList } from '@/components/blog'

const POSTS_PER_PAGE = 16

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const allPosts = getAllPosts()
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <section className='py-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-medium'>
            Posts
            <span className='text-sm font-normal text-muted-foreground ml-2'>
              ({totalPosts})
            </span>
          </h2>
        </div>

        <PostList posts={posts} />

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className='flex items-center justify-center gap-2 mt-8 pt-8 border-t border-border'>
            {currentPage > 1 && (
              <Link
                href={currentPage === 2 ? '/' : `/?page=${currentPage - 1}`}
                className='px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                &larr; Prev
              </Link>
            )}

            <div className='flex items-center gap-1'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Show first, last, current, and adjacent pages
                  const showPage =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1

                  if (!showPage) {
                    // Show ellipsis
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
                      href={pageNum === 1 ? '/' : `/?page=${pageNum}`}
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

            {currentPage < totalPages && (
              <Link
                href={`/?page=${currentPage + 1}`}
                className='px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                Next &rarr;
              </Link>
            )}
          </nav>
        )}
      </section>
    </div>
  )
}
