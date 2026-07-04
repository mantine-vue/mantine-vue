import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'

const optionsFilter = ({ options, search }) => {
  const filtered = options.filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  )
  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}
</script>

<template>
  <TagsInput
    label="Your favorite libraries"
    placeholder="Pick value or enter anything"
    :data="['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte']"
    :filter="optionsFilter"
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
  name: 'TagsInputSortDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Your favorite libraries',
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
