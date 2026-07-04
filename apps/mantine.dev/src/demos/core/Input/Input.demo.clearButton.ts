import { defineComponent, h, ref } from 'vue'
import { Input, InputClearButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Input, InputClearButton } from '@mantine-vue/core'

const value = ref('clearable')
</script>

<template>
  <Input
    placeholder="Clearable input"
    v-model="value"
    :rightSection="value !== '' ? h(InputClearButton, { onClick: () => value = '' }) : undefined"
    rightSectionPointerEvents="auto"
    {{props}}
  />
</template>
`

const Wrapper = defineComponent({
  name: 'InputClearButtonDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const value = ref('clearable')
    return () =>
      h(Input, {
        placeholder: 'Clearable input',
        value: value.value,
        onInput: (e: Event) => {
          value.value = (e.target as HTMLInputElement).value
        },
        rightSection:
          value.value !== ''
            ? h(InputClearButton, {
                onClick: () => {
                  value.value = ''
                },
              })
            : undefined,
        rightSectionPointerEvents: 'auto',
        ...attrs,
      })
  },
})

export const clearButton: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  maxWidth: 340,
  centered: true,
  controls: [{ type: 'size', prop: 'size', initialValue: 'sm', libraryValue: '__' }],
}
