import { defineComponent, h } from 'vue'
import Fuse from 'fuse.js'
import type { SpotlightActionData, SpotlightFilterFunction } from '@mantine-vue/spotlight'
import { PhFileText, PhGauge, PhHouse, PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'
import { SpotlightDemoBase } from './_demo-base'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import Fuse from 'fuse.js'
import { Button } from '@mantine-vue/core'
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import type { SpotlightActionData, SpotlightFilterFunction } from '@mantine-vue/spotlight'
import { PhHouse, PhGauge, PhFileText, PhMagnifyingGlass } from '@phosphor-icons/vue'

const actions: SpotlightActionData[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Get to home page',
    onClick: () => console.log('Home'),
    leftSection: h(PhHouse, { size: 24 }),
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Get full information about current system status',
    onClick: () => console.log('Dashboard'),
    leftSection: h(PhGauge, { size: 24 }),
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'Visit documentation to learn more about all features',
    onClick: () => console.log('Documentation'),
    leftSection: h(PhFileText, { size: 24 }),
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage application preferences and configurations',
    onClick: () => console.log('Settings'),
    leftSection: h(PhHouse, { size: 24 }),
  },
]

const fuzzySearchFilter: SpotlightFilterFunction = (query, searchActions) => {
  if (!query.trim()) {
    return searchActions
  }

  const flatActions = searchActions.reduce<any[]>((acc, item) => {
    if ('actions' in item) {
      return [...acc, ...item.actions.map((action) => ({ ...action, group: item.group }))]
    }
    return [...acc, item]
  }, [])

  const fuse = new Fuse(flatActions, {
    keys: ['label', 'description'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })

  const results = fuse.search(query).map((result) => result.item)

  const groups: Record<string, any> = {}
  const result: any[] = []

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
</script>

<template>
  <Button @click="spotlight.open()">Open spotlight</Button>
  <Spotlight
    :actions="actions"
    :filter="fuzzySearchFilter"
    nothing-found="Nothing found..."
    highlight-query
    :search-props="{
      leftSection: h(PhMagnifyingGlass, { size: 20 }),
      placeholder: 'Search...',
    }"
  />
</template>
`

const actions: SpotlightActionData[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Get to home page',
    onClick: () => console.log('Home'),
    leftSection: h(PhHouse, { size: 24 }),
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Get full information about current system status',
    onClick: () => console.log('Dashboard'),
    leftSection: h(PhGauge, { size: 24 }),
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'Visit documentation to learn more about all features',
    onClick: () => console.log('Documentation'),
    leftSection: h(PhFileText, { size: 24 }),
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage application preferences and configurations',
    onClick: () => console.log('Settings'),
    leftSection: h(PhHouse, { size: 24 }),
  },
]

const fuzzySearchFilter: SpotlightFilterFunction = (query, searchActions) => {
  if (!query.trim()) {
    return searchActions
  }

  const flatActions = searchActions.reduce<any[]>((acc, item) => {
    if ('actions' in item) {
      return [...acc, ...item.actions.map((action) => ({ ...action, group: (item as any).group }))]
    }
    return [...acc, item]
  }, [])

  const fuse = new Fuse(flatActions, {
    keys: ['label', 'description'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })

  const results = fuse.search(query).map((result) => result.item)

  const groups: Record<string, any> = {}
  const result: any[] = []

  results.forEach((action: any) => {
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

const Demo = defineComponent({
  name: 'SpotlightFuzzySearchDemo',
  setup() {
    return () =>
      h(SpotlightDemoBase, {
        actions,
        filter: fuzzySearchFilter,
        nothingFound: 'Nothing found...',
        highlightQuery: true,
        shortcut: null,
        searchProps: {
          leftSection: h(PhMagnifyingGlass, { size: 20 }),
          placeholder: 'Search...',
        },
      })
  },
})

export const fuzzySearch: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
