import { defineComponent, h } from 'vue'
import { ActionIcon } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ActionIcon } from '@mantine-vue/core'
</script>

<template>
  <ActionIcon size="xl" loading :loader-props="{ type: 'dots' }" aria-label="Loading..." />
</template>
`

const Demo = defineComponent({
  name: 'ActionIconLoaderPropsDemo',
  setup: () => () =>
    h(ActionIcon, {
      size: 'xl',
      loading: true,
      loaderProps: { type: 'dots' },
      'aria-label': 'Loading...',
    }),
})

export const loaderProps: MantineDemo = { type: 'code', component: Demo, centered: true, code }
