import { defineComponent, h } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'

const { ref, rawValue } = useMask({
  mask: '\\\\#hhhhhh',
  tokens: { h: /[0-9a-fA-F]/ },
})
</script>

<template>
  <TextInput :root-ref="ref" label="Hex color" placeholder="#______" />
  <Text size="sm" mt="sm">Raw value: {{ rawValue }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMaskCustomTokensDemo',
  setup() {
    const { ref, rawValue } = useMask({
      mask: '\\#hhhhhh',
      tokens: { h: /[0-9a-fA-F]/ },
    })

    return () =>
      h('div', [
        h(TextInput, { rootRef: ref, label: 'Hex color', placeholder: '#______' }),
        h(Text, { size: 'sm', mt: 'sm' }, { default: () => `Raw value: ${rawValue.value}` }),
      ])
  },
})

export const customTokens: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
