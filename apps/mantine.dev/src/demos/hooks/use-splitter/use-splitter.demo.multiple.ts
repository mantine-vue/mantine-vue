import { defineComponent, h } from 'vue'
import { useSplitter } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const colors = [
  'var(--mantine-color-blue-filled)',
  'var(--mantine-color-teal-filled)',
  'var(--mantine-color-grape-filled)',
]
const labels = ['Panel A', 'Panel B', 'Panel C']

const code = `
<script setup lang="ts">
import { useSplitter } from '@mantine-vue/hooks'

const colors = [
  'var(--mantine-color-blue-filled)',
  'var(--mantine-color-teal-filled)',
  'var(--mantine-color-grape-filled)',
]
const labels = ['Panel A', 'Panel B', 'Panel C']

const splitter = useSplitter({
  panels: [
    { defaultSize: 25, min: 10 },
    { defaultSize: 50, min: 20 },
    { defaultSize: 25, min: 10 },
  ],
})
</script>

<template>
  <div :ref="splitter.ref" style="display: flex; height: 200px; border-radius: var(--mantine-radius-md); overflow: hidden;">
    <template v-for="(size, i) in splitter.sizes" :key="i">
      <div
        v-if="i > 0"
        v-bind="splitter.getHandleProps({ index: i - 1 })"
        style="width: 4px; flex-shrink: 0; cursor: col-resize; touch-action: none; background-color: var(--mantine-color-default-border);"
      />
      <div
        :style="{
          width: \`\${size}%\`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors[i],
          color: 'var(--mantine-color-white)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }"
      >
        {{ labels[i] }} ({{ Math.round(size) }}%)
      </div>
    </template>
  </div>
</template>
`

const handleStyle = {
  width: '4px',
  flexShrink: 0,
  cursor: 'col-resize',
  touchAction: 'none',
  backgroundColor: 'var(--mantine-color-default-border)',
}

const Demo = defineComponent({
  name: 'UseSplitterMultipleDemo',
  setup() {
    const splitter = useSplitter({
      panels: [
        { defaultSize: 25, min: 10 },
        { defaultSize: 50, min: 20 },
        { defaultSize: 25, min: 10 },
      ],
    })

    return () =>
      h(
        'div',
        {
          ref: splitter.ref,
          style: {
            display: 'flex',
            height: '200px',
            borderRadius: 'var(--mantine-radius-md)',
            overflow: 'hidden',
          },
        },
        splitter.sizes.value.flatMap((size, i) => [
          i > 0
            ? h('div', {
                key: `handle-${i}`,
                style: handleStyle,
                ...splitter.getHandleProps({ index: i - 1 }),
              })
            : null,
          h(
            'div',
            {
              key: `panel-${i}`,
              style: {
                width: `${size}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors[i],
                color: 'var(--mantine-color-white)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              },
            },
            `${labels[i]} (${Math.round(size)}%)`,
          ),
        ]),
      )
  },
})

export const multiple: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
