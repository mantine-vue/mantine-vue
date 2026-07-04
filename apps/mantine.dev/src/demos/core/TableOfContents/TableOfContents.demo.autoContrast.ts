import { defineComponent, h } from 'vue'
import { TableOfContents } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div id="toc-demo-contrast" style="display: flex; gap: 16px; max-height: 320px;">
    <div style="flex: 1; overflow-y: auto; padding-right: 8px;">
      <h2 id="toc-contrast-overview">Overview</h2>
      <p>Overview content.</p>
      <h3 id="toc-contrast-setup">Setup</h3>
      <p>Setup instructions.</p>
      <h2 id="toc-contrast-guide">Guide</h2>
      <p>Guide content.</p>
      <h3 id="toc-contrast-tips">Tips</h3>
      <p>Helpful tips.</p>
      <h2 id="toc-contrast-reference">Reference</h2>
      <p>Reference content.</p>
    </div>
    <TableOfContents
      style="width: 160px; flex-shrink: 0;"
      size="sm"
      auto-contrast
      color="yellow.4"
      :scroll-spy-options="{ selector: '#toc-demo-contrast :is(h2, h3)' }"
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
`

const headings = [
  { id: 'toc-contrast-overview', tag: 'h2', label: 'Overview' },
  { id: 'toc-contrast-setup', tag: 'h3', label: 'Setup' },
  { id: 'toc-contrast-guide', tag: 'h2', label: 'Guide' },
  { id: 'toc-contrast-tips', tag: 'h3', label: 'Tips' },
  { id: 'toc-contrast-reference', tag: 'h2', label: 'Reference' },
]

const Demo = defineComponent({
  name: 'TableOfContentsAutoContrastDemo',
  setup() {
    return () =>
      h(
        'div',
        {
          id: 'toc-demo-contrast',
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
            autoContrast: true,
            color: 'yellow.4',
            scrollSpyOptions: { selector: '#toc-demo-contrast :is(h2, h3)' },
            getControlProps: ({ data }: any) => ({
              onClick: () => data.getNode().scrollIntoView(),
              children: data.value,
            }),
          }),
        ],
      )
  },
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
