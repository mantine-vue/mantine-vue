import { defineComponent, h } from 'vue'
import { Checkbox, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const items = [
  { label: 'Light checkbox', defaultChecked: true },
  { label: 'Light indeterminate checkbox', indeterminate: true },
  { label: 'Teal light checkbox', color: 'teal', defaultChecked: true },
  { label: 'Grape light checkbox', color: 'grape', defaultChecked: true },
  { label: 'Light checkbox with CSS color', color: '#e64980', defaultChecked: true },
]

export const lightVariant: MantineDemo = {
  type: 'code',
  centered: true,
  component: defineComponent({
    setup: () => () =>
      h(Stack, { gap: 7 }, () => items.map((props) => h(Checkbox, { variant: 'light', ...props }))),
  }),
  code: `<script setup lang="ts">
import { Checkbox, Stack } from '@mantine-vue/core'
</script>
<template>
  <Stack :gap="7">
    <Checkbox variant="light" defaultChecked label="Light checkbox" />
    <Checkbox variant="light" indeterminate label="Light indeterminate checkbox" />
    <Checkbox variant="light" color="teal" defaultChecked label="Teal light checkbox" />
    <Checkbox variant="light" color="grape" defaultChecked label="Grape light checkbox" />
    <Checkbox variant="light" color="#e64980" defaultChecked label="Light checkbox with CSS color" />
  </Stack>
</template>`,
}
