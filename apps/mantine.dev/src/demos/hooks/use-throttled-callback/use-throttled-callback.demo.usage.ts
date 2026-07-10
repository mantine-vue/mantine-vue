import { defineComponent, h, ref } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useThrottledCallback } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useThrottledCallback } from '@mantine-vue/hooks'

const throttledValue = ref('')
const throttledSetValue = useThrottledCallback((value: string) => {
  throttledValue.value = value
}, 1000)
</script>

<template>
  <TextInput
    placeholder="Search"
    @input="(event) => throttledSetValue((event.target as HTMLInputElement).value)"
  />
  <Text>Throttled value: {{ throttledValue || '–' }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseThrottledCallbackUsageDemo',
  setup() {
    const throttledValue = ref('')
    const throttledSetValue = useThrottledCallback((value: string) => {
      throttledValue.value = value
    }, 1000)

    return () => [
      h(TextInput, {
        placeholder: 'Search',
        onInput: (event: Event) => throttledSetValue((event.target as HTMLInputElement).value),
      }),
      h(Text, null, () => `Throttled value: ${throttledValue.value || '–'}`),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
