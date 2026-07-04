import { MDX_NAV_DATA } from '@/mdx'

export function getActiveCategory(path: string): string | undefined {
  return MDX_NAV_DATA.find((category) =>
    category.groups.some((group) => group.pages.some((page) => page.link === path)),
  )?.category
}
