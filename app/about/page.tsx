import type { Metadata } from 'next'
import Link from 'next/link'
import { getAuthor } from '@/lib/authors'
import { Mail, Github, Linkedin, Rss } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'hexdrinker에 대해서',
}

const SOCIAL_LINKS = [
  {
    name: 'Email',
    href: 'mailto:hexdrinker2020@gmail.com',
    icon: Mail,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/hexdrinker',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/hexdrinker',
    icon: Linkedin,
  },
  {
    name: 'RSS',
    href: '/feed.xml',
    icon: Rss,
  },
]

export default function AboutPage() {
  const author = getAuthor('hexdrinker')

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <header className='mb-12 text-center'>
        {author && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={author.image_url}
              alt={author.name}
              className='w-32 h-32 rounded-full mx-auto mb-6'
            />
            <h1 className='text-3xl font-bold mb-2'>{author.name}</h1>
            <p className='text-lg text-muted-foreground mb-6'>{author.title}</p>
            <div className='flex items-center justify-center gap-4'>
              {SOCIAL_LINKS.map((link) => {
                const isInternal =
                  !link.href.startsWith('http') &&
                  !link.href.startsWith('mailto:') &&
                  !link.href.endsWith('.xml')

                const linkClassName =
                  'w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:border-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-800'

                if (isInternal) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={linkClassName}
                      aria-label={link.name}
                    >
                      <link.icon
                        size={20}
                        strokeWidth={1.5}
                      />
                    </Link>
                  )
                }

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={
                      link.href.startsWith('mailto:') ? undefined : '_blank'
                    }
                    rel={
                      link.href.startsWith('mailto:')
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className={linkClassName}
                    aria-label={link.name}
                  >
                    <link.icon
                      size={20}
                      strokeWidth={1.5}
                    />
                  </a>
                )
              })}
            </div>
          </>
        )}
      </header>
    </div>
  )
}
