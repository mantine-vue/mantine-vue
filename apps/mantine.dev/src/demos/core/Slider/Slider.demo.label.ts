import { defineComponent, h } from 'vue'
import { Slider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider, Text } from '@mantine-vue/core'
</script>

<template>
  <Text size="sm">No label</Text>
  <Slider :default-value="40" :label="null" />

  <Text size="sm" mt="xl">Formatted label</Text>
  <Slider :default-value="40" :label="(value) => \`\${value} °C\`" />

  <Text size="sm" mt="xl">Label always visible</Text>
  <Slider :default-value="40" label-always-on />

  <Text size="sm" mt="xl">Custom label transition</Text>
  <Slider
    :default-value="40"
    :label-transition-props="{
      transition: 'skew-down',
      duration: 150,
      timingFunction: 'linear',
    }"
  />
</template>
`

const Demo = defineComponent({
  name: 'SliderLabelDemo',
  setup: () => () =>
    h('div', null, [
      h(Text, { size: 'sm' }, { default: () => 'No label' }),
      h(Slider, { defaultValue: 40, label: null }),

      h(Text, { size: 'sm', mt: 'xl' }, { default: () => 'Formatted label' }),
      h(Slider, { defaultValue: 40, label: (value: number) => `${value} °C` }),

      h(Text, { size: 'sm', mt: 'xl' }, { default: () => 'Label always visible' }),
      h(Slider, { defaultValue: 40, labelAlwaysOn: true }),

      h(Text, { size: 'sm', mt: 'xl' }, { default: () => 'Custom label transition' }),
      h(Slider, {
        defaultValue: 40,
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
