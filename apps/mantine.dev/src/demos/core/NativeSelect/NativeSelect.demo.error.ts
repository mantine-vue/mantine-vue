import { defineComponent, h } from 'vue'
import { NativeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NativeSelect } from '@mantine-vue/core'
</script>

<template>
  <NativeSelect error label="Boolean error" :data="['React', 'Angular']" />
  <NativeSelect
    error="Error message"
    label="React node error"
    :data="['React', 'Angular']"
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'NativeSelectErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(NativeSelect, {
        error: true,
        label: 'Boolean error',
        data: ['React', 'Angular'],
      }),
      h(NativeSelect, {
        error: 'Error message',
        label: 'String error',
        data: ['React', 'Angular'],
        mt: 'md',
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
