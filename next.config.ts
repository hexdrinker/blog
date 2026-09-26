import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import { withContentCollections } from '@content-collections/next'

const nextConfig: NextConfig = {
  // 독서 카테고리 경로를 /book → /bookshelf로 옮겼다
  async redirects() {
    return [
      { source: '/book', destination: '/bookshelf', permanent: true },
      { source: '/book/:slug', destination: '/bookshelf/:slug', permanent: true },
    ]
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
