export type DocKind = 'component' | 'hook' | 'guide'

export interface DocProp {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue: string | null
}

export interface DocSlot {
  name: string
  type: string
  required: boolean
  description: string
}

export interface DocEmit {
  name: string
  type: string
  description: string
}

export interface DocSection {
  slug: string
  heading: string
  content: string
}

export interface DocData {
  id: string
  name: string
  description: string
  url: string
  package?: string
  source?: string
  props: Record<string, DocProp[]>
  slots: Record<string, DocSlot[]>
  emits: Record<string, DocEmit[]>
  sections: DocSection[]
}

export interface IndexItem {
  id: string
  name: string
  kind: DocKind
  group: string
  category: string
  package?: string
  description: string
  url: string
  source?: string
  searchText: string
  propsCount: number
  sectionCount: number
}

export interface SectionRecord {
  id: string
  slug: string
  heading: string
  snippet: string
}

export interface SearchDocsArgs {
  query: string
  kind?: DocKind
  package?: string
  limit?: number
}

export interface GetItemArgs {
  name: string
  kind?: DocKind
  section?: string
  full?: boolean
}

export interface ListItemsArgs {
  kind?: DocKind
  group?: string
  category?: string
  package?: string
  query?: string
  limit?: number
}
