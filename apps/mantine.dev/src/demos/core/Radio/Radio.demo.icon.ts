import { defineComponent, h } from 'vue'
import { CheckIcon, Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio, CheckIcon } from '@mantine-vue/core'
</script>

<template>
  <Radio :icon="CheckIcon" label="Custom check icon" name="check" value="check" default-checked />
</template>
`

const Demo = defineComponent({
  name: 'RadioIconDemo',
  setup: () => () =>
    h(Radio, {
      icon: CheckIcon,
      label: 'Custom check icon',
      name: 'check',
      value: 'check',
      defaultChecked: true,
    }),
})

export const icon: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
