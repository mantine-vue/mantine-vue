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
  <EmptyState>
    <EmptyState.Indicator>
      <PhMagnifyingGlass />
    </EmptyState.Indicator>
    <EmptyState.Title>No results found</EmptyState.Title>
    <EmptyState.Description>
      We couldn't find anything matching your search. Try adjusting your filters or searching with
      different keywords to see more results.
    </EmptyState.Description>
    <EmptyState.Actions>
      <Button variant="default">Reset filters</Button>
      <Button variant="default">Create new</Button>
    </EmptyState.Actions>
  </EmptyState>
</template>
`

const Demo = defineComponent({
  name: 'EmptyStateCompoundDemo',
  setup() {
    return () =>
      h(EmptyState, null, () => [
        h(EmptyState.Indicator, null, () => h(PhMagnifyingGlass)),
        h(EmptyState.Title, null, () => 'No results found'),
        h(
          EmptyState.Description,
          null,
          () =>
            "We couldn't find anything matching your search. Try adjusting your filters or searching with different keywords to see more results.",
        ),
        h(EmptyState.Actions, null, () => [
          h(Button, { variant: 'default' }, () => 'Reset filters'),
          h(Button, { variant: 'default' }, () => 'Create new'),
        ]),
      ])
  },
})

export const compound: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 440,
}
