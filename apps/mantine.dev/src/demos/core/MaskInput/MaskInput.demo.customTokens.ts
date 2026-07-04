import { defineComponent, h } from 'vue'
import { MaskInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MaskInput } from '@mantine-vue/core'
</script>

<template>
  <MaskInput
    label="Hex color"
    placeholder="#______"
    mask="#hhhhhh"
    :tokens="{ h: /[0-9a-fA-F]/ }"
  />
</template>
`

const Demo = defineComponent({
  name: 'MaskInputCustomTokensDemo',
  setup: () => () =>
    h(MaskInput, {
      label: 'Hex color',
      placeholder: '#______',
      mask: '#hhhhhh',
      tokens: { h: /[0-9a-fA-F]/ },
    }),
})

export const customTokens: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
