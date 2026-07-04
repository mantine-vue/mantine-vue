import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
import type { ComboboxItem, OptionsFilter } from '@mantine-vue/core'

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const filtered = (options as ComboboxItem[]).filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  )
  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}
</script>

<template>
  <Autocomplete
    label="Your favorite library"
    placeholder="Pick value or enter anything"
    :data="['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte']"
    :filter="optionsFilter"
  />
</template>
`

const optionsFilter = ({ options, search }: { options: any[]; search: string }) => {
  const filtered = options.filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
  )
  filtered.sort((a: any, b: any) => a.label.localeCompare(b.label))
  return filtered
}

const Demo = defineComponent({
  name: 'AutocompleteSortDemo',
  setup: () => () =>
    h(Autocomplete, {
      label: 'Your favorite library',
      placeholder: 'Pick value or enter anything',
      data: ['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte'],
      filter: optionsFilter,
    }),
})

export const sort: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
