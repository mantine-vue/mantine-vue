import { defineComponent, h } from 'vue'
import { Divider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Divider size="xs" />
  <Divider size="sm" />
  <Divider size="md" />
  <Divider size="lg" />
  <Divider size="xl" />
  <Divider :size="10" />
</template>
`

const Demo = defineComponent({
  name: 'DividerSizesDemo',
  setup() {
    return () =>
      h('div', { style: 'display: flex; flex-direction: column; gap: 8px;' }, [
        h(Divider, { size: 'xs' }),
        h(Divider, { size: 'sm' }),
        h(Divider, { size: 'md' }),
        h(Divider, { size: 'lg' }),
        h(Divider, { size: 'xl' }),
        h(Divider, { size: 10 }),
      ])
  },
})

export const sizes: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
