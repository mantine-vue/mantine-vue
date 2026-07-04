import { defineComponent, h } from 'vue'
import { NativeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NativeSelect } from '@mantine-vue/core'
</script>

<template>
  <NativeSelect
    label="Your favorite framework"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    loading
  />
</template>
`

const Demo = defineComponent({
  name: 'NativeSelectLoadingDemo',
  setup: () => () =>
    h(NativeSelect, {
      label: 'Your favorite framework',
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
