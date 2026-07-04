import { defineComponent, h } from 'vue'
import type { SpotlightActionData } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'
import { SpotlightDemoBase } from './_demo-base'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Button } from '@mantine-vue/core'
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import type { SpotlightActionData } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'

const actions: SpotlightActionData[] = Array(3000)
  .fill(0)
  .map((_, index) => ({
    id: \`action-\${index}\`,
    label: \`Action \${index}\`,
    description: \`Action \${index} description\`,
  }))
</script>

<template>
  <Button @click="spotlight.open()">Open spotlight</Button>
  <Spotlight
    :actions="actions"
    nothing-found="Nothing found..."
    highlight-query
    :limit="7"
    :search-props="{
      leftSection: h(PhMagnifyingGlass, { size: 20 }),
      placeholder: 'Search...',
    }"
  />
</template>
`

const actions: SpotlightActionData[] = Array(3000)
  .fill(0)
  .map((_, index) => ({
    id: `action-${index}`,
    label: `Action ${index}`,
    description: `Action ${index} description`,
  }))

const Demo = defineComponent({
  name: 'SpotlightLimitDemo',
  setup() {
    return () =>
      h(SpotlightDemoBase, {
        actions,
        nothingFound: 'Nothing found...',
        highlightQuery: true,
        limit: 7,
        shortcut: null,
        searchProps: {
          leftSection: h(PhMagnifyingGlass, { size: 20 }),
          placeholder: 'Search...',
        },
      })
  },
})

export const limit: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
