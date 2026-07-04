import { defineComponent, h } from 'vue'
import { Checkbox, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Checkbox.Indicator />
    <Checkbox.Indicator checked />
    <Checkbox.Indicator indeterminate />
    <Checkbox.Indicator disabled />
    <Checkbox.Indicator disabled checked />
    <Checkbox.Indicator disabled indeterminate />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxIndicatorDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(Checkbox.Indicator, {}),
        h(Checkbox.Indicator, { checked: true }),
        h(Checkbox.Indicator, { indeterminate: true }),
        h(Checkbox.Indicator, { disabled: true }),
        h(Checkbox.Indicator, { disabled: true, checked: true }),
        h(Checkbox.Indicator, { disabled: true, indeterminate: true }),
      ],
    }),
})

export const indicator: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
