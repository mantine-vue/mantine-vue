import { defineComponent, h, ref } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useThrottledValue } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useThrottledValue } from '@mantine-vue/hooks'

const value = ref('')
const throttledValue = useThrottledValue(value, 1000)
</script>

<template>
  <TextInput placeholder="Search" v-model="value" />
  <Text>Throttled value: {{ throttledValue || '–' }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseThrottledValueUsageDemo',
  setup() {
    const value = ref('')
    const throttledValue = useThrottledValue(value, 1000)

    return () =>
      h('div', [
        h(TextInput, {
          placeholder: 'Search',
          modelValue: value.value,
          'onUpdate:modelValue': (v: string) => (value.value = v),
        }),
        h(Text, () => `Throttled value: ${throttledValue.value || '–'}`),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
