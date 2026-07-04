import { defineComponent, h, ref } from 'vue'
import { HueSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { HueSlider, Text } from '@mantine-vue/core'

const value = ref(250)
</script>

<template>
  <div>
    <Text>Hue value: {{ value }}</Text>
    <HueSlider :value="value" @change="value = $event" />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'HueSliderDemo',
  setup() {
    const value = ref(250)
    return () =>
      h('div', null, [
        h(Text, {}, { default: () => `Hue value: ${value.value}` }),
        h(HueSlider, {
          value: value.value,
          onChange: (v: number) => {
            value.value = v
          },
        }),
      ])
  },
})

export const hueSlider: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 300,
}
