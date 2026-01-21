'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

const postCategories = [
  { name: 'Tech', href: '/tech', description: '기술 관련 글' },
  { name: 'Essay', href: '/essay', description: '에세이' },
  { name: 'Interest', href: '/interest', description: '관심사' },
]

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className='w-full'>
      <div className='max-w-6xl mx-auto px-4 h-14 flex items-center justify-between'>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className='md:hidden w-9 h-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors'
          aria-label='Open menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line
              x1='4'
              x2='20'
              y1='12'
              y2='12'
            />
            <line
              x1='4'
              x2='20'
              y1='6'
              y2='6'
            />
            <line
              x1='4'
              x2='20'
              y1='18'
              y2='18'
            />
          </svg>
        </button>

        <Link
          href='/'
          className='flex items-center'
        >
          <Image
            src='/img/logos/hexdrinker-256.png'
            alt='hexdrinker'
            width={32}
            height={32}
            className='rounded-full'
          />
        </Link>

        {/* Desktop navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          {/* Post dropdown */}
          <div
            className='relative'
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className='text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Post
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={`transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              >
                <path d='m6 9 6 6 6-6' />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className='absolute top-full left-0 pt-1 z-50'>
                <div className='w-48 bg-popover border border-border rounded-md shadow-lg py-1'>
                  {postCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className='block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href='/about'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            About
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile theme toggle */}
        <div className='md:hidden'>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile side navigation */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/50 z-40 md:hidden'
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Side panel */}
          <div className='fixed inset-y-0 left-0 w-64 bg-background border-r border-border z-50 md:hidden'>
            <div className='flex items-center justify-between h-14 px-4 border-b border-border'>
              <span className='font-semibold'>Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className='w-9 h-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors'
                aria-label='Close menu'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 6 6 18' />
                  <path d='m6 6 12 12' />
                </svg>
              </button>
            </div>

            <nav className='p-4'>
              <div className='space-y-1'>
                <div className='text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2'>
                  Post
                </div>
                {postCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-2 py-2 text-sm rounded-md transition-colors ${
                      pathname === category.href
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className='border-t border-border my-4' />

              <div className='space-y-1'>
                <Link
                  href='/about'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-2 py-2 text-sm rounded-md transition-colors ${
                    pathname === '/about'
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  About
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
