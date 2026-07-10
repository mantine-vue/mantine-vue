import { defineComponent, h } from 'vue'
import { Box, Button, Text, TextInput } from '@mantine-vue/core'
import { useFocusWithin } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useFocusWithin } from '@mantine-vue/hooks'
import { TextInput, Button, Box, Text } from '@mantine-vue/core'

const { ref: focusRef, focused } = useFocusWithin()
</script>

<template>
  <div ref="focusRef">
    <Box p="xl" :style="{ backgroundColor: focused ? 'var(--mantine-color-blue-light)' : 'transparent' }">
      <Text size="sm">One of elements has focus: {{ focused.toString() }}</Text>
      <TextInput label="Focus this input" placeholder="Styles will be added to parent" />
      <Button mt="md">Button</Button>
    </Box>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseFocusWithinUsageDemo',
  setup() {
    const { ref: focusRef, focused } = useFocusWithin()

    return () =>
      h('div', { ref: focusRef }, [
        h(
          Box,
          {
            p: 'xl',
            style: {
              backgroundColor: focused.value ? 'var(--mantine-color-blue-light)' : 'transparent',
            },
          },
          () => [
            h(
              Text,
              { size: 'sm' },
              { default: () => `One of elements has focus: ${focused.value}` },
            ),
            h(TextInput, {
              label: 'Focus this input',
              placeholder: 'Styles will be added to parent',
            }),
            h(Button, { mt: 'md' }, { default: () => 'Button' }),
          ],
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
