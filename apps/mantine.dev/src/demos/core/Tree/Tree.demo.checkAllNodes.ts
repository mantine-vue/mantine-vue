import { defineComponent, h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import {
  Button,
  Checkbox,
  getTreeExpandedState,
  Group,
  Tree,
  useTree,
  type RenderTreeNodePayload,
} from '@mantine-vue/core'
import { data } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import {
  Button,
  Checkbox,
  getTreeExpandedState,
  Group,
  Tree,
  useTree,
  type RenderTreeNodePayload,
} from '@mantine-vue/core'
import { data } from './data'

const tree = useTree({
  initialExpandedState: getTreeExpandedState(data, '*'),
  initialCheckedState: [
    'node_modules',
    'node_modules/@mantine/core/index.d.ts',
    'node_modules/@mantine/form/package.json',
  ],
})

const renderNode = ({ node, expanded, hasChildren, isRoot, elementProps, tree: t }: RenderTreeNodePayload) => {
  const checked = t.isNodeChecked(node.value)
  const indeterminate = t.isNodeIndeterminate(node.value)

  return h(Group, { gap: 'xs', ...elementProps }, {
    default: () => [
      h(Checkbox.Indicator, {
        checked,
        size: 'xs',
        indeterminate,
        mis: isRoot ? undefined : 2,
        onClick: () => !checked ? t.checkNode(node.value) : t.uncheckNode(node.value),
      }),
      h(Group, { gap: 6, onClick: () => t.toggleExpanded(node.value) }, {
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
  <Group mb="md">
    <Button @click="tree.checkAllNodes()">Check all</Button>
    <Button @click="tree.uncheckAllNodes()">Uncheck all</Button>
  </Group>
  <Tree :data="data" :tree="tree" :level-offset="23" :expand-on-click="false" with-lines :render-node="renderNode" />
</template>
`

const Demo = defineComponent({
  name: 'TreeCheckAllNodesDemo',
  setup() {
    const tree = useTree({
      initialExpandedState: getTreeExpandedState(data, '*'),
      initialCheckedState: [
        'node_modules',
        'node_modules/@mantine/core/index.d.ts',
        'node_modules/@mantine/form/package.json',
      ],
    })

    const renderNode = ({
      node,
      expanded,
      hasChildren,
      isRoot,
      elementProps,
      tree: t,
    }: RenderTreeNodePayload) => {
      const checked = t.isNodeChecked(node.value)
      const indeterminate = t.isNodeIndeterminate(node.value)

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
              onClick: () => (!checked ? t.checkNode(node.value) : t.uncheckNode(node.value)),
            }),
            h(
              Group,
              { gap: 6, onClick: () => t.toggleExpanded(node.value) },
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
      h('div', {}, [
        h(
          Group,
          { mb: 'md' },
          {
            default: () => [
              h(Button, { onClick: () => tree.checkAllNodes() }, { default: () => 'Check all' }),
              h(
                Button,
                { onClick: () => tree.uncheckAllNodes() },
                { default: () => 'Uncheck all' },
              ),
            ],
          },
        ),
        h(Tree, { data, tree, levelOffset: 23, expandOnClick: false, withLines: true, renderNode }),
      ])
  },
})

export const checkAllNodes: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
