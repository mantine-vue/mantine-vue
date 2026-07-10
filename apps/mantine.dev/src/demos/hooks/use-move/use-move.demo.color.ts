import { defineComponent, h, ref } from 'vue'
import { useMove } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { useMove } from '@mantine-vue/hooks'

const value = ref({ x: 0.2, y: 0.6 })
const { ref: moveRef } = useMove((position) => (value.value = position))
</script>

<template>
  <div>
    <div
      :ref="moveRef"
      :style="{ width: '300px', height: '150px', backgroundColor: 'red', position: 'relative' }"
    >
      <!-- Gradient overlays -->
      <div
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(90deg, #fff, transparent)',
        }"
      />
      <div
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(0deg, #000, transparent)',
        }"
      />

      <!-- Thumb -->
      <div
        :style="{
          position: 'absolute',
          left: \`calc(\${value.x * 100}% - 8px)\`,
          top: \`calc(\${value.y * 100}% - 8px)\`,
          width: '16px',
          height: '16px',
          border: '2px solid #fff',
          borderRadius: '16px',
        }"
      />
    </div>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseMoveColorDemo',
  setup() {
    const value = ref({ x: 0.2, y: 0.6 })
    const { ref: moveRef } = useMove<HTMLDivElement>((position) => (value.value = position))

    return () =>
      h('div', [
        h(
          'div',
          {
            ref: moveRef,
            style: {
              width: '300px',
              height: '150px',
              backgroundColor: 'red',
              position: 'relative',
            },
          },
          [
            h('div', {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(90deg, #fff, transparent)',
              },
            }),
            h('div', {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(0deg, #000, transparent)',
              },
            }),
            h('div', {
              style: {
                position: 'absolute',
                left: `calc(${value.value.x * 100}% - 8px)`,
                top: `calc(${value.value.y * 100}% - 8px)`,
                width: '16px',
                height: '16px',
                border: '2px solid #fff',
                borderRadius: '16px',
              },
            }),
          ],
        ),
      ])
  },
})

export const color: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
