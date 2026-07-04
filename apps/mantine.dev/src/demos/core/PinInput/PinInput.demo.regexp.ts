import { defineComponent, h } from 'vue'
import { PinInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PinInput } from '@mantine-vue/core'
</script>

<template>
  <PinInput :type="/^[0-3]*$/" inputType="tel" inputMode="numeric" />
</template>
`

const Demo = defineComponent({
  name: 'PinInputRegexpDemo',
  setup: () => () =>
    h(PinInput, {
      type: /^[0-3]*$/,
      inputType: 'tel',
      inputMode: 'numeric',
    }),
})

export const regexp: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
