import { defineComponent, h } from 'vue'
import { Divider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Divider my="sm" />
  <Divider my="sm" variant="dashed" />
  <Divider my="sm" variant="dotted" />
</template>
`

const Demo = defineComponent({
  name: 'DividerVariantsDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Divider, { my: 'sm' }),
        h(Divider, { my: 'sm', variant: 'dashed' }),
        h(Divider, { my: 'sm', variant: 'dotted' }),
      ])
  },
})

export const variants: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
