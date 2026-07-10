import { defineComponent, h } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'

const { ref, rawValue } = useMask({
  mask: '\\\\A-9999',
})
</script>

<template>
  <TextInput :root-ref="ref" label="Product code" placeholder="A-____" />
  <Text size="sm" mt="sm">Raw value: {{ rawValue }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMaskEscapeDemo',
  setup() {
    const { ref, rawValue } = useMask({
      mask: '\\A-9999',
    })

    return () =>
      h('div', [
        h(TextInput, { rootRef: ref, label: 'Product code', placeholder: 'A-____' }),
        h(Text, { size: 'sm', mt: 'sm' }, { default: () => `Raw value: ${rawValue.value}` }),
      ])
  },
})

export const escape: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
