import { defineComponent, h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Group, Tree, type RenderTreeNodePayload } from '@mantine-vue/core'
import { data } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Group, Tree, type RenderTreeNodePayload } from '@mantine-vue/core'
import { data } from './data'

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
  <Tree :data="data" with-lines :render-node="renderNode" />
</template>
`

const Demo = defineComponent({
  name: 'TreeUsageDemo',
  setup() {
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

    return () => h(Tree, { data, withLines: true, renderNode })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
