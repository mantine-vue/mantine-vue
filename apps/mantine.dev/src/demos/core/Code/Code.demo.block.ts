import { defineComponent, h } from 'vue'
import { Code } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Code } from '@mantine-vue/core'

const codeForPreviousDemo = \`<template>
  <Code>h('div', {}, 'Hello')</Code>
</template>\`
</script>

<template>
  <Code block>{{ codeForPreviousDemo }}</Code>
</template>
`

const codeForPreviousDemo = `<template>
  <Code>h('div', {}, 'Hello')</Code>
</template>`

const Demo = defineComponent({
  name: 'CodeBlockDemo',
  setup() {
    return () => h(Code, { block: true }, { default: () => codeForPreviousDemo })
  },
})

export const block: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
