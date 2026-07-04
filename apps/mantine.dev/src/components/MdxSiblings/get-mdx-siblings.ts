import { FLAT_MDX_NAV_DATA, type MdxNavItem } from '@/mdx'

// mantine-vue doesn't keep a flat list of full Frontmatter for nav pages, only
// the {label, link} pairs used to render the navbar (FLAT_MDX_NAV_DATA) -
// that's enough here since MdxSiblings only ever renders `title` (-> label)
// and `slug` (-> link).
export function getMdxSiblings(slug: string): {
  prev: MdxNavItem | undefined
  next: MdxNavItem | undefined
} {
  const index = FLAT_MDX_NAV_DATA.findIndex((page) => page.link === slug)
  const prev = index > 0 ? FLAT_MDX_NAV_DATA[index - 1] : undefined
  const next = index >= 0 ? FLAT_MDX_NAV_DATA[index + 1] : undefined

  return { prev, next }
}
