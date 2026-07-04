import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    placeholder="Pick values"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    loading
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectLoadingDemo',
  setup: () => () =>
    h(MultiSelect, {
      placeholder: 'Pick values',
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
