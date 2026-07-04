import { defineComponent, h } from 'vue'
import { Input, InputWrapper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Input, InputWrapper } from '@mantine-vue/core'
</script>

<template>
  <InputWrapper{{props}}>
    <Input placeholder="Input inside InputWrapper" />
  </InputWrapper>
</template>
`

const Wrapper = defineComponent({
  name: 'InputWrapperDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        InputWrapper,
        { ...attrs },
        {
          default: () => h(Input, { placeholder: 'Input inside InputWrapper' }),
        },
      )
  },
})

export const wrapper: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 440,
  controls: [
    { type: 'string', prop: 'label', initialValue: 'Input label', libraryValue: null },
    { type: 'boolean', prop: 'withAsterisk', initialValue: false, libraryValue: false },
    { type: 'string', prop: 'description', initialValue: 'Input description', libraryValue: null },
    { type: 'string', prop: 'error', initialValue: 'Input error', libraryValue: null },
    { type: 'size', prop: 'size', initialValue: 'sm', libraryValue: 'sm' },
  ],
}
