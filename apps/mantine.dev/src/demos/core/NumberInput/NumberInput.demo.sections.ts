import { defineComponent, h } from 'vue'
import { PhCurrencyEth } from '@phosphor-icons/vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCurrencyEth } from '@phosphor-icons/vue'
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput label="With left section" placeholder="With left section">
    <template #leftSection>
      <PhCurrencyEth :size="20" />
    </template>
  </NumberInput>
  <NumberInput label="With right section" placeholder="With right section" mt="md" hideControls>
    <template #rightSection>
      <PhCurrencyEth :size="20" />
    </template>
  </NumberInput>
</template>
`

const Demo = defineComponent({
  name: 'NumberInputSectionsDemo',
  setup: () => () =>
    h('div', null, [
      h(NumberInput, {
        leftSection: h(PhCurrencyEth, { size: 20 }),
        label: 'With left section',
        placeholder: 'With left section',
      }),
      h(NumberInput, {
        rightSection: h(PhCurrencyEth, { size: 20 }),
        label: 'With right section',
        placeholder: 'With right section',
        mt: 'md',
        hideControls: true,
      }),
    ]),
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
