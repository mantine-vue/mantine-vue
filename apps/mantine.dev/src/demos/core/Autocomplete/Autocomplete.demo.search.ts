import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
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
  <Autocomplete
    label="Your country"
    placeholder="Pick value or enter anything"
    :data="['Great Britain', 'Russian Federation', 'United States']"
    :filter="optionsFilter"
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
  name: 'AutocompleteSearchDemo',
  setup: () => () =>
    h(Autocomplete, {
      label: 'Your country',
      placeholder: 'Pick value or enter anything',
      data: ['Great Britain', 'Russian Federation', 'United States'],
      filter: optionsFilter,
    }),
})

export const search: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
