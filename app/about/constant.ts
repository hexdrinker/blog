import type { ActivityItem, CareerItem } from './types'

const CURRENT_WORK: CareerItem[] = [
  {
    company: '컬리',
    period: '2026.06 - current',
    href: 'https://kurly.com',
    team: '프로덕트웹개발1팀',
    role: 'Sr Frontend Engineer',
  },
]

const CAREERS: CareerItem[] = [
  {
    company: '알고케어',
    period: '2024.08 - 2026.01',
    href: 'https://algocare.ai',
    team: 'SW Part',
    role: 'Frontend Engineer',
  },
  {
    company: '백패커',
    period: '2020.06 - 2024.02',
    href: 'https://idus.com',
    team: 'WebPlatform Cell',
    role: 'Frontend Engineer',
  },
  {
    company: '젤리랩',
    period: '2018.09 - 2019.05',
    team: 'SW Development Team',
    role: 'Frontend Engineer',
  },
  {
    company: '인크로스',
    period: '2017.12 - 2018.07',
    href: 'https://incross.com',
    team: 'AD Platform Development Team',
    role: 'Intern',
  },
]

const ACTIVITIES: ActivityItem[] = [
  {
    title: 'use-funnel 오픈소스 컨트리뷰트',
    period: '2025.09',
    href: 'https://github.com/toss/use-funnel/pull/172',
  },
  {
    title: '스튜디오 불티 Frontend Engineer',
    period: '2024.05 - current',
    href: 'https://boolti.in',
  },
  {
    title: 'BCSD Lab Frontend Track Mentor',
    period: '2020.03 - 2020.12',
  },
  {
    title: 'D&D Organizer',
    period: '2019.07 - current',
    href: 'https://dnd.ac',
  },
]

export { CURRENT_WORK, CAREERS, ACTIVITIES }
