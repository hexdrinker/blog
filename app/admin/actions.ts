'use server'

import { stringify } from 'yaml'
import type { ReactNode } from 'react'
import { requireAdmin } from '@/lib/auth'
import {
  GitHubConflictError,
  POST_PATH_PATTERN,
  putPostFile,
} from '@/lib/github-content'
import { postSchema } from '@/lib/post-schema'
import { renderPostBody } from '@/components/mdx/post-body'
import { createUploadUrl, IMAGE_TYPES } from '@/lib/s3-upload'

type SaveResult = { ok: true; sha: string } | { ok: false; error: string }

export async function savePost(input: {
  path: string
  frontmatter: Record<string, unknown>
  body: string
  sha?: string
}): Promise<SaveResult> {
  await requireAdmin()

  if (!POST_PATH_PATTERN.test(input.path)) {
    return { ok: false, error: `경로 형식이 잘못됐습니다: ${input.path}` }
  }

  // 빈 값은 frontmatter에 남기지 않는다 (thumbnail: '' 같은 값이 빌드에서 잘못 해석되지 않게)
  const frontmatter = Object.fromEntries(
    Object.entries(input.frontmatter).filter(([, value]) => value !== '' && value != null),
  )

  // 빌드(content-collections)와 같은 스키마로 미리 검증한다
  const parsed = postSchema.safeParse(frontmatter)
  if (!parsed.success) {
    return { ok: false, error: `frontmatter 검증 실패: ${parsed.error.message}` }
  }

  const text = `---\n${stringify(frontmatter)}---\n\n${input.body.replace(/^\n+/, '')}`

  try {
    return { ok: true, sha: await putPostFile(input.path, text, input.sha) }
  } catch (error) {
    if (error instanceof GitHubConflictError) {
      return { ok: false, error: error.message }
    }
    throw error
  }
}

type PreviewResult = { ok: true; node: ReactNode } | { ok: false; error: string }

export async function previewPost(body: string, imagePath: string): Promise<PreviewResult> {
  await requireAdmin()
  try {
    return { ok: true, node: await renderPostBody(body, imagePath) }
  } catch (error) {
    // 작성 중인 MDX는 자주 깨진다: 오류 메시지만 보여주고 마지막 미리보기는 유지한다
    return { ok: false, error: (error as Error).message }
  }
}

// 글 이미지 폴더: tech/my-post 또는 series/{series}/my-post (resolveImageUrl 규칙과 같다)
const IMAGE_DIR_PATTERN = /^(?:series\/[a-z0-9-]+|[a-z0-9-]+)\/[a-z0-9-]+$/

type UploadResult =
  | { ok: true; uploadUrl: string; fileName: string }
  | { ok: false; error: string }

export async function createImageUpload(
  dir: string,
  originalName: string,
  contentType: string,
): Promise<UploadResult> {
  await requireAdmin()

  if (!IMAGE_DIR_PATTERN.test(dir)) {
    return { ok: false, error: '카테고리와 slug를 먼저 정해 주세요.' }
  }
  if (!IMAGE_TYPES[contentType]) {
    return { ok: false, error: `올릴 수 없는 형식입니다: ${contentType || originalName}` }
  }

  // 원래 파일명을 살리되(한글 포함) 공백·특수문자는 -로 바꾼다
  // macOS는 한글 파일명을 자모 분리(NFD)로 넘기기도 해서 NFC로 맞춘다
  const baseName =
    originalName
      .normalize('NFC')
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}_-]+/gu, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'image'

  try {
    return { ok: true, ...(await createUploadUrl(dir, baseName, contentType)) }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}
