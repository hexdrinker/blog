interface YouTubeProps {
  /** YouTube 비디오 ID 또는 전체 URL */
  videoId: string
  /** 비디오 제목 (접근성용) */
  title?: string
  /** 비디오 너비 (기본값: 100%) */
  width?: string
  /** 비디오 높이 (기본값: 400px) */
  height?: string
  /** 시작 시간 (초 단위) */
  start?: number
}

/**
 * YouTube 비디오 ID 추출
 * 지원 형식:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - VIDEO_ID (직접 입력)
 */
function extractVideoId(input: string): string {
  // 이미 비디오 ID만 있는 경우
  if (!input.includes('/') && !input.includes('.')) {
    return input
  }

  // youtube.com/watch?v= 형식
  const watchMatch = input.match(/[?&]v=([^&]+)/)
  if (watchMatch) return watchMatch[1]

  // youtu.be/ 형식
  const shortMatch = input.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]

  // youtube.com/embed/ 형식
  const embedMatch = input.match(/embed\/([^?&]+)/)
  if (embedMatch) return embedMatch[1]

  return input
}

export function YouTube({
  videoId,
  title = 'YouTube video',
  width = '100%',
  height = '400',
  start,
}: YouTubeProps) {
  const id = extractVideoId(videoId)
  const embedUrl = `https://www.youtube.com/embed/${id}${start ? `?start=${start}` : ''}`

  return (
    <figure className='my-6 flex flex-col items-center'>
      <div
        className='relative w-full overflow-hidden rounded-lg'
        style={{ maxWidth: width === '100%' ? '100%' : width }}
      >
        <iframe
          width='100%'
          height={height}
          src={embedUrl}
          title={title}
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          className='aspect-video'
        />
      </div>
    </figure>
  )
}
