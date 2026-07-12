import { defineComponent, h } from 'vue'
import { TableOfContents } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TableOfContents } from '@mantine-vue/core'
</script>

<template>
  <TableOfContents
    :min-depth-to-offset="0"
    :depth-offset="40"
    size="sm"
    :scroll-spy-options="{
      selector: '#mdx [data-heading]',
      getDepth: (element) => Number(element.getAttribute('data-order')),
      getValue: (element) => element.getAttribute('data-heading') || '',
    }"
    :get-control-props="({ data }) => ({
      onClick: () => data.getNode().scrollIntoView(),
      children: data.value,
    })"
  />
</template>
`

const Demo = defineComponent({
  name: 'TableOfContentsDepthOffsetDemo',
  setup() {
    return () =>
      h(TableOfContents, {
        minDepthToOffset: 0,
        depthOffset: 40,
        size: 'sm',
        scrollSpyOptions: {
          selector: '#mdx [data-heading]',
          getDepth: (element: HTMLElement) => Number(element.getAttribute('data-order')),
          getValue: (element: HTMLElement) => element.getAttribute('data-heading') || '',
        },
        getControlProps: ({ data }: any) => ({
          onClick: () => data.getNode().scrollIntoView(),
          children: data.value,
        }),
      })
  },
})

export const depthOffset: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
