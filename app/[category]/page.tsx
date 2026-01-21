import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostsByCategory, getAllCategories } from '@/lib/posts'
import { PostList } from '@/components/blog'

const categoryMeta: Record<string, { title: string; description: string }> = {
  tech: { title: 'Tech', description: '기술 관련 글 모음' },
  essay: { title: 'Essay', description: '에세이 모음' },
  interest: { title: 'Interest', description: '관심사에 대한 글 모음' },
  retrospect: { title: 'Retrospect', description: '회고 글 모음' },
  wil: { title: 'WIL', description: 'Weekly I Learned' },
  experience: { title: 'Experience', description: '경험 공유' },
}

// 유효한 카테고리 목록
const validCategories = ['tech', 'essay', 'interest']

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const meta = categoryMeta[category]

  if (!validCategories.includes(category)) {
    return {}
  }

  return {
    title: meta?.title || category,
    description: meta?.description || `${category} 카테고리의 글 목록`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params

  // 유효하지 않은 카테고리는 404
  if (!validCategories.includes(category)) {
    notFound()
  }

  const posts = getPostsByCategory(category)
  const meta = categoryMeta[category]

  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <header className='mb-8'>
        <h1 className='text-2xl font-semibold tracking-tight mb-1'>
          {meta?.title || category}
        </h1>
        <p className='text-sm text-muted-foreground'>{posts.length}개의 글</p>
      </header>
      <PostList posts={posts} />
    </div>
  )
}
