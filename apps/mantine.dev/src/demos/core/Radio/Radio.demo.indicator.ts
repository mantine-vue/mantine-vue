import { defineComponent, h } from 'vue'
import { Group, Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Radio.Indicator />
    <Radio.Indicator :checked="true" />
    <Radio.Indicator disabled />
    <Radio.Indicator disabled :checked="true" />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'RadioIndicatorDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(Radio.Indicator, {}),
        h(Radio.Indicator, { checked: true }),
        h(Radio.Indicator, { disabled: true }),
        h(Radio.Indicator, { disabled: true, checked: true }),
      ],
    }),
})

export const indicator: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
