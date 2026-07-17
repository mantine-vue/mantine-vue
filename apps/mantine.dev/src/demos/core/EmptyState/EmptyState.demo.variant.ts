import { defineComponent, h } from 'vue'
import { EmptyState } from '@mantine-vue/core'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { EmptyState } from '@mantine-vue/core'
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
  </EmptyState>
</template>
`

const Wrapper = defineComponent({
  name: 'EmptyStateVariantDemo',
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
        { icon: () => h(PhMagnifyingGlass) },
      )
  },
})

export const variant: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 420,
  controls: [
    {
      prop: 'variant',
      type: 'segmented',
      data: [
        { value: 'filled', label: 'Filled' },
        { value: 'light', label: 'Light' },
      ],
      initialValue: 'light',
      libraryValue: 'light',
    },
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
  ],
}
