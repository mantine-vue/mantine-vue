import { defineComponent, h, ref } from 'vue'
import { Code, Group, Text } from '@mantine-vue/core'
import { useMove } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Code, Group, Text } from '@mantine-vue/core'
import { useMove } from '@mantine-vue/hooks'

const value = ref({ x: 0.2, y: 0.6 })
const { ref: moveRef, active } = useMove((position) => (value.value = position))
</script>

<template>
  <Group justify="center">
    <div
      :ref="moveRef"
      :style="{
        width: '400px',
        height: '120px',
        backgroundColor: 'var(--mantine-color-blue-light)',
        position: 'relative',
      }"
    >
      <div
        :style="{
          position: 'absolute',
          left: \`calc(\${value.x * 100}% - 8px)\`,
          top: \`calc(\${value.y * 100}% - 8px)\`,
          width: '16px',
          height: '16px',
          backgroundColor: active ? 'var(--mantine-color-teal-7)' : 'var(--mantine-color-blue-7)',
        }"
      />
    </div>
  </Group>
  <Text ta="center" mt="sm">
    Values <Code>{{ \`{ x: \${Math.round(value.x * 100)}, y: \${Math.round(value.y * 100)} }\` }}</Code>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMoveUsageDemo',
  setup() {
    const value = ref({ x: 0.2, y: 0.6 })
    const { ref: moveRef, active } = useMove<HTMLDivElement>((position) => (value.value = position))

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
                    height: '120px',
                    backgroundColor: 'var(--mantine-color-blue-light)',
                    position: 'relative',
                  },
                },
                [
                  h('div', {
                    style: {
                      position: 'absolute',
                      left: `calc(${value.value.x * 100}% - 8px)`,
                      top: `calc(${value.value.y * 100}% - 8px)`,
                      width: '16px',
                      height: '16px',
                      backgroundColor: active.value
                        ? 'var(--mantine-color-teal-7)'
                        : 'var(--mantine-color-blue-7)',
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
            default: () => [
              'Values ',
              h(Code, null, {
                default: () =>
                  `{ x: ${Math.round(value.value.x * 100)}, y: ${Math.round(value.value.y * 100)} }`,
              }),
            ],
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
