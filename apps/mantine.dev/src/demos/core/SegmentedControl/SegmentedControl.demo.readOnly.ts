import { defineComponent, h } from 'vue'
import { SegmentedControl } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SegmentedControl } from '@mantine-vue/core'
</script>

<template>
  <SegmentedControl read-only default-value="Angular" :data="['React', 'Angular', 'Vue']" />
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlReadOnlyDemo',
  setup: () => () =>
    h(SegmentedControl, {
      readOnly: true,
      defaultValue: 'Angular',
      data: ['React', 'Angular', 'Vue'],
    }),
})

export const readOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
