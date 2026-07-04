import { defineComponent, h } from 'vue'
import Fuse from 'fuse.js'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import Fuse from 'fuse.js'
import { Autocomplete } from '@mantine-vue/core'
import type { ComboboxItem, OptionsFilter } from '@mantine-vue/core'

const optionsFilter: OptionsFilter = ({ options, search }) => {
  if (!search.trim()) {
    return options
  }

  const fuse = new Fuse(options as ComboboxItem[], {
    keys: ['label'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })

  return fuse.search(search).map((result) => result.item)
}
</script>

<template>
  <Autocomplete
    label="Your favorite library"
    placeholder="Pick value or enter anything"
    :data="['React', 'Angular', 'Vue', 'Svelte', 'Ember']"
    :filter="optionsFilter"
  />
</template>
`

const optionsFilter = ({ options, search }: { options: any[]; search: string }) => {
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
  name: 'AutocompleteFuzzySearchDemo',
  setup: () => () =>
    h(Autocomplete, {
      label: 'Your favorite library',
      placeholder: 'Pick value or enter anything',
      data: ['React', 'Angular', 'Vue', 'Svelte', 'Ember'],
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
