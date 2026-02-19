import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='max-w-3xl mx-auto px-4 py-24 text-center'>
      <h1 className='text-6xl font-bold text-muted-foreground mb-4'>404</h1>
      <h2 className='text-xl font-medium mb-2'>페이지를 찾을 수 없습니다</h2>
      <p className='text-muted-foreground mb-8'>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href='/'
        className='inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m12 19-7-7 7-7' />
          <path d='M19 12H5' />
        </svg>
        홈으로 돌아가기
      </Link>
    </div>
  )
}
