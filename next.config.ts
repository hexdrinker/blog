import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import { withContentCollections } from '@content-collections/next'

const nextConfig: NextConfig = {
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
