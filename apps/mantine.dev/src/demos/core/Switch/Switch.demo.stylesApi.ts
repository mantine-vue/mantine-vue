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
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'body', description: 'Contains label, description, error and input' },
      { selector: 'track', description: 'Switch track element' },
      { selector: 'trackLabel', description: 'Track label (on/off)' },
      { selector: 'thumb', description: 'Thumb element' },
      { selector: 'input', description: 'Input element (visually hidden)' },
      { selector: 'labelWrapper', description: 'Contains label, description and error' },
      { selector: 'label', description: 'Label element' },
      { selector: 'description', description: 'Description element' },
      { selector: 'error', description: 'Error element' },
    ],
  },
  component: Demo,
  centered: true,
  code,
}
