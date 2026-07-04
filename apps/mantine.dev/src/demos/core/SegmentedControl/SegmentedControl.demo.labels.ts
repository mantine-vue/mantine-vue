import { defineComponent, h } from 'vue'
import { PhArrowSquareOut, PhCode, PhEye } from '@phosphor-icons/vue'
import { Center, SegmentedControl } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhEye, PhCode, PhArrowSquareOut } from '@phosphor-icons/vue'
import { Center, SegmentedControl } from '@mantine-vue/core'
</script>

<template>
  <SegmentedControl
    :data="[
      {
        value: 'preview',
        label: h(Center, { style: { gap: '10px' } }, () => [h(PhEye, { size: 16 }), h('span', null, 'Preview')]),
      },
      {
        value: 'code',
        label: h(Center, { style: { gap: '10px' } }, () => [h(PhCode, { size: 16 }), h('span', null, 'Code')]),
      },
      {
        value: 'export',
        label: h(Center, { style: { gap: '10px' } }, () => [h(PhArrowSquareOut, { size: 16 }), h('span', null, 'Export')]),
      },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlLabelsDemo',
  setup: () => () =>
    h(SegmentedControl, {
      data: [
        {
          value: 'preview',
          label: h(Center, { style: { gap: '10px' } }, () => [
            h(PhEye, { size: 16 }),
            h('span', null, 'Preview'),
          ]),
        },
        {
          value: 'code',
          label: h(Center, { style: { gap: '10px' } }, () => [
            h(PhCode, { size: 16 }),
            h('span', null, 'Code'),
          ]),
        },
        {
          value: 'export',
          label: h(Center, { style: { gap: '10px' } }, () => [
            h(PhArrowSquareOut, { size: 16 }),
            h('span', null, 'Export'),
          ]),
        },
      ],
    }),
})

export const labels: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
