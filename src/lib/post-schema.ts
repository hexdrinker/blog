import { z } from 'zod'

// content-collections 빌드와 어드민 저장 검증이 같은 스키마를 쓴다
export const postSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  date: z.string(),
  tags: z.array(z.coerce.string()).default([]),
  draft: z.boolean().default(false),
  thumbnail: z.string().optional(),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
})
