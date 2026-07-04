import { defineComponent, h } from 'vue'
import { PhHeart, PhHeartBreak } from '@phosphor-icons/vue'
import { RangeSlider, Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider, RangeSlider } from '@mantine-vue/core'
import { PhHeart, PhHeartBreak } from '@phosphor-icons/vue'
</script>

<template>
  <Slider
    :thumb-children="() => h(PhHeart, { size: 16 })"
    color="red"
    :label="null"
    :default-value="40"
    :thumb-size="26"
    :styles="{ thumb: { borderWidth: 2, padding: 3 } }"
  />

  <RangeSlider
    mt="xl"
    :styles="{ thumb: { borderWidth: 2, padding: 3 } }"
    color="red"
    :label="null"
    :default-value="[20, 60]"
    :thumb-size="26"
    :thumb-children="[() => h(PhHeart, { size: 16 }), () => h(PhHeartBreak, { size: 16 })]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SliderThumbChildrenDemo',
  setup: () => () =>
    h('div', null, [
      h(Slider, {
        thumbChildren: () => h(PhHeart, { size: 16 }),
        color: 'red',
        label: null,
        defaultValue: 40,
        thumbSize: 26,
        styles: { thumb: { borderWidth: 2, padding: 3 } },
      }),
      h(RangeSlider, {
        mt: 'xl',
        styles: { thumb: { borderWidth: 2, padding: 3 } },
        color: 'red',
        label: null,
        defaultValue: [20, 60],
        thumbSize: 26,
        thumbChildren: [() => h(PhHeart, { size: 16 }), () => h(PhHeartBreak, { size: 16 })],
      }),
    ]),
})

export const thumbChildren: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 400,
  centered: true,
}
