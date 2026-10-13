import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getPostFile, POST_PATH_PATTERN } from '@/lib/github-content'
import { Editor } from './Editor'

interface Props {
  params: Promise<{ path?: string[] }>
}

function newPostTemplate() {
  // 기존 글들과 같은 'YYYY-MM-DDTHH:mm'(KST) 형식
  const now = new Date()
    .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
    .slice(0, 16)
    .replace(' ', 'T')
  return `---\ndate: ${now}\ntitle: \ndescription: \ntags: []\ndraft: true\n---\n\n`
}

export default async function EditPage({ params }: Props) {
  const { base } = await requireAdmin()
  const { path: segments } = await params

  if (!segments) {
    return <Editor base={base} initialText={newPostTemplate()} />
  }

  const path = `content/${segments.join('/')}.mdx`
  if (!POST_PATH_PATTERN.test(path)) notFound()

  const { text, sha } = await getPostFile(path)
  return <Editor base={base} initialPath={path} initialText={text} initialSha={sha} />
}
