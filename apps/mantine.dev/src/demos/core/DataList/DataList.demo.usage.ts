import { defineComponent, h } from 'vue'
import { DataList } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const data = [
  { label: 'Name', value: 'John Doe' },
  { label: 'Email', value: 'john@example.com' },
  { label: 'Role', value: 'Software Engineer' },
  { label: 'Location', value: 'San Francisco, CA' },
]

const code = `
<script setup lang="ts">
import { DataList } from '@mantine-vue/core'

const data = [
  { label: 'Name', value: 'John Doe' },
  { label: 'Email', value: 'john@example.com' },
  { label: 'Role', value: 'Software Engineer' },
  { label: 'Location', value: 'San Francisco, CA' },
]
</script>

<template>
  <DataList{{props}}>
    <DataList.Item v-for="item in data" :key="item.label">
      <DataList.ItemLabel>{{ item.label }}</DataList.ItemLabel>
      <DataList.ItemValue>{{ item.value }}</DataList.ItemValue>
    </DataList.Item>
  </DataList>
</template>
`

const Wrapper = defineComponent({
  name: 'DataListUsageDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(DataList, { ...attrs }, () =>
        data.map((item) =>
          h(DataList.Item, { key: item.label }, () => [
            h(DataList.ItemLabel, null, () => item.label),
            h(DataList.ItemValue, null, () => item.value),
          ]),
        ),
      )
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'size', type: 'size', libraryValue: 'md', initialValue: 'md' },
    {
      prop: 'orientation',
      type: 'segmented',
      data: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
      ],
      initialValue: 'vertical',
      libraryValue: 'vertical',
    },
    { prop: 'withDivider', type: 'boolean', libraryValue: false, initialValue: false },
  ],
}
