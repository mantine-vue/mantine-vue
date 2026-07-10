import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { useSplitter } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { useSplitter } from '@mantine-vue/hooks'

const splitter = useSplitter({
  panels: [
    { defaultSize: 30, collapsible: true, min: 15 },
    { defaultSize: 70, min: 20 },
  ],
})
</script>

<template>
  <div :ref="splitter.ref" style="display: flex; height: 200px; border-radius: var(--mantine-radius-md); overflow: hidden;">
    <div
      :style="{
        width: \`\${splitter.sizes[0]}%\`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--mantine-color-blue-filled)',
        color: 'var(--mantine-color-white)',
        fontWeight: 500,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }"
    >
      {{ !splitter.collapsed[0] ? \`Panel A (\${Math.round(splitter.sizes[0])}%)\` : '' }}
    </div>
    <div
      v-bind="splitter.getHandleProps({ index: 0 })"
      style="width: 4px; flex-shrink: 0; cursor: col-resize; touch-action: none; background-color: var(--mantine-color-default-border); position: relative;"
    >
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 40px; border-radius: var(--mantine-radius-xs); background-color: var(--mantine-color-default); border: 1px solid var(--mantine-color-default-border);" />
    </div>
    <div
      :style="{
        width: \`\${splitter.sizes[1]}%\`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--mantine-color-teal-filled)',
        color: 'var(--mantine-color-white)',
        fontWeight: 500,
      }"
    >
      Panel B ({{ Math.round(splitter.sizes[1]) }}%)
    </div>
  </div>
  <Group mt="md">
    <Button size="xs" @click="splitter.toggleCollapse(0)">
      {{ splitter.collapsed[0] ? 'Expand Panel A' : 'Collapse Panel A' }}
    </Button>
  </Group>
</template>
`

const handleStyle = {
  width: '4px',
  flexShrink: 0,
  cursor: 'col-resize',
  touchAction: 'none',
  backgroundColor: 'var(--mantine-color-default-border)',
  position: 'relative' as const,
}

const gripStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '8px',
  height: '40px',
  borderRadius: 'var(--mantine-radius-xs)',
  backgroundColor: 'var(--mantine-color-default)',
  border: '1px solid var(--mantine-color-default-border)',
}

const Demo = defineComponent({
  name: 'UseSplitterCollapsibleDemo',
  setup() {
    const splitter = useSplitter({
      panels: [
        { defaultSize: 30, collapsible: true, min: 15 },
        { defaultSize: 70, min: 20 },
      ],
    })

    return () =>
      h('div', [
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
          [
            h(
              'div',
              {
                style: {
                  width: `${splitter.sizes.value[0]}%`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--mantine-color-blue-filled)',
                  color: 'var(--mantine-color-white)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                },
              },
              splitter.collapsed.value[0]
                ? ''
                : `Panel A (${Math.round(splitter.sizes.value[0])}%)`,
            ),
            h('div', { style: handleStyle, ...splitter.getHandleProps({ index: 0 }) }, [
              h('div', { style: gripStyle }),
            ]),
            h(
              'div',
              {
                style: {
                  width: `${splitter.sizes.value[1]}%`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--mantine-color-teal-filled)',
                  color: 'var(--mantine-color-white)',
                  fontWeight: 500,
                },
              },
              `Panel B (${Math.round(splitter.sizes.value[1])}%)`,
            ),
          ],
        ),
        h(
          Group,
          { mt: 'md' },
          {
            default: () =>
              h(
                Button,
                { size: 'xs', onClick: () => splitter.toggleCollapse(0) },
                {
                  default: () =>
                    splitter.collapsed.value[0] ? 'Expand Panel A' : 'Collapse Panel A',
                },
              ),
          },
        ),
      ])
  },
})

export const collapsible: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
