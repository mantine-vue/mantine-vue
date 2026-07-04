import { defineComponent, h } from 'vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <FileInput label="Upload files" placeholder="Upload files" multiple />
</template>
`

const Demo = defineComponent({
  name: 'FileInputMultipleDemo',
  setup: () => () =>
    h(FileInput, { multiple: true, label: 'Upload files', placeholder: 'Upload files' }),
})

export const multiple: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
