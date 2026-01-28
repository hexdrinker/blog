interface ImgProps {
  src: string
  alt?: string
  caption?: string
  width?: string
}

export function Img({ src, alt = '', caption, width = '100%' }: ImgProps) {
  return (
    <figure className='my-4 flex flex-col items-center'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        className='rounded-lg max-w-full h-auto'
      />
      {caption && (
        <figcaption className='mt-2 text-sm text-muted-foreground'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
