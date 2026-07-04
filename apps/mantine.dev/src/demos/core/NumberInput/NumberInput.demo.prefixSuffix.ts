import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="With prefix"
    placeholder="Dollars"
    prefix="$"
    :defaultValue="100"
    mb="md"
  />
  <NumberInput
    label="With suffix"
    placeholder="Percents"
    suffix="%"
    :defaultValue="100"
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputPrefixSuffixDemo',
  setup: () => () =>
    h('div', null, [
      h(NumberInput, {
        label: 'With prefix',
        placeholder: 'Dollars',
        prefix: '$',
        defaultValue: 100,
        mb: 'md',
      }),
      h(NumberInput, {
        label: 'With suffix',
        placeholder: 'Percents',
        suffix: '%',
        defaultValue: 100,
        mt: 'md',
      }),
    ]),
})

export const prefixSuffix: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
