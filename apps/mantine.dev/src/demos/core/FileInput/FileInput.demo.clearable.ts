import { defineComponent, h } from 'vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <FileInput clearable label="Upload files" placeholder="Upload files" />
</template>
`

const Demo = defineComponent({
  name: 'FileInputClearableDemo',
  setup: () => () =>
    h(FileInput, { clearable: true, label: 'Upload files', placeholder: 'Upload files' }),
})

export const clearable: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
