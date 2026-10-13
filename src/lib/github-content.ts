const REPO = process.env.GITHUB_CONTENT_REPO ?? 'hexdrinker/blog'
const BRANCH = process.env.GITHUB_CONTENT_BRANCH ?? 'main'
const API = `https://api.github.com/repos/${REPO}`

// content/{category}/{slug}.mdx 또는 content/series/{series}/{slug}.mdx만 허용한다
// 시리즈 index.mdx는 스키마가 달라서 제외
export const POST_PATH_PATTERN =
  /^content\/(?:series\/[a-z0-9-]+|(?!series\/)[a-z0-9-]+)\/(?!index\.mdx$)[a-z0-9-]+\.mdx$/

export class GitHubConflictError extends Error {}

async function github(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_CONTENT_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...init?.headers,
    },
  })
  // sha가 원격과 다르면 409(또는 422)로 온다: 다른 곳에서 먼저 수정된 것
  if (res.status === 409 || (res.status === 422 && init?.method === 'PUT')) {
    throw new GitHubConflictError('이미 있는 파일이거나 다른 곳에서 먼저 수정됐습니다. 새로고침 후 다시 저장하세요.')
  }
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

export async function listPostPaths(): Promise<string[]> {
  const tree: { tree: { path: string; type: string }[] } = await github(
    `/git/trees/${BRANCH}?recursive=1`,
  )
  return tree.tree
    .filter((item) => item.type === 'blob' && POST_PATH_PATTERN.test(item.path))
    .map((item) => item.path)
    .sort()
}

export async function getPostFile(path: string) {
  const file: { content: string; sha: string } = await github(
    `/contents/${path}?ref=${BRANCH}`,
  )
  return {
    text: Buffer.from(file.content, 'base64').toString('utf8'),
    sha: file.sha,
  }
}

export async function putPostFile(path: string, text: string, sha?: string) {
  const result: { content: { sha: string } } = await github(`/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `${sha ? 'chore(content): update' : 'chore(content): add'} ${path.replace(/^content\//, '')}`,
      content: Buffer.from(text, 'utf8').toString('base64'),
      branch: BRANCH,
      ...(sha && { sha }),
    }),
  })
  return result.content.sha
}
