import { defineComponent, h, ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'

const scrollEl = ref<HTMLDivElement | null>(null)

const { ref: dragRef, active } = useDrag(
  (state) => {
    if (scrollEl.value) {
      scrollEl.value.scrollLeft -= state.delta[0]
    }
  },
  { axis: 'x', filterTaps: true, threshold: 5 },
)

function assignRef(node: HTMLDivElement | null) {
  scrollEl.value = node
  dragRef(node)
}
</script>

<template>
  <div
    :ref="assignRef"
    :style="{
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      cursor: active ? 'grabbing' : 'grab',
      touchAction: 'pan-y',
      userSelect: 'none',
      borderRadius: 'var(--mantine-radius-md)',
      border: '1px solid var(--mantine-color-default-border)',
      padding: 'var(--mantine-spacing-md)',
    }"
  >
    <div
      v-for="i in 20"
      :key="i"
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '80px',
        marginRight: '12px',
        backgroundColor: \`hsl(\${(i - 1) * 18}, 60%, 70%)\`,
        borderRadius: 'var(--mantine-radius-sm)',
        fontWeight: 600,
        verticalAlign: 'top',
      }"
    >
      Card {{ i }}
    </div>
  </div>
  <Text ta="center" mt="sm" size="sm" c="dimmed">Drag horizontally to scroll</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseDragScrollDemo',
  setup() {
    const scrollEl = ref<HTMLDivElement | null>(null)

    const { ref: dragRef, active } = useDrag(
      (state) => {
        if (scrollEl.value) {
          scrollEl.value.scrollLeft -= state.delta[0]
        }
      },
      { axis: 'x', filterTaps: true, threshold: 5 },
    )

    const assignRef = (el: any) => {
      scrollEl.value = el ?? null
      dragRef(el ?? null)
    }

    return () =>
      h('div', [
        h(
          'div',
          {
            ref: assignRef,
            style: {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              cursor: active.value ? 'grabbing' : 'grab',
              touchAction: 'pan-y',
              userSelect: 'none',
              borderRadius: 'var(--mantine-radius-md)',
              border: '1px solid var(--mantine-color-default-border)',
              padding: 'var(--mantine-spacing-md)',
            },
          },
          Array.from({ length: 20 }, (_, i) =>
            h(
              'div',
              {
                key: i,
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '120px',
                  height: '80px',
                  marginRight: '12px',
                  backgroundColor: `hsl(${i * 18}, 60%, 70%)`,
                  borderRadius: 'var(--mantine-radius-sm)',
                  fontWeight: 600,
                  verticalAlign: 'top',
                  color: 'var(--mantine-color-black)',
                },
              },
              `Card ${i + 1}`,
            ),
          ),
        ),
        h(
          Text,
          { ta: 'center', mt: 'sm', size: 'sm', c: 'dimmed' },
          { default: () => 'Drag horizontally to scroll' },
        ),
      ])
  },
})

export const scroll: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
