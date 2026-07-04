import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput
    label="Label"
    placeholder="ColorInput"
    description="Description"
    error="Error"
    withAsterisk
    :swatches="['#000', '#fff', '#f00', '#0f0', '#00f']"
    format="rgba"
    {{props}}
  />
</template>
`

const Wrapper = defineComponent({
  name: 'ColorInputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(ColorInput, {
        label: 'Label',
        placeholder: 'ColorInput',
        description: 'Description',
        error: 'Error',
        withAsterisk: true,
        swatches: ['#000', '#fff', '#f00', '#0f0', '#00f'],
        format: 'rgba',
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'label', description: 'Label element' },
      { selector: 'required', description: 'Required asterisk element, rendered inside label' },
      { selector: 'description', description: 'Description element' },
      { selector: 'error', description: 'Error element' },
      { selector: 'wrapper', description: 'Root element of the Input' },
      { selector: 'input', description: 'Input element' },
      { selector: 'section', description: 'Left and right sections' },
      { selector: 'dropdown', description: 'Popover dropdown' },
      { selector: 'colorPreview', description: 'Color swatch preview in input left section' },
      { selector: 'eyeDropperButton', description: 'Eye dropper button' },
      { selector: 'eyeDropperIcon', description: 'Default eye dropper icon' },
      { selector: 'saturation', description: 'Saturation picker' },
      {
        selector: 'saturationOverlay',
        description: 'Element used to display overlays over saturation picker',
      },
      { selector: 'sliders', description: 'Contains alpha and hue sliders' },
      { selector: 'slider', description: 'Alpha and hue sliders root' },
      {
        selector: 'sliderOverlay',
        description: 'Element used to display overlays over hue and alpha sliders',
      },
      { selector: 'thumb', description: 'Thumb of all sliders' },
      { selector: 'swatch', description: 'Color swatch' },
      { selector: 'swatches', description: 'Color swatches list' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
