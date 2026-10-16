import { defineComponent, h } from 'vue'
import { PhFileText, PhFolderSimple } from '@phosphor-icons/vue'
import { Group, Pill, TreeSelect, type TreeSelectRenderPillPayload } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { data, dataCode } from './data'

const renderTreePill = ({ node, onRemove, disabled, readOnly }: TreeSelectRenderPillPayload) =>
  h(Pill, { withRemoveButton: !readOnly, onRemove, disabled }, () => [
    h(Group, { gap: 4, wrap: 'nowrap' }, () => [
      h(node.children || node.hasChildren ? PhFolderSimple : PhFileText, { size: 12 }),
      node.label,
    ]),
  ])

export const renderPill: MantineDemo = {
  type: 'code',
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  component: defineComponent({
    setup: () => () =>
      h(TreeSelect, {
        mode: 'checkbox',
        checkedStrategy: 'parent',
        label: 'Categories',
        placeholder: 'Pick categories',
        data,
        defaultValue: ['phones', 'headphones'],
        defaultExpandAll: true,
        renderPill: renderTreePill,
      }),
  }),
  code: [
    {
      fileName: 'Demo.vue',
      language: 'html',
      code: `<script setup lang="ts">
import { h } from 'vue'
import { PhFileText, PhFolderSimple } from '@phosphor-icons/vue'
import { Group, Pill, TreeSelect } from '@mantine-vue/core'
import { data } from './data'

const renderTreePill = ({ node, onRemove, disabled, readOnly }) => h(
  Pill,
  { withRemoveButton: !readOnly, onRemove, disabled },
  () => [h(Group, { gap: 4, wrap: 'nowrap' }, () => [
    h(node.children || node.hasChildren ? PhFolderSimple : PhFileText, { size: 12 }), node.label,
  ])],
)
</script>
<template>
  <TreeSelect mode="checkbox" checkedStrategy="parent" label="Categories" placeholder="Pick categories" :data="data" :defaultValue="['phones', 'headphones']" defaultExpandAll :renderPill="renderTreePill" />
</template>`,
    },
    { fileName: 'data.ts', language: 'typescript', code: dataCode },
  ],
}
