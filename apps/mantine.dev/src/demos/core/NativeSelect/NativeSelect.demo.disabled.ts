import { defineComponent, h } from 'vue'
import { NativeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NativeSelect } from '@mantine-vue/core'
</script>

<template>
  <NativeSelect disabled :data="['React', 'Angular']" label="Disabled NativeSelect" />
</template>
`

const Demo = defineComponent({
  name: 'NativeSelectDisabledDemo',
  setup: () => () =>
    h(NativeSelect, {
      disabled: true,
      data: ['React', 'Angular'],
      label: 'Disabled NativeSelect',
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
