import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { getMainPagePosts } from '@/lib/posts'
import { getAllSeriesWithMeta } from '@/lib/series'
import { getAuthor } from '@/lib/authors'
import type { Post } from '@/types/post'
import { PostThumbnail, getBookTitle } from '@/components/blog'

const ARTICLE_CATEGORIES = new Set(['tech'])
const THOUGHT_CATEGORIES = new Set(['log', 'daily'])
const THOUGHTS_COUNT = 5
const BOOKS_COUNT = 8

interface ArticleItem {
  href: string
  title: string
  date: string
  thumbnail?: string | null
  excerpt?: string
  meta?: string
}

function toArticle(post: Post): ArticleItem {
  return {
    href: `/${post.slug}`,
    title: post.meta.title,
    date: post.meta.date,
    thumbnail: post.meta.thumbnail,
    excerpt: post.meta.description || post.excerpt,
    meta: post.meta.readingTime,
  }
}


function formatDate(date: string, pattern = 'yyyy.MM.dd') {
  return format(new Date(date), pattern)
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className='mb-4 flex items-baseline justify-between'>
      <h2 className='text-sm font-semibold tracking-tight'>
        {title}
      </h2>
      <Link
        href={href}
        className='text-sm text-muted-foreground hover:text-foreground transition-colors'
      >
        전체 보기 →
      </Link>
    </div>
  )
}

export default function HomePage() {
  const author = getAuthor('hexdrinker')
  const posts = getMainPagePosts()

  const articles = [
    ...posts.filter((post) => ARTICLE_CATEGORIES.has(post.meta.category)).map(toArticle),
    ...getAllSeriesWithMeta().map((series) => ({
      href: `/series/${series.slug}`,
      title: series.title,
      date: series.latestDate,
      thumbnail: series.thumbnail,
      excerpt: series.description,
      meta: `시리즈 · ${series.postCount}편`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const [featured, ...restArticles] = articles
  const sideArticles = restArticles.slice(0, 2)
  const moreArticles = restArticles.slice(2, 5)
  const thoughts = posts
    .filter((post) => THOUGHT_CATEGORIES.has(post.meta.category))
    .slice(0, THOUGHTS_COUNT)
  const books = posts
    .filter((post) => post.meta.category === 'bookshelf')
    .slice(0, BOOKS_COUNT)

  return (
    <div className='max-w-3xl mx-auto px-4 py-12 space-y-14'>
      <section className='flex flex-col items-center gap-3 text-center'>
        {/* 흰 배경 전신 픽셀아트라 흰 원 안에 상반신만 확대해 보여준다 */}
        <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-foreground/10 bg-white'>
          <Image
            src={author?.image_url ?? '/img/logos/youngho.png'}
            alt={author?.name ?? 'hexdrinker'}
            fill
            sizes='192px'
            className='origin-[50%_28%] scale-[2] object-cover [image-rendering:pixelated]'
            priority
          />
        </div>
        <div className='min-w-0'>
          <h1 className='text-lg font-semibold tracking-tight'>
            {author?.name ?? 'hexdrinker'}
          </h1>
          {author?.title && (
            <p className='text-sm text-muted-foreground'>{author.title}</p>
          )}
        </div>
      </section>

      {featured && (
        <section className='grid gap-6 md:grid-cols-3'>
          <Link
            href={featured.href}
            className='group md:col-span-2 md:row-span-2'
          >
            <PostThumbnail
              src={featured.thumbnail}
              alt={featured.title}
              sizes='(min-width: 768px) 480px, 100vw'
              priority
            />
            <p className='mt-4 text-xs font-medium text-primary'>새 글</p>
            <h2 className='mt-1 text-2xl font-bold tracking-tight text-balance group-hover:text-primary transition-colors'>
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2'>
                {featured.excerpt}
              </p>
            )}
            <p className='mt-3 text-xs text-muted-foreground tabular-nums'>
              {formatDate(featured.date)}
              {featured.meta && ` · ${featured.meta}`}
            </p>
          </Link>

          {sideArticles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className='group'
            >
              <PostThumbnail
                src={article.thumbnail}
                alt={article.title}
                sizes='(min-width: 768px) 240px, 100vw'
              />
              <h3 className='mt-2 text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors'>
                {article.title}
              </h3>
              <p className='mt-1 text-xs text-muted-foreground tabular-nums'>
                {formatDate(article.date)}
              </p>
            </Link>
          ))}
        </section>
      )}

      {moreArticles.length > 0 && (
        <section>
          <SectionHeader
            title='개발 · 시리즈'
            href='/tech'
          />
          <div className='grid gap-6 sm:grid-cols-3'>
            {moreArticles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className='group'
              >
                <PostThumbnail
                  src={article.thumbnail}
                  alt={article.title}
                  sizes='(min-width: 640px) 240px, 100vw'
                />
                <h3 className='mt-2 text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors'>
                  {article.title}
                </h3>
                <p className='mt-1 text-xs text-muted-foreground tabular-nums'>
                  {formatDate(article.date)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 기록·일상과 독서는 데스크톱에서 한 줄에 나란히 */}
      <div className='grid gap-14 md:grid-cols-2 md:gap-10'>
        {thoughts.length > 0 && (
          <section>
            <SectionHeader
              title='기록 · 일상'
              href='/log'
            />
            <ul className='divide-y divide-border border-y border-border'>
              {thoughts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/${post.slug}`}
                    className='group flex items-baseline gap-4 py-3'
                  >
                    <time
                      dateTime={post.meta.date}
                      className='shrink-0 text-xs text-muted-foreground tabular-nums'
                    >
                      {formatDate(post.meta.date, 'yy.MM.dd')}
                    </time>
                    <span className='min-w-0 truncate text-sm group-hover:text-primary transition-colors'>
                      {post.meta.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {books.length > 0 && (
          <section>
            <SectionHeader
              title='책서랍'
              href='/bookshelf'
            />
            <div className='grid grid-cols-4 gap-3'>
              {books.map((post) => {
                const bookTitle = getBookTitle(post.meta.title)
                const cover = post.meta.cover ?? post.meta.thumbnail

                return (
                  <Link
                    key={post.slug}
                    href={`/${post.slug}`}
                    title={bookTitle}
                    className='group relative block aspect-[2/3] overflow-hidden rounded-r-md rounded-l-sm border border-border bg-muted shadow-[inset_4px_0_0_rgb(0_0_0/0.08)] transition-transform hover:-translate-y-1'
                  >
                    {cover ? (
                      <Image
                        src={cover}
                        alt={bookTitle}
                        fill
                        sizes='(min-width: 768px) 90px, 25vw'
                        className='object-cover'
                      />
                    ) : (
                      <span className='absolute inset-0 p-2 pl-3 text-[11px] font-medium leading-tight text-foreground/80 line-clamp-6 break-keep'>
                        {bookTitle}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
