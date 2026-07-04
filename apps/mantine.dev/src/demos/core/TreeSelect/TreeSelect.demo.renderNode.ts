import { defineComponent, h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Group, Text, TreeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { data, dataCode } from './data'

const code = `
<script setup lang="ts">
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Group, Text, TreeSelect } from '@mantine-vue/core'
import { data } from './data'

const renderTreeNode = ({ node, hasChildren, expanded }) =>
  h(Group, { gap: 'xs' }, () => [
    hasChildren
      ? expanded
        ? h(PhFolderOpen, { color: 'var(--mantine-color-yellow-9)', size: 16 })
        : h(PhFolderSimple, { color: 'var(--mantine-color-yellow-9)', size: 16 })
      : h(PhFileText, { size: 16 }),
    h(Text, { size: 'sm' }, () => node.label),
  ])
</script>

<template>
  <TreeSelect
    label="Your favorite item"
    placeholder="Pick value"
    :data="data"
    :render-node="renderTreeNode"
    default-expand-all
  />
</template>
`

const renderTreeNode = ({
  node,
  hasChildren,
  expanded,
}: {
  node: { label: string; value: string }
  hasChildren: boolean
  expanded: boolean
}) =>
  h(Group, { gap: 'xs' }, () => [
    hasChildren
      ? expanded
        ? h(PhFolderOpen, { color: 'var(--mantine-color-yellow-9)', size: 16 })
        : h(PhFolderSimple, { color: 'var(--mantine-color-yellow-9)', size: 16 })
      : h(PhFileText, { size: 16 }),
    h(Text, { size: 'sm' }, () => node.label),
  ])

const Demo = defineComponent({
  name: 'TreeSelectRenderNodeDemo',
  setup: () => () =>
    h(TreeSelect, {
      label: 'Your favorite item',
      placeholder: 'Pick value',
      data,
      renderNode: renderTreeNode,
      defaultExpandAll: true,
    }),
})

export const renderNode: MantineDemo = {
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
