import { defineComponent, h } from 'vue'
import type { SpotlightActionData } from '@mantine-vue/spotlight'
import { PhFileText, PhGauge, PhHouse, PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'
import { SpotlightDemoBase } from './_demo-base'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Button } from '@mantine-vue/core'
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import type { SpotlightActionData } from '@mantine-vue/spotlight'
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
    description: 'Visit documentation to lean more about all features',
    onClick: () => console.log('Documentation'),
    leftSection: h(PhFileText, { size: 24 }),
  },
]
</script>

<template>
  <Button @click="spotlight.open()">Open spotlight</Button>
  <Spotlight
    :actions="actions"
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
    description: 'Visit documentation to lean more about all features',
    onClick: () => console.log('Documentation'),
    leftSection: h(PhFileText, { size: 24 }),
  },
]

const Demo = defineComponent({
  name: 'SpotlightUsageDemo',
  setup() {
    return () =>
      h(SpotlightDemoBase, {
        actions,
        nothingFound: 'Nothing found...',
        highlightQuery: true,
        // Avoid clashing with the docs site's own Ctrl+K search shortcut.
        shortcut: null,
        searchProps: {
          leftSection: h(PhMagnifyingGlass, { size: 20 }),
          placeholder: 'Search...',
        },
      })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
