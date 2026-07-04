import { defineComponent, h } from 'vue'
import { Kbd } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Kbd } from '@mantine-vue/core'
</script>

<template>
  <div dir="ltr">
    <Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>M</Kbd>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'KbdUsageDemo',
  setup() {
    return () =>
      h('div', { dir: 'ltr' }, [
        h(Kbd, {}, { default: () => '⌘' }),
        ' + ',
        h(Kbd, {}, { default: () => 'Shift' }),
        ' + ',
        h(Kbd, {}, { default: () => 'M' }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
