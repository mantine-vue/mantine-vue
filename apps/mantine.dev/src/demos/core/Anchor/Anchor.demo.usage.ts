import { defineComponent, h } from 'vue'
import { Anchor } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Anchor } from '@mantine-vue/core'
</script>

<template>
  <Anchor href="https://mantine.dev/" target="_blank">
    Anchor component
  </Anchor>
</template>
`

const Demo = defineComponent({
  name: 'AnchorUsageDemo',
  setup() {
    return () =>
      h(
        Anchor,
        { href: 'https://mantine.dev/', target: '_blank' },
        {
          default: () => 'Anchor component',
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
