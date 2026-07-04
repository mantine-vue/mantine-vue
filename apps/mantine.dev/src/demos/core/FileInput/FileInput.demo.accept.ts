import { defineComponent, h } from 'vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <FileInput accept="image/png,image/jpeg" label="Upload files" placeholder="Upload files" />
</template>
`

const Demo = defineComponent({
  name: 'FileInputAcceptDemo',
  setup: () => () =>
    h(FileInput, {
      accept: 'image/png,image/jpeg',
      label: 'Upload files',
      placeholder: 'Upload files',
    }),
})

export const accept: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
