import Fuse from 'fuse.js'
import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import Fuse from 'fuse.js'
import { TagsInput } from '@mantine-vue/core'

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
  <TagsInput
    label="Favorite fruits"
    placeholder="Pick value or enter anything"
    :data="['Apple', 'Banana', 'Kiwi', 'Mango', 'Watermelon', 'Raspberry']"
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
  name: 'TagsInputFuzzySearchDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Favorite fruits',
      placeholder: 'Pick value or enter anything',
      data: ['Apple', 'Banana', 'Kiwi', 'Mango', 'Watermelon', 'Raspberry'],
      filter: optionsFilter,
    }),
})

export const fuzzySearch: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
