import { defineComponent, h } from 'vue'
import { Pill } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Pill } from '@mantine-vue/core'
</script>

<template>
  <Pill{{props}}>React</Pill>
</template>
`

const Demo = defineComponent({
  name: 'PillUsageDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'div',
        {
          style: {
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        [h(Pill, { ...attrs }, () => 'React')],
      )
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    { type: 'size', prop: 'size', initialValue: 'md', libraryValue: 'md' },
    { type: 'boolean', prop: 'withRemoveButton', initialValue: false, libraryValue: false },
  ],
}
