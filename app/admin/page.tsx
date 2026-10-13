import Link from 'next/link'
import { allPosts } from 'content-collections'
import { requireAdmin } from '@/lib/auth'
import { listPostPaths } from '@/lib/github-content'
import { BLOG_CATEGORY_MAP } from '@/lib/categories'
import { PostThumbnail } from '@/components/blog/PostThumbnail'
import { cn } from '@/lib/utils'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'published', label: '공개' },
  { key: 'draft', label: 'Draft' },
] as const

type Filter = (typeof FILTERS)[number]['key']

interface Props {
  searchParams: Promise<{ filter?: string }>
}

export default async function AdminPage({ searchParams }: Props) {
  const { base } = await requireAdmin()
  const { filter: rawFilter } = await searchParams
  const filter: Filter = FILTERS.some((f) => f.key === rawFilter)
    ? (rawFilter as Filter)
    : 'all'

  // 파일 목록은 GitHub가 기준이고, 제목·썸네일 같은 메타는 마지막 빌드 결과에서 가져온다
  // 방금 저장해서 아직 빌드되지 않은 글은 meta 없이 '배포 대기'로 보인다
  const metaByPath = new Map(allPosts.map((post) => [`content/${post._meta.filePath}`, post]))
  const items = (await listPostPaths())
    .map((path) => ({
      path,
      id: path.replace(/^content\//, '').replace(/\.mdx$/, ''),
      meta: metaByPath.get(path),
    }))
    .sort((a, b) => (b.meta?.date ?? '9999').localeCompare(a.meta?.date ?? '9999'))

  const counts = {
    all: items.length,
    published: items.filter((item) => item.meta && !item.meta.draft).length,
    draft: items.filter((item) => item.meta?.draft).length,
  }
  const visible = items.filter((item) =>
    filter === 'all' ? true : filter === 'draft' ? item.meta?.draft : item.meta && !item.meta.draft,
  )

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>글 관리</h1>
        <Link
          href={`${base}/edit`}
          className='rounded-md border px-3 py-1.5 text-sm hover:bg-muted'
        >
          새 글
        </Link>
      </div>

      <nav className='flex gap-2 mb-4'>
        {FILTERS.map(({ key, label }) => (
          <Link
            key={key}
            href={key === 'all' ? base || '/' : `${base || '/'}?filter=${key}`}
            className={cn(
              'rounded-full border px-3 py-1 text-sm',
              filter === key ? 'bg-foreground text-background' : 'hover:bg-muted',
            )}
          >
            {label} <span className='opacity-60'>{counts[key]}</span>
          </Link>
        ))}
      </nav>

      <ul className='divide-y divide-border'>
        {visible.map(({ path, id, meta }) => {
          const category = BLOG_CATEGORY_MAP.get(meta?.category ?? '')
          return (
            <li key={path}>
              <Link href={`${base}/edit/${id}`} className='group flex gap-4 py-4'>
                <PostThumbnail
                  src={meta?.thumbnail ?? meta?.cover}
                  alt={meta?.title ?? id}
                  sizes='144px'
                  className='w-28 shrink-0 sm:w-36'
                />
                <div className='min-w-0 flex-1 space-y-1'>
                  <div className='flex flex-wrap items-center gap-2 text-xs'>
                    <span
                      className={cn(
                        'inline-flex h-5 items-center rounded border px-1.5',
                        category?.badgeClassName ?? 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      {category?.label ?? meta?.category ?? id.split('/')[0]}
                    </span>
                    {!meta ? (
                      <span className='text-muted-foreground'>배포 대기</span>
                    ) : meta.draft ? (
                      <span className='inline-flex h-5 items-center rounded border border-dashed px-1.5 text-muted-foreground'>
                        draft
                      </span>
                    ) : null}
                  </div>
                  <p className='font-medium truncate group-hover:underline'>
                    {meta?.title || id}
                  </p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {meta ? `${meta.date.slice(0, 10).replaceAll('-', '.')} · ${id}` : id}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
      {visible.length === 0 && (
        <p className='py-12 text-center text-sm text-muted-foreground'>글이 없습니다.</p>
      )}
    </div>
  )
}
