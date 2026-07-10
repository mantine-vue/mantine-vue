import { defineComponent, h } from 'vue'
import { Group, Text } from '@mantine-vue/core'
import { useElementSize } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useElementSize } from '@mantine-vue/hooks'

const { ref: sizeRef, width, height } = useElementSize()
</script>

<template>
  <textarea :ref="sizeRef" :style="{ width: '400px', height: '120px' }" />
  <div>Width: {{ width }}, height: {{ height }}</div>
</template>
`

const Demo = defineComponent({
  name: 'UseElementSizeUsageDemo',
  setup() {
    const { ref: sizeRef, width, height } = useElementSize<HTMLTextAreaElement>()

    return () =>
      h('div', [
        h(
          Text,
          { ta: 'center', size: 'sm', style: { marginBottom: 'var(--mantine-spacing-xs)' } },
          {
            default: () => 'Resize textarea by dragging its right bottom corner',
          },
        ),
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              h('textarea', {
                ref: sizeRef,
                'aria-label': 'Resize me',
                style: {
                  width: '400px',
                  height: '120px',
                  border: 'none',
                  backgroundColor: 'var(--mantine-color-body)',
                  position: 'relative',
                },
              }),
          },
        ),
        h(
          Text,
          { ta: 'center', mt: 'sm' },
          {
            default: () => `Width: ${width.value}, height: ${height.value}`,
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  dimmed: true,
}
