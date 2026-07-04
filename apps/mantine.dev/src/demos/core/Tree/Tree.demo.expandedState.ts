import { defineComponent, h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import {
  Group,
  Tree,
  getTreeExpandedState,
  useTree,
  type RenderTreeNodePayload,
} from '@mantine-vue/core'
import { data } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Group, Tree, getTreeExpandedState, useTree, type RenderTreeNodePayload } from '@mantine-vue/core'
import { data } from './data'

const tree = useTree({
  initialExpandedState: getTreeExpandedState(data, ['src', 'src/components']),
})

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
</template>
`

const Demo = defineComponent({
  name: 'TreeExpandedStateDemo',
  setup() {
    const tree = useTree({
      initialExpandedState: getTreeExpandedState(data, ['src', 'src/components']),
    })

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

    return () => h(Tree, { data, tree, withLines: true, renderNode })
  },
})

export const expandedState: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
