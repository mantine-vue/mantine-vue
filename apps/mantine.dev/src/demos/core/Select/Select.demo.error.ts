import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    label="Boolean error"
    placeholder="Boolean error"
    error
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
  <Select
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid name"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(Select, {
        label: 'Boolean error',
        placeholder: 'Boolean error',
        error: true,
        data: ['React', 'Angular', 'Vue', 'Svelte'],
      }),
      h(Select, {
        mt: 'md',
        label: 'With error message',
        placeholder: 'With error message',
        error: 'Invalid name',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
