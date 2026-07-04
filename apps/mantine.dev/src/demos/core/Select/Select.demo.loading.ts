import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    loading
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectLoadingDemo',
  setup: () => () =>
    h(Select, {
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      loading: true,
    }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
