import { defineComponent, h } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useInputState, usePrevious } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TextInput, Text } from '@mantine-vue/core'
import { usePrevious, useInputState } from '@mantine-vue/hooks'

const [value, setValue] = useInputState('')
const previousValue = usePrevious(value)
</script>

<template>
  <div>
    <TextInput
      label="Enter some text here"
      placeholder="Enter some text here"
      id="previous-demo-input"
      :value="value"
      @input="setValue"
    />
    <Text mt="md">Current value: {{ value }}</Text>
    <Text>Previous value: {{ previousValue }}</Text>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UsePreviousUsageDemo',
  setup() {
    const [value, setValue] = useInputState('')
    const previousValue = usePrevious(value)

    return () =>
      h('div', [
        h(TextInput, {
          label: 'Enter some text here',
          placeholder: 'Enter some text here',
          id: 'previous-demo-input',
          value: value.value,
          onInput: setValue,
        }),
        h(Text, { mt: 'md' }, { default: () => `Current value: ${value.value}` }),
        h(Text, null, { default: () => `Previous value: ${previousValue.value ?? ''}` }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
