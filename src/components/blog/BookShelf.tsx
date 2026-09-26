import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types/post'

// 『책 제목』 — 부제 형태의 독후감 제목에서 책 제목만 꺼낸다
export function getBookTitle(title: string) {
  return title.match(/『(.+?)』/)?.[1] ?? title
}

// 입체 책: 속지(book-pages) 위에 표지가 얹혀 있고 hover하면 표지와 속지가 차례로 열린다
function Book({ post }: { post: Post }) {
  const bookTitle = getBookTitle(post.meta.title)
  const cover = post.meta.cover ?? post.meta.thumbnail

  return (
    <Link
      href={`/${post.slug}`}
      title={bookTitle}
      className='book'
    >
      <span className='book-body'>
        <span
          className='book-pages'
          aria-hidden='true'
        >
          <span className='book-leaf leaf-3' />
          <span className='book-leaf leaf-2' />
          <span className='book-leaf leaf-1' />
        </span>
        <span className='book-cover'>
          {cover ? (
            <Image
              src={cover}
              alt={bookTitle}
              fill
              sizes='(min-width: 768px) 170px, 45vw'
              className='object-cover'
            />
          ) : (
            <span className='absolute inset-0 bg-muted p-3 pl-5 text-sm font-medium leading-snug text-foreground/80 break-keep'>
              {bookTitle}
            </span>
          )}
          <span
            className='book-gutter'
            aria-hidden='true'
          />
          <span
            className='book-gloss'
            aria-hidden='true'
          />
        </span>
      </span>
    </Link>
  )
}

export function BookShelf({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-muted-foreground'>아직 작성된 글이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 items-start gap-2 md:grid-cols-4'>
      {posts.map((post) => (
        <Book
          key={post.slug}
          post={post}
        />
      ))}
    </div>
  )
}
