import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    label="Your favorite library"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    searchable
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectSearchableDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      searchable: true,
    }),
})

export const searchable: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
