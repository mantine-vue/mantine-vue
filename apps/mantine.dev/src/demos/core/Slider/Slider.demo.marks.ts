import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider :default-value="40" :marks="[{ value: 10 }, { value: 40 }, { value: 95 }]" :mb="32" />
  <Slider
    :mb="32"
    :default-value="40"
    :marks="[
      { value: 20, label: '20%' },
      { value: 50, label: '50%' },
      { value: 80, label: '80%' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SliderMarksDemo',
  setup: () => () =>
    h('div', null, [
      h(Slider, {
        defaultValue: 40,
        marks: [{ value: 10 }, { value: 40 }, { value: 95 }],
        mb: 32,
      }),
      h(Slider, {
        mb: 32,
        defaultValue: 40,
        marks: [
          { value: 20, label: '20%' },
          { value: 50, label: '50%' },
          { value: 80, label: '80%' },
        ],
      }),
    ]),
})

export const marks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
