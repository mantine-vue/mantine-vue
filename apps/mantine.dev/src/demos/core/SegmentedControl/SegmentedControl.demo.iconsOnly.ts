import { defineComponent, h } from 'vue'
import { PhArrowSquareOut, PhCode, PhEye } from '@phosphor-icons/vue'
import { SegmentedControl, VisuallyHidden } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhEye, PhCode, PhArrowSquareOut } from '@phosphor-icons/vue'
import { SegmentedControl, VisuallyHidden } from '@mantine-vue/core'

const iconProps = { style: { display: 'block' }, size: 20 }
</script>

<template>
  <SegmentedControl
    :data="[
      {
        value: 'preview',
        label: h('span', null, [h(PhEye, iconProps), h(VisuallyHidden, null, () => 'Preview')]),
      },
      {
        value: 'code',
        label: h('span', null, [h(PhCode, iconProps), h(VisuallyHidden, null, () => 'Code')]),
      },
      {
        value: 'export',
        label: h('span', null, [h(PhArrowSquareOut, iconProps), h(VisuallyHidden, null, () => 'Export')]),
      },
    ]"
  />
</template>
`

const iconProps = { style: { display: 'block' }, size: 20 }

const Demo = defineComponent({
  name: 'SegmentedControlIconsOnlyDemo',
  setup: () => () =>
    h(SegmentedControl, {
      data: [
        {
          value: 'preview',
          label: h('span', null, [h(PhEye, iconProps), h(VisuallyHidden, null, () => 'Preview')]),
        },
        {
          value: 'code',
          label: h('span', null, [h(PhCode, iconProps), h(VisuallyHidden, null, () => 'Code')]),
        },
        {
          value: 'export',
          label: h('span', null, [
            h(PhArrowSquareOut, iconProps),
            h(VisuallyHidden, null, () => 'Export'),
          ]),
        },
      ],
    }),
})

export const iconsOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
