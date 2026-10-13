'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { savePost } from '../../actions'

interface Props {
  initialPath?: string
  initialText: string
  initialSha?: string
}

export function Editor({ initialPath, initialText, initialSha }: Props) {
  const router = useRouter()
  const isNew = !initialPath
  const storageKey = `admin-draft:${initialPath ?? 'new'}`

  const [path, setPath] = useState(initialPath ?? 'content/tech/')
  const [text, setText] = useState(initialText)
  const [sha, setSha] = useState(initialSha)
  const [restorable, setRestorable] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isSaving, startSaving] = useTransition()

  // 커밋 전 작성 내용은 브라우저에만 임시 저장한다
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved && saved !== initialText) setRestorable(saved)
    } catch {}
  }, [storageKey, initialText])

  function handleChange(value: string) {
    setText(value)
    try {
      localStorage.setItem(storageKey, value)
    } catch {}
  }

  function handleSave() {
    startSaving(async () => {
      const result = await savePost(path, text, sha)
      if (!result.ok) {
        setMessage(result.error)
        return
      }
      try {
        localStorage.removeItem(storageKey)
      } catch {}
      setSha(result.sha)
      setMessage('커밋했습니다. 배포까지 1~3분 걸립니다.')
      if (isNew) {
        router.replace(`/edit/${path.replace(/^content\//, '').replace(/\.mdx$/, '')}`)
      }
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-3'>
        <Link href='/' className='text-sm text-muted-foreground hover:underline'>
          ← 목록
        </Link>
        <button
          type='button'
          onClick={handleSave}
          disabled={isSaving}
          className='rounded-md border px-4 py-1.5 text-sm hover:bg-muted disabled:opacity-50'
        >
          {isSaving ? '저장 중…' : '저장'}
        </button>
      </div>

      <label className='block text-sm'>
        <span className='text-muted-foreground'>경로</span>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          readOnly={!isNew}
          placeholder='content/tech/my-post.mdx'
          className='mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono read-only:opacity-60'
        />
      </label>

      {restorable && (
        <p className='text-sm'>
          저장 안 된 임시 내용이 있습니다.{' '}
          <button
            type='button'
            className='underline'
            onClick={() => {
              setText(restorable)
              setRestorable(null)
            }}
          >
            복구
          </button>
        </p>
      )}

      {message && <p className='text-sm whitespace-pre-wrap'>{message}</p>}

      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
        className='w-full min-h-[70vh] rounded-md border bg-background p-4 font-mono text-sm leading-relaxed'
      />
    </div>
  )
}
