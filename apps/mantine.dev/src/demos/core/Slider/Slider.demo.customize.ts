import { defineComponent, h } from 'vue'
import { Box, Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'slider-customize-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .slider-customize-demo .mantine-Slider-track::before {
        background-color: light-dark(var(--mantine-color-blue-1), var(--mantine-color-dark-3));
      }
      .slider-customize-demo .mantine-Slider-mark {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        transform: translateX(-3px) translateY(-2px);
        border-color: light-dark(var(--mantine-color-blue-1), var(--mantine-color-dark-3));
      }
      .slider-customize-demo .mantine-Slider-mark[data-filled] {
        border-color: var(--mantine-color-blue-6);
      }
      .slider-customize-demo .mantine-Slider-markLabel {
        font-size: var(--mantine-font-size-xs);
        margin-bottom: 5px;
        margin-top: 0;
      }
      .slider-customize-demo .mantine-Slider-thumb {
        height: 16px;
        width: 16px;
        background-color: var(--mantine-color-white);
        border-width: 1px;
        box-shadow: var(--mantine-shadow-sm);
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `
.track {
  &::before {
    background-color: light-dark(var(--mantine-color-blue-1), var(--mantine-color-dark-3));
  }
}

.mark {
  width: 6px;
  height: 6px;
  border-radius: 6px;
  transform: translateX(-3px) translateY(-2px);
  border-color: light-dark(var(--mantine-color-blue-1), var(--mantine-color-dark-3));

  &[data-filled] {
    border-color: var(--mantine-color-blue-6);
  }
}

.markLabel {
  font-size: var(--mantine-font-size-xs);
  margin-bottom: 5px;
  margin-top: 0;
}

.thumb {
  height: 16px;
  width: 16px;
  background-color: var(--mantine-color-white);
  border-width: 1px;
  box-shadow: var(--mantine-shadow-sm);
}`

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
import classes from './Demo.module.css'
</script>

<template>
  <Slider
    :default-value="40"
    :size="2"
    :class-names="classes"
    :marks="[
      { value: 20, label: '20%' },
      { value: 50, label: '50%' },
      { value: 80, label: '80%' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SliderCustomizeDemo',
  setup() {
    ensureStyles()
    return () =>
      h(
        Box,
        { maw: 400, pt: 15, pb: 20, mx: 'auto', class: 'slider-customize-demo' },
        {
          default: () =>
            h(Slider, {
              defaultValue: 40,
              size: 2,
              marks: [
                { value: 20, label: '20%' },
                { value: 50, label: '50%' },
                { value: 80, label: '80%' },
              ],
            }),
        },
      )
  },
})

export const customize: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', code, language: 'html' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
}
