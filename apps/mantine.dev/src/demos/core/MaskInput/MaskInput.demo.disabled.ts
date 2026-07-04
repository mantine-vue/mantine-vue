import { defineComponent, h } from 'vue'
import { MaskInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MaskInput } from '@mantine-vue/core'
</script>

<template>
  <MaskInput
    label="Phone number"
    placeholder="(___) ___-____"
    mask="(999) 999-9999"
    disabled
  />
</template>
`

const Demo = defineComponent({
  name: 'MaskInputDisabledDemo',
  setup: () => () =>
    h(MaskInput, {
      label: 'Phone number',
      placeholder: '(___) ___-____',
      mask: '(999) 999-9999',
      disabled: true,
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
