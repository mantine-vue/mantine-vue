import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const swatchColors = [
  '#2e2e2e',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
]

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'

const swatches = ['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']
</script>

<template>
  <ColorInput
    placeholder="Pick color"
    label="Your favorite color"
    disallowInput
    :withPicker="false"
    :withEyeDropper="false"
    :swatches="swatches"
  />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputSwatchesOnlyDemo',
  setup: () => () =>
    h(ColorInput, {
      maw: 320,
      mx: 'auto',
      placeholder: 'Pick color',
      label: 'Your favorite color',
      disallowInput: true,
      withPicker: false,
      withEyeDropper: false,
      swatches: swatchColors,
    }),
})

export const swatchesOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
