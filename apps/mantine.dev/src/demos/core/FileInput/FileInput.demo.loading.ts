import { defineComponent, h } from 'vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <FileInput placeholder="Upload file" loading />
</template>
`

const Demo = defineComponent({
  name: 'FileInputLoadingDemo',
  setup: () => () => h(FileInput, { placeholder: 'Upload file', loading: true }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
