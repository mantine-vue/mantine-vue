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

const Wrapper = defineComponent({
  name: 'EmptyStateUsageDemo',
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

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 420,
  controls: [
    { prop: 'size', type: 'size', libraryValue: 'md', initialValue: 'md' },
    {
      prop: 'align',
      type: 'segmented',
      data: [
        { value: 'center', label: 'Center' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      initialValue: 'center',
      libraryValue: 'center',
    },
    {
      prop: 'withIndicatorBackground',
      type: 'boolean',
      libraryValue: false,
      initialValue: false,
    },
  ],
}
