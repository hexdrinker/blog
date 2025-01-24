import { themes as prismThemes } from 'prism-react-renderer'
import type { ThemeConfig } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const themeConfig: ThemeConfig = {
  image: 'img/docusaurus-social-card.jpg',
  colorMode: {
    defaultMode: 'dark',
    disableSwitch: false,
    respectPrefersColorScheme: true,
  },
  navbar: {
    title: 'hexdrinker',
    logo: {
      alt: 'Logo',
      src: '/img/logos/logo-light-mode.png',
      srcDark: '/img/logos/logo-dark-mode.png',
      href: '/',
    },
    items: [
      // left
      // {
      //   type: 'dropdown',
      //   to: '/series',
      //   label: 'Series',
      //   position: 'left',
      //   items: [
      //     {
      //       to: '/series',
      //       label: 'Posts',
      //     },
      //     {
      //       to: '/series/tags',
      //       label: 'Tags',
      //     },
      //   ],
      // },
      {
        type: 'dropdown',
        to: '/blog',
        label: 'Blog',
        position: 'left',
        items: [
          {
            to: '/blog',
            label: 'Posts',
          },
          {
            to: '/blog/tags',
            label: 'Tags',
          },
          {
            to: '/blog/archive',
            label: 'Archive',
          },
        ],
      },
      // right
      {
        to: '/resume',
        label: 'Resume',
        position: 'right',
      },
      {
        href: 'https://github.com/hexdrinker',
        className: 'header-github-link',
        position: 'right',
        'aria-label': 'GitHub repository',
      },
    ],
    hideOnScroll: true,
  },
  footer: {
    style: 'dark',
    // links: [
    //   {
    //     title: 'Docs',
    //     items: [
    //       {
    //         label: 'Tutorial',
    //         to: '/docs/intro',
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Community',
    //     items: [
    //       {
    //         label: 'Stack Overflow',
    //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
    //       },
    //       {
    //         label: 'Discord',
    //         href: 'https://discordapp.com/invite/docusaurus',
    //       },
    //       {
    //         label: 'Twitter',
    //         href: 'https://twitter.com/docusaurus',
    //       },
    //     ],
    //   },
    //   {
    //     title: 'More',
    //     items: [
    //       {
    //         label: 'Blog',
    //         to: '/blog',
    //       },
    //       {
    //         label: 'GitHub',
    //         href: 'https://github.com/facebook/docusaurus',
    //       },
    //     ],
    //   },
    // ],
    copyright: `
      Powered By <a href="https://docusaurus.io/" target="_blank" >Docusaurus 2</a>, Hosted By <a href="https://aws.amazon.com/" target="_blank">AWS</a><br />
      Copyright © ${new Date().getFullYear()} <a href="https://github.com/hexdrinker" target="_blank">hexdrinker</a>, All rights reserved.
    `,
  },
  // announcementBar: {
  //   id: 'support_us',
  //   content:
  //     'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
  //   backgroundColor: '#fafbfc',
  //   textColor: '#091E42',
  //   isCloseable: false,
  // },
  prism: {
    theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
  },
  algolia: {
    // The application ID provided by Algolia
    appId: 'CVBKXKD5KS',

    // Public API key: it is safe to commit it
    apiKey: 'cba9757b0c50181739a520e03956c0bd',

    indexName: 'hexdrinker',

    // Optional: see doc section below
    contextualSearch: true,

    // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
    externalUrlRegex: 'external\\.com|domain\\.com',

    // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
    replaceSearchResultPathname: {
      from: '/docs/', // or as RegExp: /\/docs\//
      to: '/',
    },

    // Optional: Algolia search parameters
    searchParameters: {},

    // Optional: path for search page that enabled by default (`false` to disable it)
    searchPagePath: 'search',

    // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
    insights: false,

    //... other Algolia params
  },
  metadata: [
    { name: 'keywords', content: 'blog, typescript, react, frontend' },
    { name: 'author', content: 'hexdrinker' },
    { name: 'algolia-site-verification', content: '0921493C7D4F2B8E' },
    { property: 'og:type', content: 'website' },
    { property: 'og:description', content: 'website' },
    { property: 'og:site_name', content: 'https://hexdrinker.dev' },
    { property: 'og:locale', content: 'ko_KR' },
    {
      property: 'og:image',
      content: 'https://hexdrinker.dev/img/meta/image.png',
    },
    {
      property: 'og:image:secure_url',
      content: 'https://hexdrinker.dev/img/meta/image.png',
    },
    { property: 'og:image:type', content: 'image/jpeg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Blog Thumbnail' },
  ],
} satisfies Preset.ThemeConfig

export default themeConfig
