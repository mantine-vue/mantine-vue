import { defineComponent, h } from 'vue'
import { MaskInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MaskInput } from '@mantine-vue/core'
</script>

<template>
  <MaskInput
    label="Credit card"
    placeholder="____ ____ ____ ____"
    mask="9999 9999 9999 9999"
    :modify="(value) => /^3[47]/.test(value) ? { mask: '9999 999999 99999' } : undefined"
  />
</template>
`

const Demo = defineComponent({
  name: 'MaskInputDynamicDemo',
  setup: () => () =>
    h(MaskInput, {
      label: 'Credit card',
      placeholder: '____ ____ ____ ____',
      mask: '9999 9999 9999 9999',
      modify: (value: string) => {
        if (/^3[47]/.test(value)) {
          return { mask: '9999 999999 99999' }
        }
        return undefined
      },
    }),
})

export const dynamic: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
