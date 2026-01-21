'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useTheme } from 'next-themes'
import type { Post } from '@/types/post'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { meta, slug } = post
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 서버와 클라이언트 초기 렌더링 시 동일한 값을 사용하여 hydration mismatch 방지
  const placeholderSrc =
    mounted && resolvedTheme === 'light'
      ? '/img/placeholder-light.svg'
      : '/img/placeholder.svg'

  return (
    <Link
      href={`/${slug}`}
      className='group block'
    >
      <article className='rounded-lg border border-border overflow-hidden hover:border-foreground/20 transition-colors'>
        <div className='aspect-[3/2] bg-muted relative overflow-hidden'>
          <Image
            src={meta.thumbnail || placeholderSrc}
            alt={meta.title}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>
        <div className='p-4'>
          <h2 className='text-lg font-medium group-hover:text-primary transition-colors line-clamp-2'>
            {meta.title}
          </h2>
          <p className='text-muted-foreground text-sm mt-2 line-clamp-2'>
            {meta.description}
          </p>
          <time
            dateTime={meta.date}
            className='text-xs text-muted-foreground mt-3 block'
          >
            {format(new Date(meta.date), 'MMM dd, yyyy', { locale: enUS })}
          </time>
        </div>
      </article>
    </Link>
  )
}
