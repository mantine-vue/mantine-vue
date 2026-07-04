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
    label="Boolean error"
    placeholder="Boolean error"
    error
    :data="data"
  />
  <TreeSelect
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid value"
    :data="data"
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(TreeSelect, {
        label: 'Boolean error',
        placeholder: 'Boolean error',
        error: true,
        data,
      }),
      h(TreeSelect, {
        mt: 'md',
        label: 'With error message',
        placeholder: 'With error message',
        error: 'Invalid value',
        data,
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
