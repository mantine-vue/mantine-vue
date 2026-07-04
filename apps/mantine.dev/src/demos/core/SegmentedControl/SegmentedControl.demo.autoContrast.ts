import { defineComponent, h } from 'vue'
import { SegmentedControl, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SegmentedControl, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <SegmentedControl color="lime.4" :data="['React', 'Angular', 'Vue', 'Svelte']" />
    <SegmentedControl color="lime.4" auto-contrast :data="['React', 'Angular', 'Vue', 'Svelte']" />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlAutoContrastDemo',
  setup: () => () =>
    h(Stack, null, () => [
      h(SegmentedControl, { color: 'lime.4', data: ['React', 'Angular', 'Vue', 'Svelte'] }),
      h(SegmentedControl, {
        color: 'lime.4',
        autoContrast: true,
        data: ['React', 'Angular', 'Vue', 'Svelte'],
      }),
    ]),
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
