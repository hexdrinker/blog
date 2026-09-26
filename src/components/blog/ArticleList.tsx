import Link from 'next/link'
import { format } from 'date-fns'
import type { Post } from '@/types/post'
import { PostThumbnail } from './PostThumbnail'

const CARD_CLASS_NAME =
  'group overflow-hidden rounded-xl border border-foreground/10 bg-background/60 backdrop-blur-sm transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-lg'

function PostMeta({ post }: { post: Post }) {
  return (
    <p className='text-xs text-muted-foreground tabular-nums'>
      {format(new Date(post.meta.date), 'yyyy.MM.dd')} · {post.meta.readingTime}
    </p>
  )
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/${post.slug}`}
      className={`flex flex-col sm:flex-row ${CARD_CLASS_NAME}`}
    >
      <PostThumbnail
        src={post.meta.thumbnail}
        alt={post.meta.title}
        sizes='(min-width: 640px) 368px, 100vw'
        className='shrink-0 rounded-none border-0 border-b border-foreground/10 sm:w-1/2 sm:border-b-0 sm:border-r'
        priority
      />
      {/* 제목·발췌는 위, 날짜는 카드 아래에 붙인다 */}
      <div className='flex min-w-0 flex-1 flex-col justify-between gap-4 p-5'>
        <div>
          <span className='inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary'>
            Latest
          </span>
          <h2 className='mt-2.5 text-lg font-bold leading-snug tracking-tight text-balance group-hover:text-primary transition-colors'>
            {post.meta.title}
          </h2>
          <p className='mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3'>
            {post.excerpt}
          </p>
        </div>
        <PostMeta post={post} />
      </div>
    </Link>
  )
}

function ArticleCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/${post.slug}`}
      className={`flex flex-col sm:flex-row ${CARD_CLASS_NAME}`}
    >
      <PostThumbnail
        src={post.meta.thumbnail}
        alt={post.meta.title}
        sizes='(min-width: 640px) 208px, 100vw'
        className='shrink-0 rounded-none border-0 border-b border-foreground/10 sm:w-52 sm:border-b-0 sm:border-r'
      />
      <div className='flex min-w-0 flex-1 flex-col justify-between gap-3 px-5 py-4'>
        <div className='space-y-1'>
          <h3 className='text-[15px] font-semibold leading-snug group-hover:text-primary transition-colors'>
            {post.meta.title}
          </h3>
          {post.meta.description && (
            <p className='text-[13px] leading-relaxed text-muted-foreground line-clamp-2'>
              {post.meta.description}
            </p>
          )}
        </div>
        <PostMeta post={post} />
      </div>
    </Link>
  )
}

interface ArticleListProps {
  posts: Post[]
  featureFirst?: boolean
}

export function ArticleList({ posts, featureFirst = false }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-muted-foreground'>아직 작성된 글이 없습니다.</p>
      </div>
    )
  }

  const [first, ...rest] = posts
  const listPosts = featureFirst ? rest : posts

  return (
    <div className='flex flex-col gap-3'>
      {featureFirst && (
        <div className='mb-3'>
          <FeaturedCard post={first} />
        </div>
      )}
      {listPosts.map((post) => (
        <ArticleCard
          key={post.slug}
          post={post}
        />
      ))}
    </div>
  )
}
