import { defineComponent, h } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useThrottledState } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useThrottledState } from '@mantine-vue/hooks'
import { Text, TextInput } from '@mantine-vue/core'

const [throttledValue, setThrottledValue] = useThrottledState('', 1000)
</script>

<template>
  <TextInput
    placeholder="Search"
    @input="(event) => setThrottledValue((event.target as HTMLInputElement).value)"
  />
  <Text>Throttled value: {{ throttledValue || '–' }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseThrottledStateUsageDemo',
  setup() {
    const [throttledValue, setThrottledValue] = useThrottledState('', 1000)

    return () => [
      h(TextInput, {
        placeholder: 'Search',
        onInput: (event: Event) => setThrottledValue((event.target as HTMLInputElement).value),
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
