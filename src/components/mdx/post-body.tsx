import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Options } from 'rehype-pretty-code'
import remarkCjkAdjacentStrong from 'remark-cjk-adjacent-strong'
import { mdxComponents } from './components'
import { createImg, createMarkdownImg } from './img'
import { createImageList } from './image-list'

const prettyCodeOptions: Options = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
}

// 글 페이지와 어드민 미리보기가 같은 렌더링을 쓴다
// imagePath는 이미지 상대 경로의 기준(예: 'tech/my-post')
export async function renderPostBody(source: string, imagePath: string) {
  const { content } = await compileMDX({
    source: source.replace(/<!--description-->/g, ''),
    components: {
      ...mdxComponents,
      Img: createImg(imagePath),
      ImageList: createImageList(imagePath),
      img: createMarkdownImg(imagePath),
    },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkCjkAdjacentStrong],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
      },
    },
  })
  return content
}

export async function PostBody({ source, imagePath }: { source: string; imagePath: string }) {
  return (
    <div className='prose dark:prose-invert max-w-none'>
      {await renderPostBody(source, imagePath)}
    </div>
  )
}
