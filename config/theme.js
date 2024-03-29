const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const colorMode = {
  defaultMode: 'dark',
  disableSwitch: false,
  respectPrefersColorScheme: true,
};

const navbar = {
  title: 'hexdrinker',
  hideOnScroll: true,
  logo: {
    alt: 'Logo',
    src: '/img/logos/logo-light-mode.png',
    srcDark: '/img/logos/logo-dark-mode.png',
    href: '/blog',
    target: '_self',
  },
  items: [
    { 
      to: '/blog',
      label: 'Blog',
      position: 'left'
    },
    {
      type: 'search',
      position: 'right',
    },
    {
      href: 'https://github.com/hexdrinker',
      label: 'GitHub',
      position: 'right',
    },
  ],
}

const footer = {
  style: 'dark',
  copyright: `
    Powered By <a href="https://docusaurus.io/" target="_blank" >Docusaurus 2</a>, Hosted By <a href="https://vercel.com/" target="_blank">Vercel</a>
    Copyright © ${new Date().getFullYear()}
  `,
}

const prism = {
  theme: lightCodeTheme,
  darkTheme: darkCodeTheme,
}

const algolia = {
  appId: 'AVKSPQPWRC',
  apiKey: '2f83f89da477b2ee3120fc0568798bba',
  indexName: 'hexdrinker',
  contextualSearch: true,
}

const metadata = [
  { name: 'keywords', content: 'blog, typescript, react, frontend' },
  { name: 'author', content: 'hexdrinker' },
  { property: 'og:type', content: 'website' },
  { property: 'og:description', content: 'website' },
  { property: 'og:site_name', content: 'https://hexdrinker.dev' },
  { property: 'og:locale', content: 'ko_KR' },
  { property: 'og:image', content: 'https://hexdrinker.dev/img/meta/image.png' },
  { property: 'og:image:secure_url', content: 'https://hexdrinker.dev/img/meta/image.png' },
  { property: 'og:image:type', content: 'image/jpeg' },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:image:alt', content: 'Blog Thumbnail' },
]

module.exports = Object.assign({}, { colorMode, navbar, footer, prism, algolia, metadata });