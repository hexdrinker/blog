import { resolveImageUrl } from './img'

interface ResolvedImageItem {
  src: string
  alt: string
}

interface ImageListProps {
  src1?: string
  alt1?: string
  src2?: string
  alt2?: string
  caption?: string
  gap?: string
}

function getImageItems(
  { src1, alt1, src2, alt2 }: ImageListProps,
  basePath?: string
): ResolvedImageItem[] {
  const rawItems = [
    { src: src1, alt: alt1 ?? '' },
    { src: src2, alt: alt2 ?? '' },
  ]

  return rawItems
    .filter((item): item is { src: string; alt: string } => Boolean(item.src))
    .map((item) => ({
      src: basePath ? resolveImageUrl(item.src, basePath) : item.src,
      alt: item.alt,
    }))
}

function renderImageList({
  images,
  caption,
  gap = 'gap-4',
}: {
  images: ResolvedImageItem[]
  caption?: string
  gap?: string
}) {
  const gridColumnsClass = images.length <= 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'

  return (
    <figure className='my-4 flex flex-col items-center'>
      <div className={`grid w-full ${gridColumnsClass} ${gap}`}>
        {images.map((image, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className='block w-full h-auto rounded-lg object-contain'
          />
        ))}
      </div>
      {caption && (
        <figcaption className='mt-2 text-sm text-muted-foreground text-center'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * basePath를 주입받아 ImageList 컴포넌트를 생성하는 팩토리 함수
 */
export function createImageList(basePath: string) {
  return function ImageList(props: ImageListProps) {
    const images = getImageItems(props, basePath)

    return renderImageList({
      images,
      caption: props.caption,
      gap: props.gap,
    })
  }
}

/**
 * 기본 ImageList 컴포넌트 (basePath 없이 사용, 기존 호환성 유지)
 */
export function ImageList(props: ImageListProps) {
  const images = getImageItems(props)

  return renderImageList({
    images,
    caption: props.caption,
    gap: props.gap,
  })
}
