import { defineComponent, h } from 'vue'
import type { SpotlightActionData, SpotlightActionGroupData } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'
import { SpotlightDemoBase } from './_demo-base'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Button } from '@mantine-vue/core'
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import type { SpotlightActionData, SpotlightActionGroupData } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'

const actions: (SpotlightActionGroupData | SpotlightActionData)[] = [
  {
    group: 'Pages',
    actions: [
      { id: 'home', label: 'Home page', description: 'Where we present the product' },
      { id: 'careers', label: 'Careers page', description: 'Where we list open positions' },
      { id: 'about-us', label: 'About us page', description: 'Where we tell what we do' },
    ],
  },

  {
    group: 'Apps',
    actions: [
      { id: 'svg-compressor', label: 'SVG compressor', description: 'Compress SVG images' },
      { id: 'base64', label: 'Base 64 converter', description: 'Convert data to base 64 format' },
      { id: 'fake-data', label: 'Fake data generator', description: 'Lorem ipsum generator' },
    ],
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

const actions: (SpotlightActionGroupData | SpotlightActionData)[] = [
  {
    group: 'Pages',
    actions: [
      { id: 'home', label: 'Home page', description: 'Where we present the product' },
      { id: 'careers', label: 'Careers page', description: 'Where we list open positions' },
      { id: 'about-us', label: 'About us page', description: 'Where we tell what we do' },
    ],
  },

  {
    group: 'Apps',
    actions: [
      { id: 'svg-compressor', label: 'SVG compressor', description: 'Compress SVG images' },
      { id: 'base64', label: 'Base 64 converter', description: 'Convert data to base 64 format' },
      { id: 'fake-data', label: 'Fake data generator', description: 'Lorem ipsum generator' },
    ],
  },
]

const Demo = defineComponent({
  name: 'SpotlightGroupsDemo',
  setup() {
    return () =>
      h(SpotlightDemoBase, {
        actions,
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

export const groups: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
