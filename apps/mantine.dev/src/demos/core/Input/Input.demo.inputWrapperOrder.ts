import { defineComponent, h } from 'vue'
import { TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TextInput } from '@mantine-vue/core'
</script>

<template>
  <div>
    <TextInput
      label="Custom layout"
      placeholder="Custom layout"
      description="Description below the input"
      :inputWrapperOrder="['label', 'error', 'input', 'description']"
    />
    <TextInput
      mt="xl"
      label="Custom layout"
      placeholder="Custom layout"
      description="Error and description are"
      error="both below the input"
      :inputWrapperOrder="['label', 'input', 'description', 'error']"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'InputWrapperOrderDemo',
  setup: () => () =>
    h('div', null, [
      h(TextInput, {
        label: 'Custom layout',
        placeholder: 'Custom layout',
        description: 'Description below the input',
        inputWrapperOrder: ['label', 'error', 'input', 'description'],
      }),
      h(TextInput, {
        mt: 'xl',
        label: 'Custom layout',
        placeholder: 'Custom layout',
        description: 'Error and description are',
        error: 'both below the input',
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      }),
    ]),
})

export const inputWrapperOrder: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
