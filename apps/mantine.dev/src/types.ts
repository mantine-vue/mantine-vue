export interface Frontmatter {
  title: string
  package?: string
  slug: string
  description?: string
  componentPrefix?: string
  props?: string[]
  styles?: string[]
  source?: string
  docs?: string
  search?: string
  searchTags?: string
  hideInSearch?: boolean
  polymorphic?: boolean
  hideHeader?: boolean
  hideSiblings?: boolean
  release?: string
  date?: string
}
