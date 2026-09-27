import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeBackdrop } from '@/components/layout/ThemeBackdrop'
import { WeatherSync } from '@/components/layout/WeatherSync'
import { getMainPagePosts } from '@/lib/posts'
import { BLOG_CATEGORY_MAP } from '@/lib/categories'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hexdrinker.dev'),
  title: {
    default: "hexdrinker's devlog",
    template: "%s | hexdrinker's devlog",
  },
  description: '재밌게 살고 즐겁게 개발 하고 싶은 한 개발자의 이야기',
  keywords: ['blog', 'typescript', 'react', 'frontend', '프론트엔드', '개발자'],
  authors: [{ name: 'hexdrinker', url: 'https://github.com/hexdrinker' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hexdrinker.dev',
    siteName: "hexdrinker's devlog",
    title: "hexdrinker's devlog",
    description: '재밌게 살고 즐겁게 개발 하고 싶은 한 개발자의 이야기',
    images: [
      {
        url: '/img/meta/image.png',
        width: 1200,
        height: 630,
        alt: "hexdrinker's devlog",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/img/favicon.ico',
  },
}

// 첫 페인트 전에 배경 시간대·날씨와 테마를 정한다
// 1) ?time=&weather=&landscape= 파라미터 2) WeatherSync가 저장해 둔 방문자 위치의 날씨·풍경(15분) 3) 기기 시계 순으로 쓴다
// 낮에만 라이트, 새벽·저녁·밤은 다크 테마가 되도록 next-themes가 읽는 값도 여기서 정한다
// WebGL 하늘을 쓸 브라우저면 data-sky='gl'을 붙여, 로딩 중엔 일러스트 대신 단순 그라데이션만 보여준다
const SKY_SCRIPT = `(function(){var d=document.documentElement,t,w,l;try{var q=new URLSearchParams(location.search);t=q.get('time');w=q.get('weather');l=q.get('landscape');var s=JSON.parse(sessionStorage.getItem('sky')||'null');if(s&&Date.now()-s.at<9e5){if(!t&&!w){t=s.time;w=s.weather}l=l||s.landscape}}catch(e){}if(l)d.dataset.landscape=l;if(!t){var h=new Date().getHours();t=h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<20?'dusk':'night'}d.dataset.time=t;if(w)d.dataset.weather=w;try{localStorage.setItem('theme',t==='day'?'light':'dark')}catch(e){}try{if(window.WebGLRenderingContext&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.sky='gl'}catch(e){}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const searchItems = getMainPagePosts().map(({ slug, meta }) => ({
    title: meta.title,
    description: meta.description,
    href: `/${slug}`,
    category: BLOG_CATEGORY_MAP.get(meta.category)?.label ?? meta.category,
    date: meta.date.slice(0, 10).replaceAll('-', '.'),
    tags: meta.tags,
  }))

  return (
    <html
      lang='ko'
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SKY_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <ThemeBackdrop />
          <WeatherSync />
          <Header searchItems={searchItems} />
          <main className='flex-1'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
