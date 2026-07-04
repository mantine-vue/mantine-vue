import { defineComponent, h } from 'vue'
import { SegmentedControl, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SegmentedControl, Stack, Text } from '@mantine-vue/core'
</script>

<template>
  <Stack align="center">
    <div>
      <Text size="sm" fw="500" :mb="3">Disabled control</Text>
      <SegmentedControl
        disabled
        :data="[
          { value: 'preview', label: 'Preview' },
          { value: 'code', label: 'Code' },
          { value: 'export', label: 'Export' },
        ]"
      />
    </div>

    <div>
      <Text size="sm" fw="500" :mb="3">Disabled option</Text>
      <SegmentedControl
        :data="[
          { value: 'preview', label: 'Preview', disabled: true },
          { value: 'code', label: 'Code' },
          { value: 'export', label: 'Export' },
        ]"
      />
    </div>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlDisabledDemo',
  setup: () => () =>
    h(Stack, { align: 'center' }, () => [
      h('div', null, [
        h(Text, { size: 'sm', fw: '500', mb: 3 }, () => 'Disabled control'),
        h(SegmentedControl, {
          disabled: true,
          data: [
            { value: 'preview', label: 'Preview' },
            { value: 'code', label: 'Code' },
            { value: 'export', label: 'Export' },
          ],
        }),
      ]),
      h('div', null, [
        h(Text, { size: 'sm', fw: '500', mb: 3 }, () => 'Disabled option'),
        h(SegmentedControl, {
          data: [
            { value: 'preview', label: 'Preview', disabled: true },
            { value: 'code', label: 'Code' },
            { value: 'export', label: 'Export' },
          ],
        }),
      ]),
    ]),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
}
