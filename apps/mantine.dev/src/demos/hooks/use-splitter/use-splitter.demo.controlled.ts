import { defineComponent, h, ref } from 'vue'
import { Button, Group, Text } from '@mantine-vue/core'
import { useSplitter } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Text } from '@mantine-vue/core'
import { useSplitter } from '@mantine-vue/hooks'

const sizes = ref([50, 50])

const splitter = useSplitter({
  panels: [
    { defaultSize: 50, min: 20 },
    { defaultSize: 50, min: 20 },
  ],
  sizes,
  onSizeChange: (next) => (sizes.value = next),
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
      }"
    >
      Panel A ({{ Math.round(splitter.sizes[0]) }}%)
    </div>
    <div
      v-bind="splitter.getHandleProps({ index: 0 })"
      style="width: 4px; flex-shrink: 0; cursor: col-resize; touch-action: none; background-color: var(--mantine-color-default-border);"
    />
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
  <Text size="sm" mt="sm">
    Current sizes: [{{ sizes.map((s) => Math.round(s)).join(', ') }}]
  </Text>
  <Group mt="xs">
    <Button size="xs" @click="sizes = [30, 70]">30 / 70</Button>
    <Button size="xs" @click="sizes = [50, 50]">50 / 50</Button>
    <Button size="xs" @click="sizes = [70, 30]">70 / 30</Button>
  </Group>
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
  name: 'UseSplitterControlledDemo',
  setup() {
    const sizes = ref([50, 50])

    const splitter = useSplitter({
      panels: [
        { defaultSize: 50, min: 20 },
        { defaultSize: 50, min: 20 },
      ],
      sizes,
      onSizeChange: (next: number[]) => (sizes.value = next),
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
                },
              },
              `Panel A (${Math.round(splitter.sizes.value[0])}%)`,
            ),
            h('div', { style: handleStyle, ...splitter.getHandleProps({ index: 0 }) }),
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
          Text,
          { size: 'sm', mt: 'sm' },
          {
            default: () => `Current sizes: [${sizes.value.map((s) => Math.round(s)).join(', ')}]`,
          },
        ),
        h(
          Group,
          { mt: 'xs' },
          {
            default: () => [
              h(
                Button,
                { size: 'xs', onClick: () => (sizes.value = [30, 70]) },
                { default: () => '30 / 70' },
              ),
              h(
                Button,
                { size: 'xs', onClick: () => (sizes.value = [50, 50]) },
                { default: () => '50 / 50' },
              ),
              h(
                Button,
                { size: 'xs', onClick: () => (sizes.value = [70, 30]) },
                { default: () => '70 / 30' },
              ),
            ],
          },
        ),
      ])
  },
})

export const controlled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
