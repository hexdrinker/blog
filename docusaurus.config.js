// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const EnumChangefreq = require.resolve('@docusaurus/preset-classic');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'blog',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',
  url: 'https://hexdrinker.com',
  baseUrl: '/',
  organizationName: 'https://github.com/hexdrinker',
  projectName: 'blog',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'throw',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  titleDelimiter: ' | ',
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        debug: false,
        pages: false,
        // docs: {
        //   // meta options
        //   routeBasePath: '/docs',
        //   editCurrentVersion: false,
        //   editLocalizedFiles: false,
        //   numberPrefixParser: (filename) => ({ filename }),
        //   breadcrumbs: false,
        //   // path options
        //   path: 'docs',
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // sidebar options
        //   sidebarCollapsible: true,
        //   sidebarCollapsed: false,          
        // },
        blog: {
          blogTitle: 'Blog',
          showReadingTime: true,
          blogSidebarCount: 'ALL',
          routeBasePath: '/blog',
        },
        sitemap: {
          changefreq: EnumChangefreq['weekly'],
          priority: 0.5,
          ignorePatterns: [],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: undefined, 
        gtag: {
          trackingID: 'G-90KTBB91DM',
        }
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'hexdrinker',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
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
      },
      footer: {
        style: 'dark',
        copyright: `
          Powered By <a href="https://docusaurus.io/" target="_blank" >Docusaurus 2</a>, Hosted By <a href="https://vercel.com/" target="_blank">Vercel</a>
          Copyright © ${new Date().getFullYear()} `,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'RIU343RX2S',
        apiKey: '2e00d773555bc2f652b10584c544763c',
        indexName: 'hexdrinker',
        contextualSearch: true,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      // metadata: [
      //   { name: 'keywords', content: 'blog, javascript, react, frontend' },
      //   { name: 'author', content: 'hexdrinker' },
      //   { property: 'og:type', content: 'website' },
      //   { property: 'og:description', content: 'website' },
      //   { property: 'og:site_name', content: 'hexdrinker.com' },
      //   { property: 'og:locale', content: 'ko_KR' },
      //   { property: 'og:image', content: 'https://www.hexdrinker.com/img/meta/image.png' },
      //   { property: 'og:image:secure_url', content: 'https://www.hexdrinker.com/img/meta/image.png' },
      //   { property: 'og:image:type', content: 'image/jpeg' },
      //   { property: 'og:image:width', content: '1200' },
      //   { property: 'og:image:height', content: '630' },
      //   { property: 'og:image:alt', content: 'Blog Thumbnail' },
      // ],
    }),
};

module.exports = config;
