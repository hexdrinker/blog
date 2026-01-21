'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface ViewCounterProps {
  slug: string
  trackView?: boolean
}

export function ViewCounter({ slug, trackView = true }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null)
  const [isConfigured, setIsConfigured] = useState(true)

  useEffect(() => {
    const fetchViews = async () => {
      const res = await fetch(`/api/views/${slug}`, {
        method: trackView ? 'POST' : 'GET',
      })
      const data = await res.json()

      if (data.views === null) {
        setIsConfigured(false)
      } else {
        setViews(data.views)
      }
    }

    fetchViews()
  }, [slug, trackView])

  if (!isConfigured) {
    return null
  }

  return (
    <span className='flex items-center gap-1'>
      <Eye className='w-4 h-4' />
      <span>{views !== null ? views.toLocaleString() : '-'}</span>
    </span>
  )
}
