import { defineComponent, h } from 'vue'
import { MaskInput, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MaskInput, Text } from '@mantine-vue/core'
</script>

<template>
  <MaskInput
    label="Promo code"
    placeholder="AAA-9999"
    mask="AAA-9999"
    :transform="(char) => char.toUpperCase()"
    slotChar="XXX-0000"
  />
  <Text size="sm" mt="sm" c="dimmed">
    Type lowercase letters – they will be auto-uppercased
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'MaskInputTransformDemo',
  setup: () => () =>
    h('div', null, [
      h(MaskInput, {
        label: 'Promo code',
        placeholder: 'AAA-9999',
        mask: 'AAA-9999',
        transform: (char: string) => char.toUpperCase(),
        slotChar: 'XXX-0000',
      }),
      h(
        Text,
        { size: 'sm', mt: 'sm', c: 'dimmed' },
        { default: () => 'Type lowercase letters – they will be auto-uppercased' },
      ),
    ]),
})

export const transform: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
