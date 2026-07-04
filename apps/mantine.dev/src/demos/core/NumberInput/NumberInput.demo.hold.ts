import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Step on hold"
    description="Step value when clicking and holding increment/decrement buttons"
    placeholder="Hold mouse down on control button"
    :stepHoldDelay="500"
    :stepHoldInterval="100"
  />

  <NumberInput
    label="Step the value with interval function"
    description="Steps get faster over time when holding the control button"
    placeholder="Hold mouse down on control button"
    :stepHoldDelay="500"
    :stepHoldInterval="(t) => Math.max(1000 / t ** 2, 25)"
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputHoldDemo',
  setup: () => () =>
    h('div', null, [
      h(NumberInput, {
        label: 'Step on hold',
        description: 'Step value when clicking and holding increment/decrement buttons',
        placeholder: 'Hold mouse down on control button',
        stepHoldDelay: 500,
        stepHoldInterval: 100,
      }),
      h(NumberInput, {
        label: 'Step the value with interval function',
        description: 'Steps get faster over time when holding the control button',
        placeholder: 'Hold mouse down on control button',
        stepHoldDelay: 500,
        stepHoldInterval: (t: number) => Math.max(1000 / t ** 2, 25),
        mt: 'md',
      }),
    ]),
})

export const hold: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
