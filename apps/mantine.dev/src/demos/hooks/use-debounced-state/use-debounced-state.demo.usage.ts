import { defineComponent, h } from 'vue'
import { Box, Text, TextInput } from '@mantine-vue/core'
import { useDebouncedState } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDebouncedState } from '@mantine-vue/hooks'
import { TextInput, Text } from '@mantine-vue/core'

const [value, setValue] = useDebouncedState('', 200)

function handleChange(event: Event) {
  setValue((event.target as HTMLInputElement).value)
}
</script>

<template>
  <TextInput
    label="Enter value to see debounce effect"
    placeholder="Enter value to see debounce effect"
    :value="value"
    @input="handleChange"
  />
  <Text mt="sm">
    <Text component="span" c="dimmed" size="sm">Debounced value:</Text>
    {{ value.trim() || '[empty string]' }}
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseDebouncedStateUsageDemo',
  setup() {
    const [value, setValue] = useDebouncedState('', 200)

    const handleChange = (event: Event) => {
      setValue((event.target as HTMLInputElement).value)
    }

    return () =>
      h(
        Box,
        { maw: 400, mx: 'auto' },
        {
          default: () => [
            h(TextInput, {
              label: 'Enter value to see debounce effect',
              placeholder: 'Enter value to see debounce effect',
              value: value.value,
              onInput: handleChange,
            }),
            h(
              Text,
              { mt: 'sm' },
              {
                default: () => [
                  h(
                    Text,
                    { component: 'span', c: 'dimmed', size: 'sm' },
                    { default: () => 'Debounced value: ' },
                  ),
                  value.value.trim() || '[empty string]',
                ],
              },
            ),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
