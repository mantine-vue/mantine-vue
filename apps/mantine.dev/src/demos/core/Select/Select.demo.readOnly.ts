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
    read-only
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectReadOnlyDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      readOnly: true,
    }),
})

export const readOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
