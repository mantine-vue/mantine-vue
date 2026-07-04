import { defineComponent, h } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { UnstyledButton } from '@mantine-vue/core'
</script>

<template>
  <UnstyledButton>Button without styles</UnstyledButton>
</template>
`

const Demo = defineComponent({
  name: 'UnstyledButtonUsageDemo',
  setup() {
    return () => h(UnstyledButton, {}, { default: () => 'Button without styles' })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
