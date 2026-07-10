import { defineComponent, h, ref } from 'vue'
import { Badge, Group, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Group, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'

const taps = ref(0)
const drags = ref(0)

const { ref: dragRef, active } = useDrag(
  (state) => {
    if (state.last) {
      if (state.tap) {
        taps.value += 1
      } else {
        drags.value += 1
      }
    }
  },
  { filterTaps: true, threshold: 5 },
)
</script>

<template>
  <Group justify="center">
    <button
      type="button"
      :ref="dragRef"
      :style="{
        width: '200px',
        height: '80px',
        backgroundColor: active ? 'var(--mantine-color-teal-filled)' : 'var(--mantine-color-blue-filled)',
        borderRadius: 'var(--mantine-radius-md)',
        border: 'none',
        cursor: active ? 'grabbing' : 'pointer',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--mantine-color-white)',
        fontWeight: 600,
        userSelect: 'none',
      }"
    >
      Click or drag me
    </button>
  </Group>

  <Group justify="center" mt="md" gap="lg">
    <Text size="sm">Taps: <Badge>{{ taps }}</Badge></Text>
    <Text size="sm">Drags: <Badge color="teal">{{ drags }}</Badge></Text>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseDragFilterTapsDemo',
  setup() {
    const taps = ref(0)
    const drags = ref(0)

    const { ref: dragRef, active } = useDrag(
      (state) => {
        if (state.last) {
          if (state.tap) {
            taps.value += 1
          } else {
            drags.value += 1
          }
        }
      },
      { filterTaps: true, threshold: 5 },
    )

    return () =>
      h('div', [
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              h(
                'button',
                {
                  type: 'button',
                  ref: dragRef,
                  style: {
                    width: '200px',
                    height: '80px',
                    backgroundColor: active.value
                      ? 'var(--mantine-color-teal-filled)'
                      : 'var(--mantine-color-blue-filled)',
                    borderRadius: 'var(--mantine-radius-md)',
                    border: 'none',
                    cursor: active.value ? 'grabbing' : 'pointer',
                    touchAction: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mantine-color-white)',
                    fontWeight: 600,
                    userSelect: 'none',
                  },
                },
                'Click or drag me',
              ),
          },
        ),
        h(
          Group,
          { justify: 'center', mt: 'md', gap: 'lg' },
          {
            default: () => [
              h(
                Text,
                { size: 'sm' },
                {
                  default: () => ['Taps: ', h(Badge, null, { default: () => String(taps.value) })],
                },
              ),
              h(
                Text,
                { size: 'sm' },
                {
                  default: () => [
                    'Drags: ',
                    h(Badge, { color: 'teal' }, { default: () => String(drags.value) }),
                  ],
                },
              ),
            ],
          },
        ),
      ])
  },
})

export const filterTaps: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
