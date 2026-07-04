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
    label="Zero padding"
    placeholder="Pick value"
    :data="data"
    :combobox-props="{ dropdownPadding: 0 }"
  />
  <TreeSelect
    mt="md"
    label="10px padding"
    placeholder="Pick value"
    :data="data"
    :combobox-props="{ dropdownPadding: 10 }"
  />
</template>
`

const Demo = defineComponent({
  name: 'TreeSelectDropdownPaddingDemo',
  setup: () => () =>
    h('div', null, [
      h(TreeSelect, {
        label: 'Zero padding',
        placeholder: 'Pick value',
        data,
        comboboxProps: { dropdownPadding: 0 },
      }),
      h(TreeSelect, {
        mt: 'md',
        label: '10px padding',
        placeholder: 'Pick value',
        data,
        comboboxProps: { dropdownPadding: 10 },
      }),
    ]),
})

export const dropdownPadding: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
  maxWidth: 340,
  centered: true,
}
