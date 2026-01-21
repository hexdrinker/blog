import Link from 'next/link'

export function Footer() {
  return (
    <footer className='w-full mt-auto'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <p className='text-sm text-muted-foreground text-center'>
          &copy; {new Date().getFullYear()}{' '}
          <Link
            href='https://github.com/hexdrinker'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-foreground transition-colors'
          >
            hexdrinker
          </Link>
        </p>
        <p className='text-sm text-muted-foreground text-center'>
          Hosted By Vercel
        </p>
      </div>
    </footer>
  )
}
