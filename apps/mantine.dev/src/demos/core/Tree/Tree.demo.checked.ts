import { defineComponent, h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Checkbox, Group, Tree, type RenderTreeNodePayload } from '@mantine-vue/core'
import { data } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { Checkbox, Group, Tree, type RenderTreeNodePayload } from '@mantine-vue/core'
import { data } from './data'

const renderNode = ({ node, expanded, hasChildren, isRoot, elementProps, tree }: RenderTreeNodePayload) => {
  const checked = tree.isNodeChecked(node.value)
  const indeterminate = tree.isNodeIndeterminate(node.value)

  return h(Group, { gap: 'xs', ...elementProps }, {
    default: () => [
      h(Checkbox.Indicator, {
        checked,
        size: 'xs',
        indeterminate,
        mis: isRoot ? undefined : 2,
        onClick: () => !checked ? tree.checkNode(node.value) : tree.uncheckNode(node.value),
      }),
      h(Group, { gap: 6, onClick: () => tree.toggleExpanded(node.value) }, {
        default: () => [
          hasChildren
            ? h(expanded ? PhFolderOpen : PhFolderSimple, { size: 14, style: { opacity: 0.75 } })
            : h(PhFileText, { size: 14, style: { opacity: 0.75 } }),
          h('span', {}, node.label as string),
        ],
      }),
    ],
  })
}
</script>

<template>
  <Tree :data="data" :level-offset="23" :expand-on-click="false" with-lines :render-node="renderNode" />
</template>
`

const Demo = defineComponent({
  name: 'TreeCheckedDemo',
  setup() {
    const renderNode = ({
      node,
      expanded,
      hasChildren,
      isRoot,
      elementProps,
      tree,
    }: RenderTreeNodePayload) => {
      const checked = tree.isNodeChecked(node.value)
      const indeterminate = tree.isNodeIndeterminate(node.value)

      return h(
        Group,
        { gap: 'xs', ...elementProps },
        {
          default: () => [
            h(Checkbox.Indicator, {
              checked,
              size: 'xs',
              indeterminate,
              mis: isRoot ? undefined : 2,
              onClick: () => (!checked ? tree.checkNode(node.value) : tree.uncheckNode(node.value)),
            }),
            h(
              Group,
              { gap: 6, onClick: () => tree.toggleExpanded(node.value) },
              {
                default: () => [
                  hasChildren
                    ? h(expanded ? PhFolderOpen : PhFolderSimple, {
                        size: 14,
                        style: { opacity: 0.75 },
                      })
                    : h(PhFileText, { size: 14, style: { opacity: 0.75 } }),
                  h('span', {}, node.label as string),
                ],
              },
            ),
          ],
        },
      )
    }

    return () =>
      h(Tree, { data, levelOffset: 23, expandOnClick: false, withLines: true, renderNode })
  },
})

export const checked: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
