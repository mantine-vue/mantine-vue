import { defineComponent, h } from 'vue'
import { Stack, Switch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Switch, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Switch value="value" label="Default switch" />
    <Switch :checked="true" value="value" label="Checked switch" />
    <Switch disabled value="value" label="Disabled switch" />
    <Switch :checked="true" disabled value="value" label="Disabled checked switch" />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'SwitchStatesDemo',
  setup: () => () =>
    h(Stack, null, () => [
      h(Switch, { value: 'value', label: 'Default switch' }),
      h(Switch, { checked: true, value: 'value', label: 'Checked switch' }),
      h(Switch, { disabled: true, value: 'value', label: 'Disabled switch' }),
      h(Switch, {
        checked: true,
        disabled: true,
        value: 'value',
        label: 'Disabled checked switch',
      }),
    ]),
})

export const states: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
