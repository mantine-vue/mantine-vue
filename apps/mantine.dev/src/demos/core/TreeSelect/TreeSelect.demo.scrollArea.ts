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
    label="Your favorite item"
    placeholder="Pick value"
    :data="data"
    default-expand-all
    :max-dropdown-height="200"
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectScrollAreaDemo',
  setup: () => () =>
    h(TreeSelect, {
      label: 'Your favorite item',
      placeholder: 'Pick value',
      data,
      defaultExpandAll: true,
      maxDropdownHeight: 200,
    }),
})

export const scrollArea: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
