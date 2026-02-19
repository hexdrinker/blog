export const BLOG_CATEGORIES = [
  {
    key: 'tech',
    label: '개발',
    description: '개발 관련 글',
    badgeClassName:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300',
  },
  {
    key: 'series',
    label: '시리즈',
    description: '연속성을 갖고 이어나가는 모든 것',
    badgeClassName:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  {
    key: 'log',
    label: '기록',
    description: '기록, 회고, 또... 무언가',
    badgeClassName:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300',
  },
  {
    key: 'daily',
    label: '일상',
    description: '일상 속에서 지나간 생각들에 대하여',
    badgeClassName:
      'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/70 dark:bg-violet-950/40 dark:text-violet-300',
  },
  // {
  //   key: 'music',
  //   label: '음악',
  //   description: '내가 좋아하는 음악만 다루는 공간',
  // },
  {
    key: 'book',
    label: '독서',
    description: '책 좀 읽어라 으이그',
    badgeClassName:
      'border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-900/70 dark:bg-lime-950/40 dark:text-lime-300',
  },
  // {
  //   key: 'travel',
  //   label: '여행',
  //   description: '세계의 확장에 관한',
  // },
  // {
  //   key: 'movie',
  //   label: '영화',
  //   description: '영화 감상문',
  // },
  // {
  //   key: 'concert',
  //   label: '공연',
  //   description: '기쁨이 지나가기 전에',
  // },
] as const

export type BlogCategoryKey = (typeof BLOG_CATEGORIES)[number]['key']
export type BlogCategory = (typeof BLOG_CATEGORIES)[number]

export const BLOG_CATEGORY_MAP: ReadonlyMap<string, BlogCategory> = new Map(
  BLOG_CATEGORIES.map((category) => [category.key, category]),
)
