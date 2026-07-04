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
    label="Pick up to 3 items"
    placeholder="Pick values"
    :data="data"
    mode="multiple"
    :max-values="3"
    default-expand-all
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectMaxValuesDemo',
  setup: () => () =>
    h(TreeSelect, {
      label: 'Pick up to 3 items',
      placeholder: 'Pick values',
      data,
      mode: 'multiple',
      maxValues: 3,
      defaultExpandAll: true,
    }),
})

export const maxValues: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
