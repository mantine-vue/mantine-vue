import { defineComponent, h } from 'vue'
import { TableOfContents } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div id="toc-demo-depth" style="display: flex; gap: 16px; max-height: 320px;">
    <div style="flex: 1; overflow-y: auto; padding-right: 8px;">
      <h2 id="toc-depth-getting-started">Getting started</h2>
      <p>Getting started content.</p>
      <h3 id="toc-depth-installation">Installation</h3>
      <p>Installation instructions.</p>
      <h2 id="toc-depth-usage">Usage</h2>
      <p>Usage content.</p>
      <h3 id="toc-depth-examples">Examples</h3>
      <p>Examples content.</p>
      <h2 id="toc-depth-api">API</h2>
      <p>API content.</p>
    </div>
    <TableOfContents
      style="width: 160px; flex-shrink: 0;"
      size="sm"
      :min-depth-to-offset="0"
      :depth-offset="40"
      :scroll-spy-options="{ selector: '#toc-demo-depth :is(h2, h3)' }"
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
  { id: 'toc-depth-getting-started', tag: 'h2', label: 'Getting started' },
  { id: 'toc-depth-installation', tag: 'h3', label: 'Installation' },
  { id: 'toc-depth-usage', tag: 'h2', label: 'Usage' },
  { id: 'toc-depth-examples', tag: 'h3', label: 'Examples' },
  { id: 'toc-depth-api', tag: 'h2', label: 'API' },
]

const Demo = defineComponent({
  name: 'TableOfContentsDepthOffsetDemo',
  setup() {
    return () =>
      h(
        'div',
        {
          id: 'toc-demo-depth',
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
            minDepthToOffset: 0,
            depthOffset: 40,
            scrollSpyOptions: { selector: '#toc-demo-depth :is(h2, h3)' },
            getControlProps: ({ data }: any) => ({
              onClick: () => data.getNode().scrollIntoView(),
              children: data.value,
            }),
          }),
        ],
      )
  },
})

export const depthOffset: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
