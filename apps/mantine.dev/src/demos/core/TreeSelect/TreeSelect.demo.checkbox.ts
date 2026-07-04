import { defineComponent, h } from 'vue'
import { TreeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { data, dataCode } from './data'

const code = `
<script setup lang="ts">
import { TreeSelect } from '@mantine-vue/core'
import { data } from './data'
</script>

<template>
  <TreeSelect
    label="Select categories"
    placeholder="Pick values"
    :data="data"
    mode="checkbox"
    default-expand-all
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectCheckboxDemo',
  setup: () => () =>
    h(TreeSelect, {
      label: 'Select categories',
      placeholder: 'Pick values',
      data,
      mode: 'checkbox',
      defaultExpandAll: true,
    }),
})

export const checkbox: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
