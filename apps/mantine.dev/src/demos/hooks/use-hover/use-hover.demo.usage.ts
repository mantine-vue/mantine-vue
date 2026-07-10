import { defineComponent, h } from 'vue'
import { useHover } from '@mantine-vue/hooks'
import { Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useHover } from '@mantine-vue/hooks'

const { ref: hoverRef, hovered } = useHover()
</script>

<template>
  <div
    ref="hoverRef"
    style="height: 60px; background-color: var(--mantine-color-blue-light); display: flex; align-items: center; justify-content: center;"
  >
    {{ hovered ? 'I am hovered' : 'Put mouse over me please' }}
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseHoverUsageDemo',
  setup() {
    const { ref: hoverRef, hovered } = useHover<HTMLDivElement>()

    return () =>
      h(
        'div',
        {
          ref: hoverRef,
          style: {
            height: '60px',
            backgroundColor: 'var(--mantine-color-blue-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        [
          h(Text, null, {
            default: () => (hovered.value ? 'I am hovered' : 'Put mouse over me please'),
          }),
        ],
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
