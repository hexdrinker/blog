import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='ko'
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className='flex-1'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
