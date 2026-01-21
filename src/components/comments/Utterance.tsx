'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

interface Props {
  className?: string
}

export function Utterance({ className }: Props) {
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }

    const container = containerRef.current
    if (!container) return

    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light'

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', 'hexdrinker/blog')
    script.setAttribute('issue-term', 'title')
    script.setAttribute('theme', theme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    container.appendChild(script)
  }, [resolvedTheme])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light'

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', 'hexdrinker/blog')
    script.setAttribute('issue-term', 'title')
    script.setAttribute('theme', theme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    container.appendChild(script)
  }, [])

  return <div ref={containerRef} className={className} />
}
