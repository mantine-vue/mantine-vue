import { defineComponent, h } from 'vue'
import Fuse from 'fuse.js'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import Fuse from 'fuse.js'
import { MultiSelect } from '@mantine-vue/core'
import type { ComboboxItem, OptionsFilter } from '@mantine-vue/core'

const optionsFilter: OptionsFilter = ({ options, search }) => {
  if (!search.trim()) return options
  const fuse = new Fuse(options as ComboboxItem[], {
    keys: ['label'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })
  return fuse.search(search).map((result) => result.item)
}
</script>

<template>
  <MultiSelect
    label="What countries have you visited?"
    placeholder="Pick values"
    :data="['Great Britain', 'Russian Federation', 'United States', 'Germany', 'France']"
    :filter="optionsFilter"
    searchable
  />
</template>
`

const optionsFilter = ({ options, search }: { options: any[]; search: string }) => {
  if (!search.trim()) return options
  const fuse = new Fuse(options, { keys: ['label'], threshold: 0.3, minMatchCharLength: 1 })
  return fuse.search(search).map((result) => result.item)
}

const Demo = defineComponent({
  name: 'MultiSelectFuzzySearchDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'What countries have you visited?',
      placeholder: 'Pick values',
      data: ['Great Britain', 'Russian Federation', 'United States', 'Germany', 'France'],
      filter: optionsFilter,
      searchable: true,
    }),
})

export const fuzzySearch: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
