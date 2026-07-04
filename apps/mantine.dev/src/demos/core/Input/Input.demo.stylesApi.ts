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
    selectors: {
      wrapper: 'Root element of the Input',
      input: 'Input element',
      section: 'Left and right sections',
    },
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
