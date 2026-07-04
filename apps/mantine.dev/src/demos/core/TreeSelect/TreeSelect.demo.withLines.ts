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
    label="Without connecting lines"
    placeholder="Pick value"
    :data="data"
    default-expand-all
    :with-lines="false"
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectWithLinesDemo',
  setup: () => () =>
    h(TreeSelect, {
      label: 'Without connecting lines',
      placeholder: 'Pick value',
      data,
      defaultExpandAll: true,
      withLines: false,
    }),
})

export const withLines: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
