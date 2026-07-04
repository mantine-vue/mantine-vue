import { defineComponent, h, ref } from 'vue'
import { RangeSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { RangeSlider, Text } from '@mantine-vue/core'

const value = ref<[number, number]>([30, 60])
</script>

<template>
  <Text size="sm" mb="xs">
    Minimum range: 20 (thumbs must be at least 20 units apart)
  </Text>
  <RangeSlider :value="value" @change="(v) => (value = v)" :min-range="20" />
  <Text size="sm" mt="xs">
    Value: [{{ value[0] }}, {{ value[1] }}] - Range: {{ value[1] - value[0] }}
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderMinRangeDemo',
  setup() {
    const value = ref<[number, number]>([30, 60])
    return () =>
      h('div', null, [
        h(
          Text,
          { size: 'sm', mb: 'xs' },
          {
            default: () => 'Minimum range: 20 (thumbs must be at least 20 units apart)',
          },
        ),
        h(RangeSlider, {
          value: value.value,
          onChange: (v: [number, number]) => {
            value.value = v
          },
          minRange: 20,
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

export const minRange: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
