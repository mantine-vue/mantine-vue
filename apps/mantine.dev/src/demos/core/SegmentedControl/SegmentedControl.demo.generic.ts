import { defineComponent, h } from 'vue'
import { SegmentedControl } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SegmentedControl } from '@mantine-vue/core'
</script>

<template>
  <SegmentedControl
    :data="[
      { value: 16, label: '16' },
      { value: 17, label: '17' },
      { value: '18+', label: '18 or older' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlGenericDemo',
  setup: () => () =>
    h(SegmentedControl, {
      data: [
        { value: 16, label: '16' },
        { value: 17, label: '17' },
        { value: '18+', label: '18 or older' },
      ],
    }),
})

export const generic: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
