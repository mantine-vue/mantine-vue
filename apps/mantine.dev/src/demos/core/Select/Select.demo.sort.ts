import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'

const optionsFilter = ({ options, search }) => {
  const filtered = options.filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  )
  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}
</script>

<template>
  <Select
    label="Your favorite library"
    placeholder="Pick value"
    :data="['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte']"
    :filter="optionsFilter"
    nothing-found-message="Nothing found..."
    searchable
  />
</template>
`

const optionsFilter = ({
  options,
  search,
}: {
  options: { value: string; label: string }[]
  search: string
}) => {
  const filtered = options.filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
  )
  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}

const Demo = defineComponent({
  name: 'SelectSortDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
      data: ['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte'],
      filter: optionsFilter,
      nothingFoundMessage: 'Nothing found...',
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
