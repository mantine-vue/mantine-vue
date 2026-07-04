import { defineComponent, h } from 'vue'
import { Checkbox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox } from '@mantine-vue/core'
</script>

<template>
  <Checkbox
    defaultChecked
    color="lime.4"
    iconColor="dark.8"
    size="md"
    label="Bright lime checkbox"
  />
</template>
`

const Demo = defineComponent({
  name: 'CheckboxIconColorDemo',
  setup: () => () =>
    h(Checkbox, {
      defaultChecked: true,
      color: 'lime.4',
      iconColor: 'dark.8',
      size: 'md',
      label: 'Bright lime checkbox',
    }),
})

export const iconColor: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
