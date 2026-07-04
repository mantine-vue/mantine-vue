import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Leading zeros removed on blur"
    placeholder="Type 00100 and click outside"
    trimLeadingZeroesOnBlur
    defaultValue="00100"
  />

  <NumberInput
    label="Leading zeros preserved"
    placeholder="Type 00100 and click outside"
    :trimLeadingZeroesOnBlur="false"
    defaultValue="00100"
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputTrimLeadingZeroesDemo',
  setup: () => () =>
    h('div', null, [
      h(NumberInput, {
        label: 'Leading zeros removed on blur',
        placeholder: 'Type 00100 and click outside',
        trimLeadingZeroesOnBlur: true,
        defaultValue: '00100',
      }),
      h(NumberInput, {
        label: 'Leading zeros preserved',
        placeholder: 'Type 00100 and click outside',
        trimLeadingZeroesOnBlur: false,
        defaultValue: '00100',
        mt: 'md',
      }),
    ]),
})

export const trimLeadingZeroes: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
