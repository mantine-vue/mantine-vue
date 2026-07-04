import { defineComponent, h, ref } from 'vue'
import { RangeSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { RangeSlider, Text } from '@mantine-vue/core'

const value = ref<[number, number]>([20, 80])
</script>

<template>
  <Text size="sm" mb="xs">
    Maximum range: 50 (selection cannot be wider than 50 units)
  </Text>
  <RangeSlider :value="value" @change="(v) => (value = v)" :max-range="50" />
  <Text size="sm" mt="xs">
    Value: [{{ value[0] }}, {{ value[1] }}] - Range: {{ value[1] - value[0] }}
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderMaxRangeDemo',
  setup() {
    const value = ref<[number, number]>([20, 80])
    return () =>
      h('div', null, [
        h(
          Text,
          { size: 'sm', mb: 'xs' },
          {
            default: () => 'Maximum range: 50 (selection cannot be wider than 50 units)',
          },
        ),
        h(RangeSlider, {
          value: value.value,
          onChange: (v: [number, number]) => {
            value.value = v
          },
          maxRange: 50,
        }),
        h(
          Text,
          { size: 'sm', mt: 'xs' },
          {
            default: () =>
              `Value: [${value.value[0]}, ${value.value[1]}] - Range: ${value.value[1] - value.value[0]}`,
          },
        ),
      ])
  },
})

export const maxRange: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
