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
    :data="[
      { value: 'react', label: 'React' },
      { value: 'ng', label: 'Angular' },
      { value: 'vue', label: 'Vue', disabled: true },
      { value: 'svelte', label: 'Svelte', disabled: true },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectDisabledOptionsDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
      data: [
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
        { value: 'vue', label: 'Vue', disabled: true },
        { value: 'svelte', label: 'Svelte', disabled: true },
      ],
    }),
})

export const disabledOptions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
