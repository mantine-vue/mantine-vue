import { defineComponent, h, ref } from 'vue'
import { Box, Button, Group, Text, TextInput } from '@mantine-vue/core'
import { useDebouncedValue } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { useDebouncedValue } from '@mantine-vue/hooks'
import { TextInput, Text, Button } from '@mantine-vue/core'

const value = ref('')
const [debounced, cancel] = useDebouncedValue(value, 1000)
</script>

<template>
  <Group align="flex-end">
    <TextInput
      label="Enter value to see debounce effect"
      placeholder="Enter value to see debounce effect"
      v-model="value"
      style="flex: 1"
    />
    <Button @click="cancel">Cancel</Button>
  </Group>

  <Text mt="sm">
    <Text component="span" c="dimmed" size="sm">Value:</Text>
    {{ value.trim() || '[empty string]' }}
  </Text>
  <Text>
    <Text component="span" c="dimmed" size="sm">Debounced value:</Text>
    {{ debounced.trim() || '[empty string]' }}
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseDebouncedValueCancelDemo',
  setup() {
    const value = ref('')
    const [debounced, cancel] = useDebouncedValue(value, 1000)

    return () =>
      h(
        Box,
        { maw: 400, mx: 'auto' },
        {
          default: () => [
            h(
              Group,
              { align: 'flex-end' },
              {
                default: () => [
                  h(TextInput, {
                    label: 'Enter value to see debounce effect',
                    placeholder: 'Enter value to see debounce effect',
                    value: value.value,
                    style: { flex: 1 },
                    onInput: (event: Event) => {
                      value.value = (event.target as HTMLInputElement).value
                    },
                  }),
                  h(Button, { onClick: cancel }, { default: () => 'Cancel' }),
                ],
              },
            ),
            h(
              Text,
              { mt: 'sm' },
              {
                default: () => [
                  h(
                    Text,
                    { component: 'span', c: 'dimmed', size: 'sm' },
                    { default: () => 'Value: ' },
                  ),
                  value.value.trim() || '[empty string]',
                ],
              },
            ),
            h(
              Text,
              {},
              {
                default: () => [
                  h(
                    Text,
                    { component: 'span', c: 'dimmed', size: 'sm' },
                    { default: () => 'Debounced value: ' },
                  ),
                  debounced.value.trim() || '[empty string]',
                ],
              },
            ),
          ],
        },
      )
  },
})

export const cancel: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
