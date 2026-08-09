export interface Frontmatter {
  /** Title of the page */
  title: string
  /** Package name to which the component/hook belongs */
  package?: string
  /** Page slug */
  slug: string
  /** Page description */
  description?: string
  /** Prefix of compound components, used to format compound props and Styles API data */
  componentPrefix?: string
  /** Component props, used to display data in the Props tab */
  props?: string[]
  /** Component Styles API data, used to display data in the Styles API tab */
  styles?: string[]
  /** Source code path, relative to `packages/` */
  source?: string
  /** Documentation source path, relative to `apps/mantine.dev/src/pages/` */
  docs?: string
  /** Page keywords, used for search */
  search?: string
  /** Tags used for search, not visible in UI */
  searchTags?: string
  /** Determines whether page should be hidden in search */
  hideInSearch?: boolean
  /** Determines whether polymorphic component data should be displayed */
  polymorphic?: boolean
  /** Determines whether page header should be hidden */
  hideHeader?: boolean
  /** Determines whether siblings should be hidden */
  hideSiblings?: boolean
  /** If set, the table of contents is hidden – for pages with complex layouts */
  hideTableOfContents?: boolean
  /** License displayed in the header, used for package pages */
  license?: string
  /** Release number, used on changelog pages */
  release?: string
  /** Release date, displayed in changelogs */
  date?: string
}
