import { defineComponent, h } from 'vue'
import type { MantineDemo } from '@/demo'
import { BaseDemo } from './_base'

const code = `
<script setup lang="ts">
import { Dropzone } from '@mantine-vue/dropzone'
</script>

<template>
  <Dropzone loading @drop="() => {}">
    <!-- children -->
  </Dropzone>
</template>
`

const Demo = defineComponent({
  name: 'DropzoneLoadingDemo',
  setup: () => () => h(BaseDemo, { loading: true }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
