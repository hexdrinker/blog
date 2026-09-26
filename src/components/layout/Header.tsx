'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Github, Linkedin, Rss } from 'lucide-react'
import { BLOG_CATEGORIES } from '@/lib/categories'
import { ThemeToggle } from './ThemeToggle'
import { Search, type SearchItem } from './Search'

const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/hexdrinker', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/hexdrinker', icon: Linkedin },
  { name: 'RSS', href: '/feed.xml', icon: Rss },
]

const POST_MENU_ITEMS = [
  ...BLOG_CATEGORIES.map(({ key }) => ({
    key,
    name: key[0].toUpperCase() + key.slice(1),
    href: `/${key}`,
  })),
]

export function Header({ searchItems }: { searchItems: SearchItem[] }) {
  const pathname = usePathname()
  const isAbout = pathname.startsWith('/about')
  // 홈과 About을 뺀 나머지는 모두 글 목록·글 상세 페이지다
  const isPosts = pathname !== '/' && !isAbout
  const currentSection = pathname.split('/')[1]
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 페이지를 옮기면 메뉴를 닫는다
  useEffect(() => setIsMenuOpen(false), [pathname])

  // 터치 기기에서 메뉴 바깥을 누르면 닫는다
  useEffect(() => {
    if (!isMenuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isMenuOpen])

  const navLinkClassName = (isActive: boolean) =>
    `text-sm transition-colors ${
      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <header className='w-full'>
      <div className='max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-4 sm:gap-5'>
          <Link
            href='/'
            className='flex items-center shrink-0'
            aria-label='홈'
          >
            <Image
              src='/img/logos/hexdrinker-629.jpeg'
              alt='hexdrinker'
              width={32}
              height={32}
              className='rounded-full'
            />
          </Link>
          <nav className='flex items-center gap-4 sm:gap-5'>
            {/* 데스크톱은 hover·키보드 포커스, 터치 기기는 탭으로 연다 */}
            <div
              ref={menuRef}
              data-open={isMenuOpen}
              onMouseLeave={() => setIsMenuOpen(false)}
              className='group relative'
            >
              <button
                type='button'
                aria-expanded={isMenuOpen}
                aria-haspopup='true'
                onClick={() => setIsMenuOpen((open) => !open)}
                className={`flex items-center gap-0.5 cursor-pointer ${navLinkClassName(isPosts)}`}
              >
                Posts
                <ChevronDown className='w-3.5 h-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180 group-data-[open=true]:rotate-180' />
              </button>
              <div className='invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 group-data-[open=true]:visible group-data-[open=true]:opacity-100'>
                <ul className='min-w-32 rounded-md border border-foreground/10 bg-background/70 p-1 shadow-lg backdrop-blur-md'>
                  {POST_MENU_ITEMS.map(({ key, name, href }) => (
                    <li key={key}>
                      <Link
                        href={href}
                        onClick={(event) => event.currentTarget.blur()}
                        className={`block rounded px-3 py-1.5 text-sm transition-colors hover:bg-foreground/10 ${
                          currentSection === key
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href='/about'
              className={navLinkClassName(isAbout)}
            >
              About
            </Link>
          </nav>
        </div>

        <div className='flex items-center'>
          <Search items={searchItems} />
          {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={name}
              className='w-8 sm:w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors'
            >
              <Icon className='w-[18px] h-[18px]' />
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
