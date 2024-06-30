import type * as Preset from '@docusaurus/preset-classic'

const classic = {
  debug: false,
  docs: {
    routeBasePath: 'docs',
    editCurrentVersion: false,
    editLocalizedFiles: false,
    numberPrefixParser: (filename) => ({ filename }),
    breadcrumbs: false,

    // path options
    path: 'docs',
    sidebarPath: './sidebars.ts',

    // sidebar options
    sidebarCollapsible: true,
    sidebarCollapsed: false,
  },
  blog: {
    blogTitle: 'Blog',
    routeBasePath: '/blog',
    showReadingTime: true,
    readingTime: ({ content, defaultReadingTime }) =>
      defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
    feedOptions: {
      type: 'all',
      copyright: '@ hexdrinker, All rights reserved',
    },
    blogSidebarCount: 'ALL',
  },
  sitemap: {
    changefreq: 'weekly',
    priority: 0.5,
    ignorePatterns: [],
    filename: 'sitemap.xml',
  },
  theme: { customCss: './config/styles/custom.scss' },
  googleAnalytics: undefined,
  gtag: {
    trackingID: 'G-90KTBB91DM',
    anonymizeIP: true,
  },
} satisfies Preset.Options

export default classic
