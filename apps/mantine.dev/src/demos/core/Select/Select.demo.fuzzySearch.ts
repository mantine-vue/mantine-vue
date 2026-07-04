import Fuse from 'fuse.js'
import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import Fuse from 'fuse.js'
import { Select } from '@mantine-vue/core'

const optionsFilter = ({ options, search }) => {
  if (!search.trim()) {
    return options
  }

  const fuse = new Fuse(options, {
    keys: ['label'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })

  return fuse.search(search).map((result) => result.item)
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
  if (!search.trim()) {
    return options
  }

  const fuse = new Fuse(options, {
    keys: ['label'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })

  return fuse.search(search).map((result) => result.item)
}

const Demo = defineComponent({
  name: 'SelectFuzzySearchDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your country',
      placeholder: 'Pick value',
      data: ['Great Britain', 'Russian Federation', 'United States'],
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
