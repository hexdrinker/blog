import { Github, Linkedin, Mail, Rss } from 'lucide-react'
import { ActivityItem, CareerItem, SocialLink, WorkItem } from './types'

const SOCIAL_LINKS = [
  {
    name: 'Email',
    href: 'mailto:hexdrinker2020@gmail.com',
    icon: Mail,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/hexdrinker',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/hexdrinker',
    icon: Linkedin,
  },
  {
    name: 'RSS',
    href: '/feed.xml',
    icon: Rss,
  },
] satisfies SocialLink[]

const WORKS: WorkItem[] = [
  {
    company: '알고케어',
    team: 'SW Part',
    role: 'Product Engineer',
    period: '2024.08 - 2026.01',
    companyIntro:
      '알고케어는 귀찮고 복잡한 건강 관리를 덜어내어 사람들이 진짜 하고 싶은 일에 몰두할 수 있게 돕는 웰니스 헬스케어 스타트업입니다.',
    contents: [
      {
        projectName: '알고케어 홈 커머스 아키텍처 설계 및 구축',
        description:
          'B2C 제품인 알고케어 홈의 디스펜서와 뉴트리션(영양제)의 판매를 위한 반응형 웹 커머스',
        links: {
          website: 'https://algocare.me',
        },
        images: [
          'https://images.hexdrinker.dev/about/algocare/algocare-commerce-1.png',
          'https://images.hexdrinker.dev/about/algocare/algocare-commerce-2.png',
          'https://images.hexdrinker.dev/about/algocare/algocare-commerce-3.png',
          'https://images.hexdrinker.dev/about/algocare/algocare-commerce-4.png',
        ],
        items: [
          'FSD(Feature Sliced Design) 기반의 아키텍처 설계',
          '인증·장바구니·주문·결제·환불 등 핵심 기능 구현',
          'AI 기반의 대화형 영양제 추천 및 구매 연계 플로우 구현',
          '인앱 브라우저(웹뷰) 내의 결제 지원, 이슈 대응',
          '코드 기반의 스펙/기획 문서 추출 및 검색 RAG 시스템 구현',
        ],
      },
      {
        projectName: '알고케어 홈 모바일 앱 개발',
        description: '',
        links: {
          playStore:
            'https://play.google.com/store/apps/details?id=com.algocare.algocarehome.mobile',
          appStore:
            'https://apps.apple.com/kr/app/%EC%95%8C%EA%B3%A0%EC%BC%80%EC%96%B4/id6755326889',
        },
        images: [
          'https://images.hexdrinker.dev/about/algocare/algocare-home-1.webp',
          'https://images.hexdrinker.dev/about/algocare/algocare-home-2.webp',
          'https://images.hexdrinker.dev/about/algocare/algocare-home-3.webp',
          'https://images.hexdrinker.dev/about/algocare/algocare-home-4.webp',
          'https://images.hexdrinker.dev/about/algocare/algocare-home-5.webp',
          'https://images.hexdrinker.dev/about/algocare/algocare-home-6.webp',
        ],
        items: [
          '클린 아키텍처 기반의 설계',
          '건강 데이터 연동 및 수동 입력, AI에게 알려주기 기능 개발',
          '프로그램·부스트팩 AI/수동 설정, 상한섭취량·제외영양제 기능 개발',
          '웹뷰로 커머스 결제 연동(앱투앱 스킴, 인증 상태 동기화)으로 앱 내 결제 제공',
        ],
      },
      {
        projectName: '알고케어 워크 모바일 앱',
        items: [
          '모바일 아키텍처 및 결제: React Native 기반 앱 구조를 클린 아키텍처로 설계하고 WebView 결제(앱투앱 스킴, 인증 동기화)를 연동했습니다.',
        ],
      },
      {
        projectName: '알고케어 워크 디스펜서 앱',
        items: [
          'OTA 운영 안정화: App Center 종료 이후 OTA 대체 체계를 내재화해 현재까지 배포 성공률 100%를 유지했습니다.',
          '디스펜서 시스템 대응: 장시간 구동 환경에서 화면 오프 자동화 등 시스템 레벨 개선을 통해 안정성을 높였습니다.',
        ],
      },
    ],
  },
  {
    company: '백패커 (아이디어스)',
    team: 'WebPlatform Cell',
    role: 'Frontend Engineer',
    period: '2020.06 - 2024.02',
    companyIntro:
      '백패커는 창작자를 위한 지속 가능한 생태계를 만듭니다. 핸드메이드 라이프 스타일 플랫폼 아이디어스와 창작 문화를 선도하는 크라우드 펀딩 플랫폼 텀블벅을 운영하고 있습니다.',
    contents: [
      {
        projectName: '아이디어스 판매자 서비스 웹앱',
        description: '',
        links: {
          playStore:
            'https://play.google.com/store/apps/details?id=kr.backpac.idus.artist',
          appStore:
            'https://apps.apple.com/kr/app/%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%EC%8A%A4-idus-%EC%9E%91%EA%B0%80%EB%8B%98-%EC%95%B1/id1581965877',
          website: 'https://artist.idus.com',
        },
        images: [
          'https://images.hexdrinker.dev/about/backpackr/idus-artist-1.webp',
          'https://images.hexdrinker.dev/about/backpackr/idus-artist-2.webp',
          'https://images.hexdrinker.dev/about/backpackr/idus-artist-3.webp',
          'https://images.hexdrinker.dev/about/backpackr/idus-artist-4.webp',
          'https://images.hexdrinker.dev/about/backpackr/idus-artist-5.webp',
          'https://images.hexdrinker.dev/about/backpackr/idus-artist-6.webp',
        ],
        items: [
          '핵심 역할: 구매자/판매자 서비스를 모두 경험하며, 대규모 마이그레이션부터 신규 비즈니스 기능 런칭까지 프론트엔드 전반을 담당했습니다.',
          '서비스 전환: 판매자 서비스 2.0 마이그레이션을 빅뱅 방식으로 런칭해 개발/운영 가능한 구조로 전환했습니다.',
          '상태 관리 안정화: 모달 상태를 쿼리스트링 기반으로 재설계해 새로고침 상태 유실/스크롤락 문제를 해결했습니다.',
        ],
      },
      {
        projectName: '아이디어스 구매자 서비스 웹',
        description: '',
        links: {
          website: 'https://idus.com',
        },
        images: ['https://images.hexdrinker.dev/about/backpackr/idus-1.png'],
        items: [
          '아이디어스 고도화: 쿠폰 기능 고도화, 선물하기 프로세스 개선, 작가 홈 UI/UX 개편, Lottie를 활용한 첫 구매 가이드 숏컷 개발 등의 작업을 진행했습니다.',
        ],
      },
    ],
  },
  {
    company: '젤리랩',
    team: 'SW Development Team',
    role: 'Frontend Engineer',
    period: '2018.09 - 2019.05',
    companyIntro:
      '젤리랩은 환자케어 챗봇과 의료용 대시보드를 운영하여 만성질환 관리를 돕고 의료진을 보조하는 헬스케어 기업입니다. 현재는 폐업했습니다.',
    contents: [
      {
        items: [
          '의료용 대시보드 운영 및 유지보수: 환자의 메시지와 상태를 확인할 수 있는 의료용 대시보드의 이미지 데이터 처리 로직을 리팩토링하고 서비스 전반을 유지보수했습니다.',
        ],
      },
    ],
  },
  {
    company: '인크로스',
    team: 'AD Platform Development Team',
    role: 'Intern',
    period: '2017.12 - 2018.07',
    companyIntro:
      "인크로스는 업계를 선도하는 디지털 광고 전문 기업으로 디지털 광고 미디어렙, 애드 네트워크, AI 기반의 문자 커머스 'T deal' 사업에 주력하고 있습니다.",
    contents: [
      {
        items: [
          '고객사 참여형 대시보드 개발: 대시보드의 게시판 CRUD api와 UI 작업, 위지윅 에디터 summernote를 커스텀하여 편집 기능을 개선하였습니다.',
          'Maria DB 프로시저 리팩토링: 레거시 프로시저에서 따옴표, 벡틱 처리와 관련된 문자열 파싱 로직을 리팩토링했습니다.',
        ],
      },
    ],
  },
]

