import type { Config } from '@docusaurus/types'
import presets from './config/presets'
import i18n from './config/i18n'
import themeConfig from './config/theme'

const config: Config = {
  title: "hexdrinker's devlog",
  tagline: '재밌게 살고 즐겁게 개발 하고 싶은 한 개발자의 이야기',
  favicon: 'img/favicon.ico',
  url: 'https://hexdrinker.dev',
  baseUrl: '/',
  organizationName: 'hexdrinker',
  projectName: 'blog',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'throw',
  i18n,
  presets: [['classic', presets]],
  plugins: ['docusaurus-plugin-sass'],
  themeConfig,
}

export default config
