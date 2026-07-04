import { defineComponent, h } from 'vue'
import { SemiCircleProgress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SemiCircleProgress } from '@mantine-vue/core'
</script>

<template>
  <SemiCircleProgress :value="30" emptySegmentColor="var(--mantine-color-dimmed)" />
</template>
`

const Demo = defineComponent({
  name: 'SemiCircleProgressEmptySegmentColorDemo',
  setup() {
    return () =>
      h(SemiCircleProgress, {
        value: 30,
        emptySegmentColor: 'var(--mantine-color-dimmed)',
      })
  },
})

export const emptySegmentColor: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
