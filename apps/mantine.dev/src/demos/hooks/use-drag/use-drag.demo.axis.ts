import { defineComponent, h, ref } from 'vue'
import { Group, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Group, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'

const xPos = ref(0)
let xStart = 0
const yPos = ref(0)
let yStart = 0

const { ref: xRef, active: xActive } = useDrag(
  (state) => {
    if (state.first) xStart = xPos.value
    xPos.value = xStart + state.movement[0]
  },
  { axis: 'x' },
)

const { ref: yRef, active: yActive } = useDrag(
  (state) => {
    if (state.first) yStart = yPos.value
    yPos.value = yStart + state.movement[1]
  },
  { axis: 'y' },
)
</script>

<template>
  <Group justify="center" gap="xl">
    <div>
      <div
        :ref="xRef"
        :style="{
          width: '80px',
          height: '80px',
          backgroundColor: xActive ? 'var(--mantine-color-teal-filled)' : 'var(--mantine-color-blue-filled)',
          borderRadius: 'var(--mantine-radius-md)',
          transform: \`translateX(\${xPos}px)\`,
          cursor: xActive ? 'grabbing' : 'grab',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--mantine-color-white)',
          fontWeight: 600,
          userSelect: 'none',
        }"
      >
        X only
      </div>
      <Text ta="center" mt="xs" size="sm">x: {{ Math.round(xPos) }}</Text>
    </div>
    <div>
      <div
        :ref="yRef"
        :style="{
          width: '80px',
          height: '80px',
          backgroundColor: yActive ? 'var(--mantine-color-teal-filled)' : 'var(--mantine-color-blue-filled)',
          borderRadius: 'var(--mantine-radius-md)',
          transform: \`translateY(\${yPos}px)\`,
          cursor: yActive ? 'grabbing' : 'grab',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--mantine-color-white)',
          fontWeight: 600,
          userSelect: 'none',
        }"
      >
        Y only
      </div>
      <Text ta="center" mt="xs" size="sm">y: {{ Math.round(yPos) }}</Text>
    </div>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseDragAxisDemo',
  setup() {
    const xPos = ref(0)
    let xStart = 0
    const yPos = ref(0)
    let yStart = 0

    const { ref: xRef, active: xActive } = useDrag(
      (state) => {
        if (state.first) xStart = xPos.value
        xPos.value = xStart + state.movement[0]
      },
      { axis: 'x' },
    )

    const { ref: yRef, active: yActive } = useDrag(
      (state) => {
        if (state.first) yStart = yPos.value
        yPos.value = yStart + state.movement[1]
      },
      { axis: 'y' },
    )

    return () =>
      h(
        Group,
        { justify: 'center', gap: 'xl' },
        {
          default: () => [
            h('div', [
              h(
                'div',
                {
                  ref: xRef,
                  style: {
                    width: '80px',
                    height: '80px',
                    backgroundColor: xActive.value
                      ? 'var(--mantine-color-teal-filled)'
                      : 'var(--mantine-color-blue-filled)',
                    borderRadius: 'var(--mantine-radius-md)',
                    transform: `translateX(${xPos.value}px)`,
                    cursor: xActive.value ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mantine-color-white)',
                    fontWeight: 600,
                    userSelect: 'none',
                  },
                },
                'X only',
              ),
              h(
                Text,
                { ta: 'center', mt: 'xs', size: 'sm' },
                { default: () => `x: ${Math.round(xPos.value)}` },
              ),
            ]),
            h('div', [
              h(
                'div',
                {
                  ref: yRef,
                  style: {
                    width: '80px',
                    height: '80px',
                    backgroundColor: yActive.value
                      ? 'var(--mantine-color-teal-filled)'
                      : 'var(--mantine-color-blue-filled)',
                    borderRadius: 'var(--mantine-radius-md)',
                    transform: `translateY(${yPos.value}px)`,
                    cursor: yActive.value ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mantine-color-white)',
                    fontWeight: 600,
                    userSelect: 'none',
                  },
                },
                'Y only',
              ),
              h(
                Text,
                { ta: 'center', mt: 'xs', size: 'sm' },
                { default: () => `y: ${Math.round(yPos.value)}` },
              ),
            ]),
          ],
        },
      )
  },
})

export const axis: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
