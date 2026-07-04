import { defineComponent, h, ref } from 'vue'
import { Stack, TreeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { data, dataCode } from './data'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Stack, TreeSelect } from '@mantine-vue/core'
import { data } from './data'

const childValue = ref<string[]>([])
const allValue = ref<string[]>([])
const parentValue = ref<string[]>([])
</script>

<template>
  <Stack>
    <TreeSelect
      label="checkedStrategy: child (default)"
      placeholder="Pick values"
      :data="data"
      mode="checkbox"
      checked-strategy="child"
      default-expand-all
      v-model="childValue"
    />
    <TreeSelect
      label="checkedStrategy: all"
      placeholder="Pick values"
      :data="data"
      mode="checkbox"
      checked-strategy="all"
      default-expand-all
      v-model="allValue"
    />
    <TreeSelect
      label="checkedStrategy: parent"
      placeholder="Pick values"
      :data="data"
      mode="checkbox"
      checked-strategy="parent"
      default-expand-all
      v-model="parentValue"
    />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectCheckedStrategyDemo',
  setup() {
    const childValue = ref<string[]>([])
    const allValue = ref<string[]>([])
    const parentValue = ref<string[]>([])
    return () =>
      h(Stack, null, () => [
        h(TreeSelect, {
          label: 'checkedStrategy: child (default)',
          placeholder: 'Pick values',
          data,
          mode: 'checkbox',
          checkedStrategy: 'child',
          defaultExpandAll: true,
          value: childValue.value,
          onChange: (v: string[]) => {
            childValue.value = v
          },
        }),
        h(TreeSelect, {
          label: 'checkedStrategy: all',
          placeholder: 'Pick values',
          data,
          mode: 'checkbox',
          checkedStrategy: 'all',
          defaultExpandAll: true,
          value: allValue.value,
          onChange: (v: string[]) => {
            allValue.value = v
          },
        }),
        h(TreeSelect, {
          label: 'checkedStrategy: parent',
          placeholder: 'Pick values',
          data,
          mode: 'checkbox',
          checkedStrategy: 'parent',
          defaultExpandAll: true,
          value: parentValue.value,
          onChange: (v: string[]) => {
            parentValue.value = v
          },
        }),
      ])
  },
})

export const checkedStrategy: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
}
