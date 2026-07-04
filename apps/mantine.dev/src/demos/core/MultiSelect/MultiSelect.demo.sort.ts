import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
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
  <MultiSelect
    label="Your favorite libraries"
    placeholder="Pick values"
    :data="['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte']"
    :filter="optionsFilter"
    searchable
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
  name: 'MultiSelectSortDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Pick values',
      data: ['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte'],
      filter: optionsFilter,
      searchable: true,
    }),
})

export const sort: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
