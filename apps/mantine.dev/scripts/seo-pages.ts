import { MDX_DATA } from '../src/mdx/mdx-data'
import type { SeoPage } from '../src/seo'

const customPages: SeoPage[] = [
  {
    path: '/',
    title: 'Mantine Vue – Vue 3 components and composables',
    description:
      'Build accessible Vue 3 applications with 100+ customizable components and composables, native dark theme support, and a focus on developer experience.',
  },
  {
    path: '/app-shell',
    title: 'AppShell examples',
    description:
      'Explore responsive application shell layouts built with the Mantine Vue AppShell component.',
  },
  {
    path: '/colors-generator',
    title: 'Colors generator',
    description: 'Generate accessible color palettes for your Mantine Vue theme.',
  },
]

export const SEO_PAGES: SeoPage[] = [
  ...Object.values(MDX_DATA).map(({ slug, title, description }) => ({
    path: slug,
    title,
    description: description!,
  })),
  ...customPages,
].sort((a, b) => a.path.localeCompare(b.path))
