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
      { value: 'preview', label: 'Preview' },
      { value: 'code', label: 'Code' },
      { value: 'export', label: 'Export' },
    ]"
  >
    <template #label="{ item }">
      <Center style="gap: 10px">
        <PhEye v-if="item.value === 'preview'" :size="16" />
        <PhCode v-if="item.value === 'code'" :size="16" />
        <PhArrowSquareOut v-if="item.value === 'export'" :size="16" />
        <span>{{ item.label }}</span>
      </Center>
    </template>
  </SegmentedControl>

  //or

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

const icons = {
  preview: PhEye,
  code: PhCode,
  export: PhArrowSquareOut,
}

const Demo = defineComponent({
  name: 'SegmentedControlLabelsDemo',
  setup: () => () =>
    h(
      SegmentedControl,
      {
        data: [
          { value: 'preview', label: 'Preview' },
          { value: 'code', label: 'Code' },
          { value: 'export', label: 'Export' },
        ],
      },
      {
        label: ({ item }: any) =>
          h(Center, { style: { gap: '10px' } }, () => [
            h(icons[item.value as keyof typeof icons], { size: 16 }),
            h('span', null, item.label),
          ]),
      },
    ),
})

export const labels: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
