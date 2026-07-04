import { defineComponent, h } from 'vue'
import { RangeSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider, Text } from '@mantine-vue/core'
</script>

<template>
  <Text size="sm">No label</Text>
  <RangeSlider :default-value="[20, 60]" :label="null" />

  <Text size="sm" mt="xl">Formatted label</Text>
  <RangeSlider :default-value="[20, 60]" :label="(value) => \`\${value} °C\`" />

  <Text size="sm" mt="xl">Label always visible</Text>
  <RangeSlider :default-value="[20, 60]" label-always-on />

  <Text size="sm" mt="xl">Custom label transition</Text>
  <RangeSlider
    :default-value="[20, 60]"
    :label-transition-props="{
      transition: 'skew-down',
      duration: 150,
      timingFunction: 'linear',
    }"
  />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderLabelDemo',
  setup: () => () =>
    h('div', null, [
      h(Text, { size: 'sm' }, { default: () => 'No label' }),
      h(RangeSlider, { defaultValue: [20, 60], label: null }),

      h(Text, { size: 'sm', mt: 'xl' }, { default: () => 'Formatted label' }),
      h(RangeSlider, { defaultValue: [20, 60], label: (value: number) => `${value} °C` }),

      h(Text, { size: 'sm', mt: 'xl' }, { default: () => 'Label always visible' }),
      h(RangeSlider, { defaultValue: [20, 60], labelAlwaysOn: true }),

      h(Text, { size: 'sm', mt: 'xl' }, { default: () => 'Custom label transition' }),
      h(RangeSlider, {
        defaultValue: [20, 60],
        labelTransitionProps: { transition: 'skew-down', duration: 150, timingFunction: 'linear' },
      }),
    ]),
})

export const label: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
