import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
import type { ComboboxItem, OptionsFilter } from '@mantine-vue/core'

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ')
  return (options as ComboboxItem[]).filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ')
    return splittedSearch.every((searchWord) =>
      words.some((word) => word.includes(searchWord))
    )
  })
}
</script>

<template>
  <MultiSelect
    label="What countries have you visited?"
    placeholder="Pick values"
    :data="['Great Britain', 'Russian Federation', 'United States']"
    :filter="optionsFilter"
    searchable
  />
</template>
`

const optionsFilter = ({ options, search }: { options: any[]; search: string }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ')
  return options.filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ')
    return splittedSearch.every((searchWord: string) =>
      words.some((word: string) => word.includes(searchWord)),
    )
  })
}

const Demo = defineComponent({
  name: 'MultiSelectSearchDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'What countries have you visited?',
      placeholder: 'Pick values',
      data: ['Great Britain', 'Russian Federation', 'United States'],
      filter: optionsFilter,
      searchable: true,
    }),
})

export const search: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
