import { defineComponent, h } from 'vue'
import { PhChartScatter } from '@phosphor-icons/vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhChartScatter } from '@phosphor-icons/vue'
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput label="Hide controls" placeholder="Hide controls" hideControls />
  <NumberInput
    label="Custom right section"
    placeholder="Custom right section"
    mt="md"
    rightSectionPointerEvents="none"
  >
    <template #rightSection>
      <PhChartScatter />
    </template>
  </NumberInput>
</template>
`

const Demo = defineComponent({
  name: 'NumberInputRightSectionDemo',
  setup: () => () =>
    h('div', null, [
      h(NumberInput, {
        label: 'Hide controls',
        placeholder: 'Hide controls',
        hideControls: true,
      }),
      h(NumberInput, {
        label: 'Custom right section',
        placeholder: 'Custom right section',
        mt: 'md',
        rightSection: h(PhChartScatter),
        rightSectionPointerEvents: 'none',
      }),
    ]),
})

export const rightSection: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
