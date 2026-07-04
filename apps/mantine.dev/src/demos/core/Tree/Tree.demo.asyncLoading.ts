import { defineComponent, h, ref } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import {
  Group,
  Loader,
  Tree,
  mergeAsyncChildren,
  useTree,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h, ref } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import {
  Group,
  Loader,
  Tree,
  mergeAsyncChildren,
  useTree,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from '@mantine-vue/core'

const initialData: TreeNodeData[] = [
  { label: 'Documents', value: 'documents', hasChildren: true },
  { label: 'Photos', value: 'photos', hasChildren: true },
  { label: 'README.md', value: 'readme' },
]

async function fetchChildren(parentValue: string): Promise<TreeNodeData[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { label: \`\${parentValue}/file-1.txt\`, value: \`\${parentValue}/file-1.txt\` },
    { label: \`\${parentValue}/file-2.txt\`, value: \`\${parentValue}/file-2.txt\` },
  ]
}

const treeData = ref<TreeNodeData[]>(initialData)

const tree = useTree({
  onLoadChildren: async (value) => {
    const children = await fetchChildren(value)
    treeData.value = mergeAsyncChildren(treeData.value, value, children)
  },
})

const renderNode = ({ node, expanded, hasChildren, isLoading, elementProps }: RenderTreeNodePayload) =>
  h(Group, { gap: 6, wrap: 'nowrap', ...elementProps }, {
    default: () => [
      isLoading
        ? h(Loader, { size: 14 })
        : hasChildren
          ? h(expanded ? PhFolderOpen : PhFolderSimple, { size: 14, style: { opacity: 0.75 } })
          : h(PhFileText, { size: 14, style: { opacity: 0.75 } }),
      h('span', {}, node.label as string),
    ],
  })
</script>

<template>
  <Tree :data="treeData" :tree="tree" with-lines :render-node="renderNode" />
</template>
`

const initialData: TreeNodeData[] = [
  { label: 'Documents', value: 'documents', hasChildren: true },
  { label: 'Photos', value: 'photos', hasChildren: true },
  { label: 'README.md', value: 'readme' },
]

async function fetchChildren(parentValue: string): Promise<TreeNodeData[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { label: `${parentValue}/file-1.txt`, value: `${parentValue}/file-1.txt` },
    { label: `${parentValue}/file-2.txt`, value: `${parentValue}/file-2.txt` },
  ]
}

const Demo = defineComponent({
  name: 'TreeAsyncLoadingDemo',
  setup() {
    const treeData = ref<TreeNodeData[]>(initialData)

    const tree = useTree({
      onLoadChildren: async (value) => {
        const children = await fetchChildren(value)
        treeData.value = mergeAsyncChildren(treeData.value, value, children)
      },
    })

    const renderNode = ({
      node,
      expanded,
      hasChildren,
      isLoading,
      elementProps,
    }: RenderTreeNodePayload) =>
      h(
        Group,
        { gap: 6, wrap: 'nowrap', ...elementProps },
        {
          default: () => [
            isLoading
              ? h(Loader, { size: 14 })
              : hasChildren
                ? h(expanded ? PhFolderOpen : PhFolderSimple, {
                    size: 14,
                    style: { opacity: 0.75 },
                  })
                : h(PhFileText, { size: 14, style: { opacity: 0.75 } }),
            h('span', {}, node.label as string),
          ],
        },
      )

    return () => h(Tree, { data: treeData.value, tree, withLines: true, renderNode })
  },
})

export const asyncLoading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
