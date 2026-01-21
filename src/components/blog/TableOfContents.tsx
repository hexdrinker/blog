'use client'

import { useEffect, useState } from 'react'
import GithubSlugger from 'github-slugger'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: TocItem[] = []
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = slugger.slug(text)

    headings.push({ id, text, level })
  }

  return headings
}

function TocList({
  headings,
  activeId,
  onItemClick,
}: {
  headings: TocItem[]
  activeId: string
  onItemClick?: () => void
}) {
  return (
    <ul className='space-y-2 text-sm'>
      {headings.map(({ id, text, level }) => (
        <li key={id} style={{ paddingLeft: `${(level - 2) * 12}px` }}>
          <a
            href={`#${id}`}
            className={cn(
              'block py-1 text-muted-foreground hover:text-foreground transition-colors',
              activeId === id && 'text-foreground font-medium'
            )}
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById(id)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
                onItemClick?.()
              }
            }}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const headings = extractHeadings(content)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav>
      <h2 className='text-sm font-semibold mb-4 text-foreground'>목차</h2>
      <TocList headings={headings} activeId={activeId} />
    </nav>
  )
}

export function MobileTableOfContents({ content }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const headings = extractHeadings(content)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className='xl:hidden mb-8'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-between w-full px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors'
      >
        <span>목차</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        )}
      >
        <div className='px-4 py-3 bg-muted/30 rounded-lg overflow-y-auto max-h-80'>
          <TocList
            headings={headings}
            activeId={activeId}
            onItemClick={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
