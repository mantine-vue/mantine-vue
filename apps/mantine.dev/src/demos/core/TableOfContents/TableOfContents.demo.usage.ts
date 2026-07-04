import type { MantineDemo } from '@/demo'
import { TableOfContents } from '@mantine-vue/core'
import { defineComponent, h } from 'vue'

const code = `
<template>
  <div id="toc-demo-usage" style="display: flex; gap: 16px; max-height: 320px;">
    <div style="flex: 1; overflow-y: auto; padding-right: 8px;">
      <h2 id="toc-usage-introduction">Introduction</h2>
      <p>Content for the introduction section.</p>
      <h3 id="toc-usage-installation">Installation</h3>
      <p>How to install the package.</p>
      <h2 id="toc-usage-usage">Usage</h2>
      <p>Basic usage examples.</p>
      <h3 id="toc-usage-configuration">Configuration</h3>
      <p>Configuration options.</p>
      <h2 id="toc-usage-api">API Reference</h2>
      <p>Full API documentation.</p>
    </div>
    <TableOfContents
      style="width: 160px; flex-shrink: 0;"
      :scroll-spy-options="{ selector: '#toc-demo-usage :is(h2, h3)' }"
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
  { id: 'toc-usage-introduction', tag: 'h2', label: 'Introduction' },
  { id: 'toc-usage-installation', tag: 'h3', label: 'Installation' },
  { id: 'toc-usage-usage', tag: 'h2', label: 'Usage' },
  { id: 'toc-usage-configuration', tag: 'h3', label: 'Configuration' },
  { id: 'toc-usage-api', tag: 'h2', label: 'API Reference' },
]

const Demo = defineComponent({
  name: 'TableOfContentsUsageDemo',
  setup() {
    return () =>
      h(
        'div',
        {
          id: 'toc-demo-usage',
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
            scrollSpyOptions: { selector: '#toc-demo-usage :is(h2, h3)' },
            getControlProps: ({ data }: any) => ({
              onClick: () => data.getNode().scrollIntoView(),
              children: data.value,
            }),
          }),
        ],
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
