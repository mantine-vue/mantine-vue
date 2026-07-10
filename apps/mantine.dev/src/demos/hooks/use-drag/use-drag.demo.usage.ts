import { defineComponent, h, ref } from 'vue'
import { Code, Group, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Code, Group, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'

const pos = ref({ x: 0, y: 0 })
let startPos = { x: 0, y: 0 }

const { ref: dragRef, active } = useDrag((state) => {
  if (state.first) {
    startPos = { ...pos.value }
  }
  pos.value = {
    x: startPos.x + state.movement[0],
    y: startPos.y + state.movement[1],
  }
})
</script>

<template>
  <Group justify="center">
    <div
      :ref="dragRef"
      :style="{
        width: '200px',
        height: '120px',
        backgroundColor: active ? 'var(--mantine-color-teal-filled)' : 'var(--mantine-color-blue-filled)',
        borderRadius: 'var(--mantine-radius-md)',
        transform: \`translate(\${pos.x}px, \${pos.y}px)\`,
        cursor: active ? 'grabbing' : 'grab',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--mantine-color-white)',
        fontWeight: 600,
        userSelect: 'none',
      }"
    >
      Drag me
    </div>
  </Group>
  <Text ta="center" mt="sm" size="sm">
    Position: <Code>{{ \`{ x: \${Math.round(pos.x)}, y: \${Math.round(pos.y)} }\` }}</Code>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseDragUsageDemo',
  setup() {
    const pos = ref({ x: 0, y: 0 })
    let startPos = { x: 0, y: 0 }

    const { ref: dragRef, active } = useDrag((state) => {
      if (state.first) {
        startPos = { ...pos.value }
      }
      pos.value = {
        x: startPos.x + state.movement[0],
        y: startPos.y + state.movement[1],
      }
    })

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
                  ref: dragRef,
                  style: {
                    width: '200px',
                    height: '120px',
                    backgroundColor: active.value
                      ? 'var(--mantine-color-teal-filled)'
                      : 'var(--mantine-color-blue-filled)',
                    borderRadius: 'var(--mantine-radius-md)',
                    transform: `translate(${pos.value.x}px, ${pos.value.y}px)`,
                    cursor: active.value ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mantine-color-white)',
                    fontWeight: 600,
                    userSelect: 'none',
                  },
                },
                'Drag me',
              ),
          },
        ),
        h(
          Text,
          { ta: 'center', mt: 'sm', size: 'sm' },
          {
            default: () => [
              'Position: ',
              h(Code, null, {
                default: () => `{ x: ${Math.round(pos.value.x)}, y: ${Math.round(pos.value.y)} }`,
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
