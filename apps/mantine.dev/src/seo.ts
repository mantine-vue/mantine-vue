export const SITE_NAME = 'Mantine Vue'
export const SITE_URL = 'https://mantine-vue.dev'
export const DEFAULT_TITLE = 'Mantine Vue – Vue 3 components and composables'
export const DEFAULT_DESCRIPTION =
  'Build accessible Vue 3 applications with 100+ customizable components and composables, native dark theme support, and a focus on developer experience.'

export interface SeoPage {
  path: string
  title: string
  description: string
}

export function getPageTitle(title?: string) {
  return title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
}

export function getCanonicalUrl(path: string) {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return new URL(normalizedPath, SITE_URL).toString()
}

export function getStructuredData(page: SeoPage) {
  const url = getCanonicalUrl(page.path)

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.title,
    description: page.description,
    url,
    mainEntityOfPage: url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'SoftwareSourceCode',
      name: SITE_NAME,
      codeRepository: 'https://github.com/mantine-vue/mantine-vue',
      programmingLanguage: ['TypeScript', 'Vue'],
      license: 'https://opensource.org/license/mit',
    },
  }
}
