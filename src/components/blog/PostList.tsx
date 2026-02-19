import { PostCard } from './PostCard'
import type { Post } from '@/types/post'

interface PostListProps {
  posts: Post[]
  showCategory?: boolean
}

export function PostList({ posts, showCategory = false }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-muted-foreground'>아직 작성된 글이 없습니다.</p>
      </div>
    )
  }

  return (
    <ul className='divide-y divide-border border-y border-border'>
      {posts.map((post) => (
        <li key={post.slug}>
          <PostCard
            post={post}
            showCategory={showCategory}
          />
        </li>
      ))}
    </ul>
  )
}
