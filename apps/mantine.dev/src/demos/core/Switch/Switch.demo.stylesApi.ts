import { defineComponent, h } from 'vue'
import { Switch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Switch } from '@mantine-vue/core'
</script>

<template>
  <Switch{{props}} label="Switch component" description="Switch description" error="Switch error" />
</template>
`

const Demo = defineComponent({
  name: 'SwitchStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Switch, {
        label: 'Switch component',
        description: 'Switch description',
        error: 'Switch error',
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      body: 'Contains label, description, error and input',
      track: 'Switch track element',
      trackLabel: 'Track label (on/off)',
      thumb: 'Thumb element',
      input: 'Input element (visually hidden)',
      labelWrapper: 'Contains label, description and error',
      label: 'Label element',
      description: 'Description element',
      error: 'Error element',
    },
  },
  component: Demo,
  centered: true,
  code,
}
