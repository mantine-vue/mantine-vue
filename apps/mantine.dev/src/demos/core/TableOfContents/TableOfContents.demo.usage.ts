import { defineComponent, h } from 'vue'
import { TableOfContents } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TableOfContents } from '@mantine-vue/core'
</script>

<template>
  <TableOfContents
    {{props}}
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

const Wrapper = defineComponent({
  name: 'TableOfContentsUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(TableOfContents, {
        ...(attrs as any),
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

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
  controls: [
    {
      type: 'segmented',
      prop: 'variant',
      initialValue: 'filled',
      data: ['filled', 'light', 'none'],
      libraryValue: null,
    },
    { type: 'color', prop: 'color', initialValue: 'blue', libraryValue: null },
    { type: 'size', prop: 'size', initialValue: 'md', libraryValue: '__' },
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: '__' },
  ],
}
