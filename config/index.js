// @ts-check

const i18n = require('./i18n')
const presets = require('./presets')
const themeConfig = require('./theme')

/**
 * @type {import('@docusaurus/types').Config}
 */
const config = {
  title: "hexdrinker's devlog",
  url: 'https://hexdrinker.dev',
  baseUrl: '/',
  favicon: '/img/favicon.ico',
  i18n,
  noIndex: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',
  tagline: '재밌게 살고 즐겁게 개발 하고 싶은 한 개발자의 이야기',
  organizationName: 'https://github.com/hexdrinker',
  projectName: 'blog',
  themeConfig,
  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/blog',
            from: '/',
          },
        ],
      },
    ],
  ],
  themes: [],
  presets: [['classic', presets.classic]],
  staticDirectories: ['static'],
  scripts: [],
  stylesheets: [],
  clientModules: [],
  titleDelimiter: ' | ',
  baseUrlIssueBanner: false,
}

module.exports = config
