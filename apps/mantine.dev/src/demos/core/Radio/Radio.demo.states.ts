import { defineComponent, h } from 'vue'
import { Radio, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Radio :checked="false" label="Default radio" @change="() => {}" />
    <Radio :checked="true" label="Checked radio" @change="() => {}" />
    <Radio :checked="true" variant="outline" label="Outline checked radio" @change="() => {}" />
    <Radio disabled label="Disabled radio" />
    <Radio disabled :checked="true" label="Disabled checked radio" @change="() => {}" />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'RadioStatesDemo',
  setup: () => () =>
    h(Stack, null, {
      default: () => [
        h(Radio, { checked: false, label: 'Default radio', onChange: () => {} }),
        h(Radio, { checked: true, label: 'Checked radio', onChange: () => {} }),
        h(Radio, {
          checked: true,
          variant: 'outline',
          label: 'Outline checked radio',
          onChange: () => {},
        }),
        h(Radio, { disabled: true, label: 'Disabled radio' }),
        h(Radio, {
          disabled: true,
          checked: true,
          label: 'Disabled checked radio',
          onChange: () => {},
        }),
      ],
    }),
})

export const states: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
