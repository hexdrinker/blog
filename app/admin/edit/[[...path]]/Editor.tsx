'use client'

import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { BLOG_CATEGORIES } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { previewPost, savePost } from '../../actions'

type Frontmatter = Record<string, unknown>

interface Props {
  base: string
  seriesSlugs: string[]
  initialPath?: string
  initialSha?: string
  initialFrontmatter: Frontmatter
  initialBody: string
}

interface Draft {
  frontmatter: Frontmatter
  tagsText: string
  body: string
  category: string
  series: string
  slug: string
}

const EXTENSIONS = [markdown(), EditorView.lineWrapping]
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

// content/series/{series}/{slug}.mdx 또는 content/{category}/{slug}.mdx
function splitPath(path?: string) {
  const parts = path?.replace(/^content\//, '').replace(/\.mdx$/, '').split('/') ?? []
  if (parts[0] === 'series') return { category: 'series', series: parts[1], slug: parts[2] }
  return { category: parts[0] ?? 'tech', series: '', slug: parts[1] ?? '' }
}

function toTags(text: string) {
  return text.split(',').map((tag) => tag.trim()).filter(Boolean)
}

export function Editor({
  base,
  seriesSlugs,
  initialPath,
  initialSha,
  initialFrontmatter,
  initialBody,
}: Props) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isNew = !initialPath
  const storageKey = `admin-draft:${initialPath ?? 'new'}`

  const [draft, setDraft] = useState<Draft>(() => ({
    frontmatter: initialFrontmatter,
    tagsText: ((initialFrontmatter.tags as unknown[]) ?? []).join(', '),
    body: initialBody,
    ...splitPath(initialPath),
  }))
  const [sha, setSha] = useState(initialSha)
  const [restorable, setRestorable] = useState<Draft | null>(null)
  const [message, setMessage] = useState('')
  const [view, setView] = useState<'write' | 'preview'>('write')
  const [preview, setPreview] = useState<ReactNode>(null)
  const [previewError, setPreviewError] = useState('')
  const [isSaving, startSaving] = useTransition()
  // 테마는 브라우저에서만 알 수 있어서 마운트 뒤에 편집기 테마를 정한다 (hydration 불일치 방지)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { frontmatter, body, category, series, slug } = draft
  const isDraft = frontmatter.draft !== false
  const id = category === 'series' ? `series/${series}/${slug}` : `${category}/${slug}`
  const path = `content/${id}.mdx`
  const date = String(frontmatter.date ?? '')

  function update(patch: Partial<Draft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      // 커밋 전 작성 내용은 브라우저에만 임시 저장한다
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  function setField(key: string, value: unknown) {
    update({ frontmatter: { ...frontmatter, [key]: value } })
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setRestorable(JSON.parse(saved))
    } catch {}
  }, [storageKey])

  // 입력이 멈추면 서버에서 실제 글과 같은 방식으로 렌더링한다
  const previewRequest = useRef(0)
  useEffect(() => {
    const request = ++previewRequest.current
    const timer = setTimeout(async () => {
      const result = await previewPost(body, id)
      if (request !== previewRequest.current) return
      if (result.ok) {
        setPreview(result.node)
        setPreviewError('')
      } else {
        setPreviewError(result.error)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [body, id])

  function save(draftValue: boolean) {
    startSaving(async () => {
      const nextFrontmatter = { ...frontmatter, tags: toTags(draft.tagsText), draft: draftValue }
      const result = await savePost({ path, frontmatter: nextFrontmatter, body, sha })
      if (!result.ok) {
        setMessage(result.error)
        return
      }
      try {
        localStorage.removeItem(storageKey)
      } catch {}
      setDraft((prev) => ({ ...prev, frontmatter: nextFrontmatter }))
      setSha(result.sha)
      setRestorable(null)
      setMessage(
        draftValue ? '임시 저장했습니다.' : '커밋했습니다. 배포까지 1~3분 걸립니다.',
      )
      if (isNew) router.replace(`${base}/edit/${id}`)
    })
  }

  // ⌘S / Ctrl+S: 현재 공개 상태 그대로 저장
  const saveRef = useRef(save)
  saveRef.current = save
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        saveRef.current(isDraft)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDraft])

  const inputClass = 'w-full rounded-md border bg-background px-3 py-1.5 text-sm'
  const buttonClass =
    'rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 whitespace-nowrap'

  return (
    <div className='mx-auto max-w-[1400px] space-y-4'>
      <div className='sticky top-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur'>
        <Link href={base || '/'} className='text-sm text-muted-foreground hover:underline'>
          ← 목록
        </Link>
        <span className='truncate font-mono text-sm text-muted-foreground'>{slug ? id : '새 글'}</span>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-xs',
            isDraft ? 'border-dashed text-muted-foreground' : 'border-emerald-500 text-emerald-600',
          )}
        >
          {isDraft ? 'draft' : '공개'}
        </span>
        <div className='ml-auto flex gap-2'>
          {isDraft ? (
            <>
              <button type='button' onClick={() => save(true)} disabled={isSaving} className={buttonClass}>
                임시 저장
              </button>
              <button
                type='button'
                onClick={() => save(false)}
                disabled={isSaving}
                className={cn(buttonClass, 'bg-foreground text-background hover:bg-foreground/90')}
              >
                발행
              </button>
            </>
          ) : (
            <>
              <button type='button' onClick={() => save(true)} disabled={isSaving} className={buttonClass}>
                비공개로 전환
              </button>
              <button
                type='button'
                onClick={() => save(false)}
                disabled={isSaving}
                className={cn(buttonClass, 'bg-foreground text-background hover:bg-foreground/90')}
              >
                저장
              </button>
            </>
          )}
        </div>
      </div>

      {isSaving && <p className='text-sm text-muted-foreground'>저장 중…</p>}
      {message && !isSaving && <p className='text-sm whitespace-pre-wrap'>{message}</p>}
      {restorable && (
        <p className='text-sm'>
          저장 안 된 임시 내용이 있습니다.{' '}
          <button
            type='button'
            className='underline'
            onClick={() => {
              setDraft(restorable)
              setRestorable(null)
            }}
          >
            복구
          </button>{' '}
          <button
            type='button'
            className='text-muted-foreground underline'
            onClick={() => {
              try {
                localStorage.removeItem(storageKey)
              } catch {}
              setRestorable(null)
            }}
          >
            버리기
          </button>
        </p>
      )}

      <div className='grid gap-3 sm:grid-cols-2'>
        <label className='space-y-1 sm:col-span-2'>
          <span className='text-xs text-muted-foreground'>제목</span>
          <input
            value={String(frontmatter.title ?? '')}
            onChange={(e) => setField('title', e.target.value)}
            className={cn(inputClass, 'text-base font-medium')}
          />
        </label>
        <label className='space-y-1 sm:col-span-2'>
          <span className='text-xs text-muted-foreground'>설명</span>
          <input
            value={String(frontmatter.description ?? '')}
            onChange={(e) => setField('description', e.target.value)}
            className={inputClass}
          />
        </label>
        <label className='space-y-1'>
          <span className='text-xs text-muted-foreground'>카테고리</span>
          <select
            value={category}
            onChange={(e) => update({ category: e.target.value })}
            disabled={!isNew}
            className={inputClass}
          >
            {BLOG_CATEGORIES.map(({ key, label }) => (
              <option key={key} value={key}>
                {label} ({key})
              </option>
            ))}
          </select>
        </label>
        {category === 'series' && (
          <label className='space-y-1'>
            <span className='text-xs text-muted-foreground'>시리즈 (폴더명)</span>
            <input
              value={series}
              onChange={(e) => update({ series: e.target.value })}
              readOnly={!isNew}
              list='series-slugs'
              className={inputClass}
            />
            <datalist id='series-slugs'>
              {seriesSlugs.map((seriesSlug) => (
                <option key={seriesSlug} value={seriesSlug} />
              ))}
            </datalist>
          </label>
        )}
        <label className='space-y-1'>
          <span className='text-xs text-muted-foreground'>slug (영문 소문자, 숫자, -)</span>
          <input
            value={slug}
            onChange={(e) => update({ slug: e.target.value })}
            readOnly={!isNew}
            placeholder='my-new-post'
            className={cn(inputClass, 'font-mono read-only:opacity-60')}
          />
        </label>
        <label className='space-y-1'>
          <span className='text-xs text-muted-foreground'>날짜</span>
          <input
            type={DATE_PATTERN.test(date) || !date ? 'datetime-local' : 'text'}
            value={date}
            onChange={(e) => setField('date', e.target.value)}
            className={inputClass}
          />
        </label>
        <label className='space-y-1'>
          <span className='text-xs text-muted-foreground'>태그 (쉼표로 구분)</span>
          <input
            value={draft.tagsText}
            onChange={(e) => update({ tagsText: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className='space-y-1 sm:col-span-2'>
          <span className='text-xs text-muted-foreground'>
            썸네일 (파일명은 {slug ? id : `${category}/{slug}`}/ 기준, 또는 전체 URL)
          </span>
          <input
            value={String(frontmatter.thumbnail ?? '')}
            onChange={(e) => setField('thumbnail', e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className='flex gap-2 lg:hidden'>
        {(['write', 'preview'] as const).map((key) => (
          <button
            key={key}
            type='button'
            onClick={() => setView(key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm',
              view === key ? 'bg-foreground text-background' : 'hover:bg-muted',
            )}
          >
            {key === 'write' ? '작성' : '미리보기'}
          </button>
        ))}
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <div className={cn('min-w-0 overflow-hidden rounded-md border', view !== 'write' && 'hidden lg:block')}>
          <CodeMirror
            value={body}
            onChange={(value) => update({ body: value })}
            extensions={EXTENSIONS}
            theme={mounted && resolvedTheme === 'dark' ? 'dark' : 'light'}
            basicSetup={{ lineNumbers: false, foldGutter: false, highlightActiveLine: false }}
            minHeight='70vh'
            className='text-sm'
          />
        </div>
        <div
          className={cn(
            'min-w-0 rounded-md border px-6 py-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:sticky lg:top-20',
            view !== 'preview' && 'hidden lg:block',
          )}
        >
          {previewError && (
            <p className='mb-4 rounded-md border border-red-300 bg-red-50 p-2 text-xs whitespace-pre-wrap text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300'>
              {previewError}
            </p>
          )}
          <h1 className='mb-6 text-3xl font-bold tracking-tight'>
            {String(frontmatter.title || '제목 없음')}
          </h1>
          <div className='prose dark:prose-invert max-w-none'>{preview}</div>
        </div>
      </div>
    </div>
  )
}
