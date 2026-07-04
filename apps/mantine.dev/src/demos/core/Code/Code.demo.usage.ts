import { defineComponent, h } from 'vue'
import { Code } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Code } from '@mantine-vue/core'
</script>

<template>
  <Code>h('div', {}, 'Hello')</Code>
</template>
`

const Demo = defineComponent({
  name: 'CodeUsageDemo',
  setup() {
    return () => h(Code, {}, { default: () => "h('div', {}, 'Hello')" })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
