const IMAGE_BASE_URL = 'https://images.hexdrinker.dev'

interface ImgProps {
  src: string
  alt?: string
  caption?: string
  width?: string
}

/**
 * 이미지 URL을 조합합니다.
 * - http(s)로 시작하면 그대로 반환
 * - 그렇지 않으면 basePath와 조합하여 전체 URL 생성
 */
export function resolveImageUrl(src: string, basePath?: string): string {
  if (src.startsWith('http')) {
    return src
  }

  if (!basePath) {
    return src
  }

  // 슬래시 정규화: basePath 끝과 src 시작의 슬래시 중복 제거
  const normalizedBasePath = basePath.replace(/\/$/, '')
  const normalizedSrc = src.replace(/^\//, '')

  return `${IMAGE_BASE_URL}/${normalizedBasePath}/${normalizedSrc}`
}

/**
 * basePath를 주입받아 Img 컴포넌트를 생성하는 팩토리 함수
 * MDX 렌더링 시 현재 문서 경로를 기반으로 이미지 URL을 자동 조합합니다.
 */
export function createImg(basePath: string) {
  return function Img({ src, alt = '', caption, width = '100%' }: ImgProps) {
    const resolvedSrc = resolveImageUrl(src, basePath)

    return (
      <figure className='my-4 flex flex-col items-center'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
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
}

/**
 * 기본 Img 컴포넌트 (basePath 없이 사용, 기존 호환성 유지)
 */
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
