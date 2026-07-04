import { defineComponent, h } from 'vue'
import { PhAt, PhCaretDown } from '@phosphor-icons/vue'
import { Input } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt, PhCaretDown } from '@phosphor-icons/vue'
import { Input } from '@mantine-vue/core'
</script>

<template>
  <Input
    {{props}}
    placeholder="Input component"
    :leftSection="h(PhAt, { size: 16 })"
    :rightSection="h(PhCaretDown, { size: 16 })"
  />
</template>
`

const Wrapper = defineComponent({
  name: 'InputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Input, {
        placeholder: 'Input component',
        leftSection: h(PhAt, { size: 16 }),
        rightSection: h(PhCaretDown, { size: 16 }),
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: [
      { selector: 'wrapper', description: 'Root element of the Input' },
      { selector: 'input', description: 'Input element' },
      { selector: 'section', description: 'Left and right sections' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
