import { defineComponent, h } from 'vue'
import type { MantineDemo } from '@/demo'
import { BaseDemo } from './_base'

const STYLE_ID = 'dropzone-disabled-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .dropzone-disabled-demo {
        background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
        border-color: light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
        cursor: not-allowed;
      }
      .dropzone-disabled-demo * {
        color: light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-3));
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.disabled {
  background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
  border-color: light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
  cursor: not-allowed;

  & * {
    color: light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-3));
  }
}`

const code = `
<script setup lang="ts">
import { Dropzone } from '@mantine-vue/dropzone'
import classes from './Demo.module.css'
</script>

<template>
  <Dropzone disabled :class="classes.disabled" @drop="() => {}">
    <!-- children... -->
  </Dropzone>
</template>
`

const Demo = defineComponent({
  name: 'DropzoneDisabledDemo',
  setup() {
    ensureStyles()
    return () => h(BaseDemo, { disabled: true, class: 'dropzone-disabled-demo' })
  },
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
}
