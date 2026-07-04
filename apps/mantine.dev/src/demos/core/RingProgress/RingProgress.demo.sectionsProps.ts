import { defineComponent, h, ref } from 'vue'
import { RingProgress, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { RingProgress, Text } from '@mantine-vue/core'

const hovered = ref(-1)
const reset = () => { hovered.value = -1 }
</script>

<template>
  <RingProgress
    @mouseleave="hovered = -1"
    :size="140"
    :sections="[
      { value: 40, color: 'cyan', onMouseenter: () => hovered = 0, onMouseleave: reset },
      { value: 20, color: 'blue', onMouseenter: () => hovered = 1, onMouseleave: reset },
      { value: 15, color: 'indigo', onMouseenter: () => hovered = 2, onMouseleave: reset },
    ]"
  />
  <Text>Hovered section: {{ hovered === -1 ? 'none' : hovered }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'RingProgressSectionsPropsDemo',
  setup() {
    const hovered = ref(-1)
    const reset = () => {
      hovered.value = -1
    }

    return () =>
      h('div', [
        h(RingProgress, {
          onMouseleave: () => {
            hovered.value = -1
          },
          size: 140,
          sections: [
            {
              value: 40,
              color: 'cyan',
              onMouseenter: () => {
                hovered.value = 0
              },
              onMouseleave: reset,
            },
            {
              value: 20,
              color: 'blue',
              onMouseenter: () => {
                hovered.value = 1
              },
              onMouseleave: reset,
            },
            {
              value: 15,
              color: 'indigo',
              onMouseenter: () => {
                hovered.value = 2
              },
              onMouseleave: reset,
            },
          ],
        }),
        h(
          Text,
          {},
          { default: () => `Hovered section: ${hovered.value === -1 ? 'none' : hovered.value}` },
        ),
      ])
  },
})

export const sectionsProps: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
