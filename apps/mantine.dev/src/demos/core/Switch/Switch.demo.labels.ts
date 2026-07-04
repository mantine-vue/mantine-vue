import { defineComponent, h } from 'vue'
import { Group, Switch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Switch, Group } from '@mantine-vue/core'
</script>

<template>
  <Group justify="center">
    <Switch size="xs" on-label="ON" off-label="OFF" />
    <Switch size="sm" on-label="ON" off-label="OFF" />
    <Switch size="md" on-label="ON" off-label="OFF" />
    <Switch size="lg" on-label="ON" off-label="OFF" />
    <Switch size="xl" on-label="ON" off-label="OFF" />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'SwitchLabelsDemo',
  setup: () => () =>
    h(Group, { justify: 'center' }, () => [
      h(Switch, { size: 'xs', onLabel: 'ON', offLabel: 'OFF' }),
      h(Switch, { size: 'sm', onLabel: 'ON', offLabel: 'OFF' }),
      h(Switch, { size: 'md', onLabel: 'ON', offLabel: 'OFF' }),
      h(Switch, { size: 'lg', onLabel: 'ON', offLabel: 'OFF' }),
      h(Switch, { size: 'xl', onLabel: 'ON', offLabel: 'OFF' }),
    ]),
})

export const labels: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
