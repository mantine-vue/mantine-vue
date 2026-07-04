import type { MantineDemo } from '@/demo'
import {
  filterTreeData,
  Group,
  TextInput,
  Tree,
  useTree,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from '@mantine-vue/core'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import { computed, defineComponent, h, ref } from 'vue'

const code = `
<script setup lang="ts">
import { h, ref, computed } from 'vue'
import { PhFileText, PhFolderOpen, PhFolderSimple } from '@phosphor-icons/vue'
import {
  filterTreeData,
  getTreeExpandedState,
  Group,
  TextInput,
  Tree,
  useTree,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from '@mantine-vue/core'

const data: TreeNodeData[] = [
  {
    label: 'src', value: 'src',
    children: [
      {
        label: 'components', value: 'src/components',
        children: [
          { label: 'Accordion.tsx', value: 'src/components/Accordion.tsx' },
          { label: 'Tree.tsx', value: 'src/components/Tree.tsx' },
          { label: 'Button.tsx', value: 'src/components/Button.tsx' },
        ],
      },
      {
        label: 'hooks', value: 'src/hooks',
        children: [
          { label: 'use-debounce.ts', value: 'src/hooks/use-debounce.ts' },
          { label: 'use-media-query.ts', value: 'src/hooks/use-media-query.ts' },
        ],
      },
    ],
  },
  { label: 'package.json', value: 'package.json' },
]

const query = ref('')
const filtered = computed(() => filterTreeData(data, query.value))
const tree = useTree()

watch(filtered, (newData) => {
  tree.setExpandedState(getTreeExpandedState(newData, '*'))
}, { immediate: true })

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
  <TextInput v-model="query" placeholder="Search files..." mb="md" />
  <Tree :data="filtered" :tree="tree" with-lines :render-node="renderNode" />
</template>
`

const localData: TreeNodeData[] = [
  {
    label: 'src',
    value: 'src',
    children: [
      {
        label: 'components',
        value: 'src/components',
        children: [
          { label: 'Accordion.tsx', value: 'src/components/Accordion.tsx' },
          { label: 'Tree.tsx', value: 'src/components/Tree.tsx' },
          { label: 'Button.tsx', value: 'src/components/Button.tsx' },
        ],
      },
      {
        label: 'hooks',
        value: 'src/hooks',
        children: [
          { label: 'use-debounce.ts', value: 'src/hooks/use-debounce.ts' },
          { label: 'use-media-query.ts', value: 'src/hooks/use-media-query.ts' },
        ],
      },
    ],
  },
  { label: 'package.json', value: 'package.json' },
]

const Demo = defineComponent({
  name: 'TreeSearchFilterDemo',
  setup() {
    const query = ref('')
    const filtered = computed(() => filterTreeData(localData, query.value))
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
        h(TextInput, {
          modelValue: query.value,
          'onUpdate:modelValue': (v: string) => (query.value = v),
          placeholder: 'Search files…',
          mb: 'md',
        }),
        h(Tree, {
          data: filtered.value,
          tree,
          withLines: true,
          renderNode,
        }),
      ])
  },
})

export const searchFilter: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
