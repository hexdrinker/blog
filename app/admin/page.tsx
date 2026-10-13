import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { listPostPaths } from '@/lib/github-content'

export default async function AdminPage() {
  await requireAdmin()
  const paths = await listPostPaths()

  return (
    <>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>글 관리</h1>
        <Link href='/edit' className='rounded-md border px-3 py-1.5 text-sm hover:bg-muted'>
          새 글
        </Link>
      </div>
      <ul className='space-y-1 text-sm'>
        {paths.map((path) => {
          const id = path.replace(/^content\//, '').replace(/\.mdx$/, '')
          return (
            <li key={path}>
              <Link href={`/edit/${id}`} className='hover:underline'>
                {id}
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
