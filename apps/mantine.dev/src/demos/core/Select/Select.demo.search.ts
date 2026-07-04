import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'

const optionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ')
  return options.filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ')
    return splittedSearch.every((searchWord) => words.some((word) => word.includes(searchWord)))
  })
}
</script>

<template>
  <Select
    label="Your country"
    placeholder="Pick value"
    :data="['Great Britain', 'Russian Federation', 'United States']"
    :filter="optionsFilter"
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
  const splittedSearch = search.toLowerCase().trim().split(' ')
  return options.filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ')
    return splittedSearch.every((searchWord: string) =>
      words.some((word: string) => word.includes(searchWord)),
    )
  })
}

const Demo = defineComponent({
  name: 'SelectSearchDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your country',
      placeholder: 'Pick value',
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
