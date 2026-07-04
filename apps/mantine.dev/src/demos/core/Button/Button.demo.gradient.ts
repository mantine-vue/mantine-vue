import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <Button variant="gradient" :gradient="{ from: 'blue', to: 'cyan', deg: 90 }">
    Gradient button
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'ButtonGradientDemo',
  setup: () => () =>
    h(
      Button,
      { variant: 'gradient', gradient: { from: 'blue', to: 'cyan', deg: 90 } },
      { default: () => 'Gradient button' },
    ),
})

export const gradient: MantineDemo = { type: 'code', component: Demo, code, centered: true }
