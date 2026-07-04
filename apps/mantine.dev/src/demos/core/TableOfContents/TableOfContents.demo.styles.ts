import { defineComponent, h } from 'vue'
import { TableOfContents } from '@mantine-vue/core'
import classes from './TableOfContents.demo.styles.module.css'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div id="toc-demo-styles" style="display: flex; gap: 16px; max-height: 320px;">
    <div style="flex: 1; overflow-y: auto; padding-right: 8px;">
      <h2 id="toc-styles-intro">Introduction</h2>
      <p>Introduction content.</p>
      <h3 id="toc-styles-basics">Basics</h3>
      <p>Basic concepts.</p>
      <h2 id="toc-styles-advanced">Advanced</h2>
      <p>Advanced topics.</p>
      <h3 id="toc-styles-patterns">Patterns</h3>
      <p>Common patterns.</p>
      <h2 id="toc-styles-summary">Summary</h2>
      <p>Summary content.</p>
    </div>
    <TableOfContents
      style="width: 160px; flex-shrink: 0;"
      size="sm"
      variant="none"
      :class-names="$style"
      :min-depth-to-offset="0"
      :depth-offset="40"
      :scroll-spy-options="{ selector: '#toc-demo-styles :is(h2, h3)' }"
      :get-control-props="({ data }) => ({
        onClick: () => data.getNode().scrollIntoView(),
        children: data.value,
      })"
    />
  </div>
</template>

<script setup lang="ts">
import { TableOfContents } from '@mantine-vue/core'
</script>

<style module>
.control {
  transition: transform 100ms ease;
}
.control[data-active] {
  background-color: var(--mantine-color-lime-4);
  color: var(--mantine-color-black);
  transform: scale(1.1);
}
</style>
`

const headings = [
  { id: 'toc-styles-intro', tag: 'h2', label: 'Introduction' },
  { id: 'toc-styles-basics', tag: 'h3', label: 'Basics' },
  { id: 'toc-styles-advanced', tag: 'h2', label: 'Advanced' },
  { id: 'toc-styles-patterns', tag: 'h3', label: 'Patterns' },
  { id: 'toc-styles-summary', tag: 'h2', label: 'Summary' },
]

const Demo = defineComponent({
  name: 'TableOfContentsStylesDemo',
  setup() {
    return () =>
      h(
        'div',
        {
          id: 'toc-demo-styles',
          style: { display: 'flex', gap: '16px', maxHeight: '320px', width: '100%' },
        },
        [
          h(
            'div',
            { style: { flex: '1', overflowY: 'auto', paddingRight: '8px' } },
            headings.map(({ id, tag, label }) => h(tag, { key: id, id }, label)),
          ),
          h(TableOfContents, {
            style: { width: '160px', flexShrink: '0' },
            size: 'sm',
            variant: 'none',
            classNames: classes,
            minDepthToOffset: 0,
            depthOffset: 40,
            scrollSpyOptions: { selector: '#toc-demo-styles :is(h2, h3)' },
            getControlProps: ({ data }: any) => ({
              onClick: () => data.getNode().scrollIntoView(),
              children: data.value,
            }),
          }),
        ],
      )
  },
})

export const styles: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
