import { defineComponent, h } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'

const { ref, rawValue } = useMask({
  mask: '9999 9999 9999 9999',
  modify: (value) => {
    const digits = value.replace(/\\D/g, '')
    if (digits.startsWith('34') || digits.startsWith('37')) {
      return { mask: '9999 999999 99999' }
    }
  },
})
</script>

<template>
  <TextInput :root-ref="ref" label="Credit card number" placeholder="Enter card number" />
  <Text size="sm" mt="sm">Raw value: {{ rawValue }}</Text>
  <Text size="xs" c="dimmed">Try starting with 34 or 37 for Amex format</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMaskDynamicDemo',
  setup() {
    const { ref, rawValue } = useMask({
      mask: '9999 9999 9999 9999',
      modify: (value: string) => {
        const digits = value.replace(/\D/g, '')
        if (digits.startsWith('34') || digits.startsWith('37')) {
          return { mask: '9999 999999 99999' }
        }
        return undefined
      },
    })

    return () =>
      h('div', [
        h(TextInput, {
          rootRef: ref,
          label: 'Credit card number',
          placeholder: 'Enter card number',
        }),
        h(Text, { size: 'sm', mt: 'sm' }, { default: () => `Raw value: ${rawValue.value}` }),
        h(
          Text,
          { size: 'xs', c: 'dimmed' },
          { default: () => 'Try starting with 34 or 37 for Amex format' },
        ),
      ])
  },
})

export const dynamic: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
