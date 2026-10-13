import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import { withContentCollections } from '@content-collections/next'

const nextConfig: NextConfig = {
  // 독서 카테고리 경로를 /book → /bookshelf로 옮겼다
  async redirects() {
    return [
      { source: '/book', destination: '/bookshelf', permanent: true },
      { source: '/book/:slug', destination: '/bookshelf/:slug', permanent: true },
      // 어드민은 admin.hexdrinker.dev에서만 연다
      {
        source: '/admin/:path*',
        has: [{ type: 'host', value: '(www\\.)?hexdrinker\\.dev' }],
        destination: 'https://admin.hexdrinker.dev/:path*',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return {
      // admin.* 호스트의 페이지 요청을 /admin 아래로 보낸다 (api, _next, 정적 파일은 그대로)
      // 로컬에서는 admin.localhost:3000으로 연다
      beforeFiles: [
        {
          source: '/:path((?!api/|_next/)[^.]*)',
          has: [{ type: 'host', value: 'admin\\..+' }],
          destination: '/admin/:path',
        },
      ],
    }
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.hexdrinker.dev',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

const withMDX = createMDX({})

export default withContentCollections(withMDX(nextConfig))
