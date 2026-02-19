import Link from 'next/link'
import { differenceInCalendarDays, format, isValid } from 'date-fns'
import type { Post } from '@/types/post'
import { BLOG_CATEGORY_MAP } from '@/lib/categories'

interface PostCardProps {
  post: Post
  showCategory?: boolean
}

export function PostCard({ post, showCategory = false }: PostCardProps) {
  const { meta, slug } = post
  const category = BLOG_CATEGORY_MAP.get(meta.category)
  const categoryLabel = category?.label || meta.category
  const categoryBadgeClassName =
    category?.badgeClassName ||
    'border-border bg-muted text-muted-foreground'
  const publishedAt = new Date(meta.date)
  const daysSincePublished = differenceInCalendarDays(new Date(), publishedAt)
  const isNew = isValid(publishedAt) && daysSincePublished >= 0 && daysSincePublished <= 7

  return (
    <Link
      href={`/${slug}`}
      className='group block'
    >
      <article className='py-4'>
        <div className='sm:hidden space-y-1'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2'>
              {showCategory && (
                <span
                  className={`inline-flex h-6 items-center rounded border px-2 text-xs font-medium leading-none ${categoryBadgeClassName}`}
                >
                  {categoryLabel}
                </span>
              )}
              {isNew && (
                <span className='inline-flex h-6 items-center rounded-full border border-orange-200 bg-orange-50 px-2 text-xs font-medium leading-none text-orange-700 dark:border-orange-900/70 dark:bg-orange-950/40 dark:text-orange-300'>
                  new
                </span>
              )}
            </div>
            <time
              dateTime={meta.date}
              className='text-sm text-muted-foreground tabular-nums whitespace-nowrap'
            >
              {format(new Date(meta.date), 'yyyy.MM.dd')}
            </time>
          </div>
          <h2 className='text-base leading-6 group-hover:text-primary transition-colors'>
            {meta.title}
          </h2>
        </div>

        <div className='hidden sm:flex sm:items-center sm:justify-between sm:gap-4'>
          <div className='flex items-center gap-2'>
            {showCategory && (
              <span
                className={`inline-flex h-6 items-center rounded border px-2 text-xs font-medium leading-none ${categoryBadgeClassName}`}
              >
                {categoryLabel}
              </span>
            )}
            <h2 className='text-base leading-6 group-hover:text-primary transition-colors'>
              {meta.title}
            </h2>
            {isNew && (
              <span className='inline-flex h-6 items-center rounded-full border border-orange-200 bg-orange-50 px-2 text-xs font-medium leading-none text-orange-700 dark:border-orange-900/70 dark:bg-orange-950/40 dark:text-orange-300'>
                new
              </span>
            )}
          </div>
          <div className='flex items-center gap-3 text-sm text-muted-foreground tabular-nums whitespace-nowrap'>
            <time dateTime={meta.date}>
              {format(new Date(meta.date), 'yyyy.MM.dd')}
            </time>
          </div>
        </div>
      </article>
    </Link>
  )
}
