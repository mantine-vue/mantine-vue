import { defineComponent, h } from 'vue'
import { FileInput, Pill } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput, Pill } from '@mantine-vue/core'

function valueComponent(value: File | File[] | null) {
  if (value === null) return null

  if (Array.isArray(value)) {
    return h(Pill.Group, null, {
      default: () => value.map((file, i) => h(Pill, { key: i }, { default: () => file.name }))
    })
  }

  return h(Pill, null, { default: () => (value as File).name })
}
</script>

<template>
  <FileInput
    label="Upload files"
    placeholder="Upload files"
    multiple
    :valueComponent="valueComponent"
  />
</template>
`

function valueComponentFn(value: File | File[] | null) {
  if (value === null) return null
  if (Array.isArray(value)) {
    return h(Pill.Group, null, {
      default: () =>
        value.map((file: File, i: number) => h(Pill, { key: i }, { default: () => file.name })),
    })
  }
  return h(Pill, null, { default: () => (value as File).name })
}

const Demo = defineComponent({
  name: 'FileInputValueComponentDemo',
  setup: () => () =>
    h(FileInput, {
      label: 'Upload files',
      placeholder: 'Upload files',
      multiple: true,
      valueComponent: valueComponentFn,
    }),
})

export const valueComponent: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
