import { defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import Fuse from 'fuse.js'
import {
  createSpotlight,
  Spotlight,
  type SpotlightActionData,
  type SpotlightActionGroupData,
  type SpotlightActions,
  type SpotlightFilterFunction,
} from '@mantine-vue/spotlight'
import { MDX_DATA } from '@/mdx'
import type { Frontmatter } from '@/types'

export const [searchStore, searchHandlers] = createSpotlight()

type SearchAction = SpotlightActionData & { group?: string }

const fuzzySearchFilter: SpotlightFilterFunction = (query, actions) => {
  if (!query.trim()) {
    return actions
  }

  const flatActions = actions.reduce<SearchAction[]>((acc, item) => {
    if ('actions' in item) {
      return [
        ...acc,
        ...item.actions.map((action: SpotlightActionData) => ({ ...action, group: item.group })),
      ]
    }

    return [...acc, item]
  }, [])

  const fuse = new Fuse(flatActions, {
    keys: ['label', 'description', 'keywords'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })

  const results = fuse.search(query).map((result) => result.item)
  const groups: Record<string, { pushed: boolean; data: SpotlightActionGroupData }> = {}
  const result: SpotlightActions[] = []

  results.forEach((action) => {
    if (action.group) {
      if (!groups[action.group]) {
        groups[action.group] = { pushed: false, data: { group: action.group, actions: [] } }
      }

      groups[action.group].data.actions.push(action)

      if (!groups[action.group].pushed) {
        groups[action.group].pushed = true
        result.push(groups[action.group].data)
      }
    } else {
      result.push(action)
    }
  })

  return result
}

const searchPages: Frontmatter[] = [
  ...Object.values(MDX_DATA),
  {
    title: 'AppShell examples',
    slug: '/app-shell?e=BasicAppShell',
    search: '10+ examples of AppShell usage',
  },
].reduce<Frontmatter[]>((acc, item) => {
  if (!acc.some((accItem) => accItem.slug === item.slug)) {
    acc.push(item)
  }

  return acc
}, [])

export const Search = defineComponent({
  name: 'Search',
  setup() {
    const router = useRouter()
    const actions = searchPages
      .filter((page) => !page.hideInSearch)
      .map<SpotlightActionData>((page) => ({
        id: page.slug,
        label: page.title,
        description:
          page.search || page.description || (page.date ? `Released ${page.date}` : undefined),
        keywords: page.searchTags,
        onClick: () => {
          void router.push(page.slug)
        },
      }))

    return () =>
      h(Spotlight, {
        store: searchStore,
        shortcut: ['mod + K', 'mod + P', '/'],
        actions,
        tagsToIgnore: [],
        filter: fuzzySearchFilter,
        highlightQuery: true,
        clearQueryOnClose: true,
        radius: 'md',
        limit: 7,
        nothingFound: 'Nothing found...',
        searchProps: {
          leftSection: h(PhMagnifyingGlass, { size: 20 }),
          placeholder: 'Search documentation...',
        },
      })
  },
})
