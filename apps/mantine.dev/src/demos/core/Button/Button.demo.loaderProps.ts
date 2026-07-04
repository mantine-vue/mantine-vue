import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <Button loading :loader-props="{ type: 'dots' }">
    Loading button
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'ButtonLoaderPropsDemo',
  setup: () => () =>
    h(
      Button,
      { loading: true, loaderProps: { type: 'dots' } },
      { default: () => 'Loading button' },
    ),
})

export const loaderProps: MantineDemo = { type: 'code', component: Demo, code, centered: true }
