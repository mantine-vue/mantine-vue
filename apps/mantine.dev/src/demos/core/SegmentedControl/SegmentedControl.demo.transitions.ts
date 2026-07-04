import { defineComponent, h } from 'vue'
import { SegmentedControl, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SegmentedControl, Text } from '@mantine-vue/core'
</script>

<template>
  <Text size="sm" fw="500" :mt="3">No transitions</Text>
  <SegmentedControl :data="['React', 'Angular', 'Vue', 'Svelte']" :transition-duration="0" />

  <Text size="sm" fw="500" mt="md">500ms linear transition</Text>
  <SegmentedControl
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :transition-duration="500"
    transition-timing-function="linear"
  />
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlTransitionsDemo',
  setup: () => () =>
    h('div', null, [
      h(Text, { size: 'sm', fw: '500', mt: 3 }, () => 'No transitions'),
      h(SegmentedControl, {
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        transitionDuration: 0,
      }),
      h(Text, { size: 'sm', fw: '500', mt: 'md' }, () => '500ms linear transition'),
      h(SegmentedControl, {
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        transitionDuration: 500,
        transitionTimingFunction: 'linear',
      }),
    ]),
})

export const transitions: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
