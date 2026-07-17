import { defineComponent, h } from 'vue'
import { DataList } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { DataList } from '@mantine-vue/core'
</script>

<template>
  <DataList orientation="vertical" withDivider>
    <DataList.Item>
      <DataList.ItemLabel>Name</DataList.ItemLabel>
      <DataList.ItemValue>John Doe</DataList.ItemValue>
    </DataList.Item>
    <DataList.Item>
      <DataList.ItemLabel>Email</DataList.ItemLabel>
      <DataList.ItemValue>john@example.com</DataList.ItemValue>
    </DataList.Item>
    <DataList.Item>
      <DataList.ItemLabel>Role</DataList.ItemLabel>
      <DataList.ItemValue>Software Engineer</DataList.ItemValue>
    </DataList.Item>
  </DataList>
</template>
`

const Demo = defineComponent({
  name: 'DataListVerticalDemo',
  setup() {
    return () =>
      h(DataList, { orientation: 'vertical', withDivider: true }, () => [
        h(DataList.Item, null, () => [
          h(DataList.ItemLabel, null, () => 'Name'),
          h(DataList.ItemValue, null, () => 'John Doe'),
        ]),
        h(DataList.Item, null, () => [
          h(DataList.ItemLabel, null, () => 'Email'),
          h(DataList.ItemValue, null, () => 'john@example.com'),
        ]),
        h(DataList.Item, null, () => [
          h(DataList.ItemLabel, null, () => 'Role'),
          h(DataList.ItemValue, null, () => 'Software Engineer'),
        ]),
      ])
  },
})

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
