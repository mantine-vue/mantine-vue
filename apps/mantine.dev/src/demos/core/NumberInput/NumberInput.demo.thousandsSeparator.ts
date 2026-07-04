import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Thousands are separated with a comma"
    placeholder="Thousands are separated with a comma"
    thousandSeparator=","
    :defaultValue="1000000"
  />

  <NumberInput
    label="Thousands are separated with a space"
    placeholder="Thousands are separated with a space"
    thousandSeparator=" "
    :defaultValue="1000000"
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputThousandsSeparatorDemo',
  setup: () => () =>
    h('div', null, [
      h(NumberInput, {
        label: 'Thousands are separated with a comma',
        placeholder: 'Thousands are separated with a comma',
        thousandSeparator: ',',
        defaultValue: 1_000_000,
      }),
      h(NumberInput, {
        label: 'Thousands are separated with a space',
        placeholder: 'Thousands are separated with a space',
        thousandSeparator: ' ',
        defaultValue: 1_000_000,
        mt: 'md',
      }),
    ]),
})

export const thousandsSeparator: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
