import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeBackdrop } from '@/components/layout/ThemeBackdrop'
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

// 첫 페인트 전에 방문자 시각으로 시간대를 정해 배경 디테일을 바꾼다
const TIME_OF_DAY_SCRIPT = `(function(){var h=new Date().getHours();document.documentElement.dataset.time=h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<20?'dusk':'night'})()`

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
        <script dangerouslySetInnerHTML={{ __html: TIME_OF_DAY_SCRIPT }} />
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
          <Header searchItems={searchItems} />
          <main className='flex-1'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
