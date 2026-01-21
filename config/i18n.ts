import { I18nConfig } from '@docusaurus/types'

const i18n: I18nConfig = {
  defaultLocale: 'ko',
  locales: ['ko'],
  path: 'i18n',
  localeConfigs: {
    ko: {
      label: '한국어',
      direction: 'ltr',
      htmlLang: 'ko-kr',
      calendar: 'gregory',
    },
  },
}

export default i18n
