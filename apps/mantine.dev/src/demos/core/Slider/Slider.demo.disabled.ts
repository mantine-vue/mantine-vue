import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider :default-value="60" disabled />
</template>
`

const Demo = defineComponent({
  name: 'SliderDisabledDemo',
  setup: () => () => h(Slider, { defaultValue: 60, disabled: true }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
