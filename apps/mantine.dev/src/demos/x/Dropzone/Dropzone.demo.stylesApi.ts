import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine-vue/dropzone'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'dropzone-styles-api-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .dropzone-styles-api-demo-root {
        min-height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0;
        background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
      }
      .dropzone-styles-api-demo-root[data-accept] {
        color: var(--mantine-color-white);
        background-color: var(--mantine-color-blue-6);
      }
      .dropzone-styles-api-demo-root[data-reject] {
        color: var(--mantine-color-white);
        background-color: var(--mantine-color-red-6);
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.root {
  min-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));

  &[data-accept] {
    color: var(--mantine-color-white);
    background-color: var(--mantine-color-blue-6);
  }

  &[data-reject] {
    color: var(--mantine-color-white);
    background-color: var(--mantine-color-red-6);
  }
}`

const code = `
<script setup lang="ts">
import { Text } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine-vue/dropzone'
import classes from './Demo.module.css'
</script>

<template>
  <Dropzone @drop="() => {}" :accept="IMAGE_MIME_TYPE" :class="classes.root">
    <Text ta="center">Drop images here</Text>
  </Dropzone>
</template>
`

const Demo = defineComponent({
  name: 'DropzoneStylesApiDemo',
  setup() {
    ensureStyles()
    return () =>
      h(
        Dropzone,
        { onDrop: () => {}, accept: IMAGE_MIME_TYPE, class: 'dropzone-styles-api-demo-root' },
        () => h(Text, { ta: 'center' }, () => 'Drop images here'),
      )
  },
})

export const stylesApi: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
}
