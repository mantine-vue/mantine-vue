import { defineComponent, h } from 'vue'
import { InputDescription, InputError, InputLabel } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { InputLabel, InputDescription, InputError } from '@mantine-vue/core'
</script>

<template>
  <div>
    <InputLabel required>Input label</InputLabel>
    <InputDescription>Input description</InputDescription>
    <InputError>Input error</InputError>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'InputCompoundDemo',
  setup: () => () =>
    h('div', null, [
      h(InputLabel, { required: true }, { default: () => 'Input label' }),
      h(InputDescription, {}, { default: () => 'Input description' }),
      h(InputError, {}, { default: () => 'Input error' }),
    ]),
})

export const compound: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
