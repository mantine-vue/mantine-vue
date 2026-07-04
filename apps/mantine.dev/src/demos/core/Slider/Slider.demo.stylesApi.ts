import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider
    {{props}}
    :marks="[{ value: 20, label: '20%' }, { value: 80, label: '80%' }]"
    label-always-on
  />
</template>
`

const Demo = defineComponent({
  name: 'SliderStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Slider, {
        marks: [
          { value: 20, label: '20%' },
          { value: 80, label: '80%' },
        ],
        defaultValue: 40,
        labelAlwaysOn: true,
        mb: 40,
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      label: 'Thumb label',
      thumb: 'Thumb element',
      trackContainer: 'Wraps track element',
      track: 'Slider track',
      bar: 'Track filled part',
      markWrapper: 'Contains mark and markLabel elements',
      mark: 'Mark displayed on track',
      markLabel: 'Label of the associated mark, displayed below track',
    },
  },
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
