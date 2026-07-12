import { defineComponent, h } from 'vue'
import { TableOfContents } from '@mantine-vue/core'
import classes from './TableOfContents.demo.styles.module.css'
import type { MantineDemo } from '@/demo'

const cssCode = `.control {
  transition: transform 100ms ease;

  &[data-active] {
    background-color: var(--mantine-color-lime-4);
    color: var(--mantine-color-black);
    transform: scale(1.1);
  }
}`

const code = `
<script setup lang="ts">
import { TableOfContents } from '@mantine-vue/core'
import classes from './Demo.module.css'
</script>

<template>
  <TableOfContents
    size="sm"
    variant="none"
    :class-names="classes"
    :min-depth-to-offset="0"
    :depth-offset="40"
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
  name: 'TableOfContentsStylesDemo',
  setup() {
    return () =>
      h(TableOfContents, {
        size: 'sm',
        variant: 'none',
        classNames: classes,
        minDepthToOffset: 0,
        depthOffset: 40,
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

export const styles: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', code, language: 'html' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
  maxWidth: 340,
  centered: true,
}
