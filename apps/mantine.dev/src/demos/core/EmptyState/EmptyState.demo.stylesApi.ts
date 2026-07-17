import { defineComponent, h } from 'vue'
import { Button, EmptyState } from '@mantine-vue/core'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, EmptyState } from '@mantine-vue/core'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
</script>

<template>
  <EmptyState
    title="No results found"
    description="We couldn't find anything matching your search. Try adjusting your filters or searching with different keywords to see more results."{{props}}
  >
    <template #icon>
      <PhMagnifyingGlass />
    </template>

    <EmptyState.Actions>
      <Button variant="default">Reset filters</Button>
    </EmptyState.Actions>
  </EmptyState>
</template>
`

const Demo = defineComponent({
  name: 'EmptyStateStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        EmptyState,
        {
          title: 'No results found',
          description:
            "We couldn't find anything matching your search. Try adjusting your filters or searching with different keywords to see more results.",
          ...attrs,
        },
        {
          icon: () => h(PhMagnifyingGlass),
          default: () =>
            h(EmptyState.Actions, null, () =>
              h(Button, { variant: 'default' }, () => 'Reset filters'),
            ),
        },
      )
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      body: 'Wrapper of title, description and actions',
      indicator: '`EmptyState.Indicator` component',
      title: '`EmptyState.Title` component',
      description: '`EmptyState.Description` component',
      actions: '`EmptyState.Actions` component',
    },
  },
  component: Demo,
  code,
  centered: true,
  maxWidth: 440,
}
