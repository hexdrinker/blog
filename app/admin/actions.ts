'use server'

import matter from 'gray-matter'
import { parse } from 'yaml'
import { requireAdmin } from '@/lib/auth'
import {
  GitHubConflictError,
  POST_PATH_PATTERN,
  putPostFile,
} from '@/lib/github-content'
import { postSchema } from '@/lib/post-schema'

type SaveResult = { ok: true; sha: string } | { ok: false; error: string }

export async function savePost(
  path: string,
  text: string,
  sha?: string,
): Promise<SaveResult> {
  await requireAdmin()

  if (!POST_PATH_PATTERN.test(path)) {
    return { ok: false, error: `경로 형식이 잘못됐습니다: ${path}` }
  }

  // content-collections와 같은 방식(yaml 패키지)으로 frontmatter를 읽어서 빌드 전에 미리 검증한다
  let data: unknown
  try {
    data = matter(text, { engines: { yaml: { parse } } }).data
  } catch (error) {
    return { ok: false, error: `frontmatter YAML 오류: ${(error as Error).message}` }
  }
  const parsed = postSchema.safeParse(data)
  if (!parsed.success) {
    return { ok: false, error: `frontmatter 검증 실패: ${parsed.error.message}` }
  }

  try {
    return { ok: true, sha: await putPostFile(path, text, sha) }
  } catch (error) {
    if (error instanceof GitHubConflictError) {
      return { ok: false, error: error.message }
    }
    throw error
  }
}
