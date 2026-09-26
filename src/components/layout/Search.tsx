'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'

export interface SearchItem {
  title: string
  description: string
  href: string
  category: string
  date: string
  tags: string[]
}

const MAX_RESULTS = 8

function matches(item: SearchItem, query: string) {
  return [item.title, item.description, ...item.tags].some((text) =>
    text.toLowerCase().includes(query),
  )
}

export function Search({ items }: { items: SearchItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return items.filter((item) => matches(item, normalized)).slice(0, MAX_RESULTS)
  }, [items, query])

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        type='button'
        onClick={open}
        className='w-8 sm:w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer'
        aria-label='검색 (⌘K)'
      >
        <SearchIcon className='w-[18px] h-[18px]' />
      </button>

      {/* dialog가 ESC 닫기, 포커스 가두기를 처리한다 */}
      <dialog
        ref={dialogRef}
        onClose={() => setQuery('')}
        onClick={(event) => event.target === dialogRef.current && close()}
        className='m-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg rounded-lg border border-foreground/10 bg-background/80 p-0 backdrop-blur-xl text-foreground shadow-xl backdrop:bg-black/50'
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (results[0]) {
              close()
              router.push(results[0].href)
            }
          }}
          className='flex items-center gap-2 border-b border-border px-4'
        >
          <SearchIcon className='w-4 h-4 shrink-0 text-muted-foreground' />
          <input
            id='site-search'
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='제목, 설명, 태그로 검색'
            autoComplete='off'
            className='h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
          />
          <kbd className='text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5'>
            ESC
          </kbd>
        </form>

        {query.trim() && (
          <ul className='max-h-[50vh] overflow-y-auto p-2'>
            {results.length === 0 ? (
              <li className='px-3 py-6 text-center text-sm text-muted-foreground'>
                검색 결과가 없습니다.
              </li>
            ) : (
              results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className='block rounded-md px-3 py-2 hover:bg-foreground/10 focus-visible:bg-foreground/10 outline-none'
                  >
                    <span className='block text-sm truncate'>{item.title}</span>
                    <span className='block text-xs text-muted-foreground'>
                      {item.category} · {item.date}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </dialog>
    </>
  )
}
