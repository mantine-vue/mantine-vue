import { defineComponent, h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Button, Group, Tree, useTree, type RenderTreeNodePayload } from '@mantine-vue/core'
import { data } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Button, Group, Tree, useTree, type RenderTreeNodePayload } from '@mantine-vue/core'
import { data } from './data'

const tree = useTree()

const renderNode = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) =>
  h(Group, { gap: 6, ...elementProps }, {
    default: () => [
      hasChildren
        ? h(expanded ? PhFolderOpen : PhFolderSimple, { size: 14, style: { opacity: 0.75 } })
        : h(PhFileText, { size: 14, style: { opacity: 0.75 } }),
      h('span', {}, node.label as string),
    ],
  })
</script>

<template>
  <Tree :data="data" :tree="tree" with-lines :render-node="renderNode" />
  <Group mt="md">
    <Button @click="tree.expandAllNodes()">Expand all</Button>
    <Button @click="tree.collapseAllNodes()">Collapse all</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'TreeControllerDemo',
  setup() {
    const tree = useTree()

    const renderNode = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) =>
      h(
        Group,
        { gap: 6, ...elementProps },
        {
          default: () => [
            hasChildren
              ? h(expanded ? PhFolderOpen : PhFolderSimple, { size: 14, style: { opacity: 0.75 } })
              : h(PhFileText, { size: 14, style: { opacity: 0.75 } }),
            h('span', {}, node.label as string),
          ],
        },
      )

    return () =>
      h('div', {}, [
        h(Tree, { data, tree, withLines: true, renderNode }),
        h(
          Group,
          { mt: 'md' },
          {
            default: () => [
              h(Button, { onClick: () => tree.expandAllNodes() }, { default: () => 'Expand all' }),
              h(
                Button,
                { onClick: () => tree.collapseAllNodes() },
                { default: () => 'Collapse all' },
              ),
            ],
          },
        ),
      ])
  },
})

export const controller: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
