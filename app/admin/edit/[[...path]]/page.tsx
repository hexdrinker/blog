import { notFound } from 'next/navigation'
import matter from 'gray-matter'
import { parse } from 'yaml'
import { allSeriesMetas } from 'content-collections'
import { requireAdmin } from '@/lib/auth'
import { getPostFile, POST_PATH_PATTERN } from '@/lib/github-content'
import { Editor } from './Editor'

interface Props {
  params: Promise<{ path?: string[] }>
}

function now() {
  // 기존 글들과 같은 'YYYY-MM-DDTHH:mm'(KST) 형식
  return new Date()
    .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
    .slice(0, 16)
    .replace(' ', 'T')
}

export default async function EditPage({ params }: Props) {
  const { base } = await requireAdmin()
  const { path: segments } = await params
  const seriesSlugs = allSeriesMetas.map((series) => series.slug)

  if (!segments) {
    return (
      <Editor
        base={base}
        seriesSlugs={seriesSlugs}
        initialFrontmatter={{ title: '', description: '', date: now(), tags: [], draft: true }}
        initialBody=''
      />
    )
  }

  const path = `content/${segments.join('/')}.mdx`
  if (!POST_PATH_PATTERN.test(path)) notFound()

  const { text, sha } = await getPostFile(path)
  // content-collections와 같은 방식(yaml 패키지)으로 읽는다
  const { data, content } = matter(text, { engines: { yaml: { parse } } })

  return (
    <Editor
      base={base}
      seriesSlugs={seriesSlugs}
      initialPath={path}
      initialSha={sha}
      initialFrontmatter={data}
      initialBody={content.replace(/^\n+/, '')}
    />
  )
}
