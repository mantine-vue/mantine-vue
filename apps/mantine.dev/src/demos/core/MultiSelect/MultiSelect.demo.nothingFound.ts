import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    label="Your favorite libraries"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    searchable
    nothing-found-message="Nothing found..."
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectNothingFoundDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      searchable: true,
      nothingFoundMessage: 'Nothing found...',
    }),
})

export const nothingFound: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
