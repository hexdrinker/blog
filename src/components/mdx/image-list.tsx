interface ImageItem {
  src: string
  alt?: string
}

interface ImageListProps {
  images: ImageItem[]
  caption?: string
  gap?: string
}

export function ImageList({ images, caption, gap = 'gap-4' }: ImageListProps) {
  return (
    <figure className='my-4 flex flex-col items-center'>
      <div className={`flex flex-row flex-wrap justify-center ${gap}`}>
        {images.map((image, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={image.src}
            alt={image.alt || ''}
            className='rounded-lg max-w-full h-auto flex-1 min-w-0 object-cover'
            style={{ maxWidth: `${100 / images.length - 2}%` }}
          />
        ))}
      </div>
      {caption && (
        <figcaption className='-mt-4 text-sm text-muted-foreground text-center'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
