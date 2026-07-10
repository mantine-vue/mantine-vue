import { defineComponent, h, ref } from 'vue'
import { Group, Text } from '@mantine-vue/core'
import { useMove } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Group, Text } from '@mantine-vue/core'
import { useMove } from '@mantine-vue/hooks'

const value = ref(0.2)
const { ref: moveRef } = useMove(({ x }) => (value.value = x))
</script>

<template>
  <Group justify="center">
    <div
      :ref="moveRef"
      :style="{
        width: '400px',
        height: '16px',
        backgroundColor: 'var(--mantine-color-blue-light)',
        position: 'relative',
      }"
    >
      <!-- Filled bar -->
      <div
        :style="{
          width: \`\${value * 100}%\`,
          height: '16px',
          backgroundColor: 'var(--mantine-color-blue-filled)',
          opacity: 0.7,
        }"
      />

      <!-- Thumb -->
      <div
        :style="{
          position: 'absolute',
          left: \`calc(\${value * 100}% - 8px)\`,
          top: 0,
          width: '16px',
          height: '16px',
          backgroundColor: 'var(--mantine-color-blue-7)',
        }"
      />
    </div>
  </Group>

  <Text ta="center" mt="sm">Value: {{ Math.round(value * 100) }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMoveHorizontalDemo',
  setup() {
    const value = ref(0.2)
    const { ref: moveRef } = useMove<HTMLDivElement>(({ x }) => (value.value = x))

    return () =>
      h('div', [
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              h(
                'div',
                {
                  ref: moveRef,
                  style: {
                    width: '400px',
                    height: '16px',
                    backgroundColor: 'var(--mantine-color-blue-light)',
                    position: 'relative',
                  },
                },
                [
                  h('div', {
                    style: {
                      width: `${value.value * 100}%`,
                      height: '16px',
                      backgroundColor: 'var(--mantine-color-blue-filled)',
                      opacity: 0.7,
                    },
                  }),
                  h('div', {
                    style: {
                      position: 'absolute',
                      left: `calc(${value.value * 100}% - 8px)`,
                      top: 0,
                      width: '16px',
                      height: '16px',
                      backgroundColor: 'var(--mantine-color-blue-7)',
                    },
                  }),
                ],
              ),
          },
        ),
        h(
          Text,
          { ta: 'center', mt: 'sm' },
          {
            default: () => `Value: ${Math.round(value.value * 100)}`,
          },
        ),
      ])
  },
})

export const horizontal: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
