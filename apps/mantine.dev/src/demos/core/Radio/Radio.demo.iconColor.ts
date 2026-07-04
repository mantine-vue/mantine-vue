import { defineComponent, h } from 'vue'
import { Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio } from '@mantine-vue/core'
</script>

<template>
  <Radio
    icon-color="dark.8"
    color="lime.4"
    label="Custom icon color"
    name="check"
    value="check"
    default-checked
  />
</template>
`

const Demo = defineComponent({
  name: 'RadioIconColorDemo',
  setup: () => () =>
    h(Radio, {
      iconColor: 'dark.8',
      color: 'lime.4',
      label: 'Custom icon color',
      name: 'check',
      value: 'check',
      defaultChecked: true,
    }),
})

export const iconColor: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