const ACTIVITIES = [
  {
    title: 'use-funnel 오픈소스 컨트리뷰트',
    period: '2025.09',
    description:
      'React Navigation 환경의 상태 유지 이슈를 분석/수정해 PR을 제출했고, 승인 및 배포까지 반영됐습니다.',
    link: {
      label: 'PR #172',
      href: 'https://github.com/toss/use-funnel/pull/172',
    },
  },
  {
    title: '스튜디오 불티 Frontend Engineer',
    period: '2024.05 - current',
    description:
      '공연 예매/관리 플랫폼의 홈, 예매, 슈퍼 어드민 기능과 공통 UI를 개발했습니다.',
    link: {
      label: 'boolti.in',
      href: 'https://boolti.in',
    },
  },
  {
    title: 'BCSD Lab Frontend Track Mentor',
    period: '2020.03 - 2020.12',
    description:
      '교내 IT 동아리 프론트엔드 트랙 멘토로 활동하며 신입 개발자 성장을 지원했습니다.',
  },
  {
    title: 'D&D Organizer',
    period: '2019.07 - current',
    description:
      '비영리 IT 커뮤니티 운영진으로서 기수 운영 및 커뮤니티 확장에 참여했습니다.',
    link: {
      label: 'dnd.ac',
      href: 'https://dnd.ac',
    },
  },
] satisfies ActivityItem[]

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

export { SOCIAL_LINKS, WORKS, ACTIVITIES, CAREERS, CURRENT_WORK }
