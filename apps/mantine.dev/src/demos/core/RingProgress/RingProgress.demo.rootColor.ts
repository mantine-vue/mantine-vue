import { defineComponent, h } from 'vue'
import { RingProgress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RingProgress } from '@mantine-vue/core'
</script>

<template>
  <RingProgress :sections="[{ value: 40, color: 'yellow' }]" rootColor="red" />
</template>
`

const Demo = defineComponent({
  name: 'RingProgressRootColorDemo',
  setup() {
    return () =>
      h(RingProgress, {
        sections: [{ value: 40, color: 'yellow' }],
        rootColor: 'red',
      })
  },
})

export const rootColor: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
