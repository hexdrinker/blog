import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PostThumbnailProps {
  src?: string | null
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}

// 썸네일은 대부분 3:2(1536×1024)로 만든다
export function PostThumbnail({
  src,
  alt,
  sizes,
  priority,
  className,
}: PostThumbnailProps) {
  return (
    <div
      className={cn(
        'relative aspect-[3/2] overflow-hidden rounded-lg border border-border bg-muted',
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
        />
      ) : (
        <span className='absolute inset-0 flex items-center justify-center text-xs text-muted-foreground'>
          hexdrinker
        </span>
      )}
    </div>
  )
}
