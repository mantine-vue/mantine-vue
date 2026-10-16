import { defineComponent, h } from 'vue'
import { Radio, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const items = [
  { label: 'Light radio', defaultChecked: true },
  { label: 'Teal light radio', color: 'teal', defaultChecked: true },
  { label: 'Grape light radio', color: 'grape', defaultChecked: true },
  { label: 'Light radio with CSS color', color: '#e64980', defaultChecked: true },
]

export const lightVariant: MantineDemo = {
  type: 'code',
  centered: true,
  component: defineComponent({
    setup: () => () =>
      h(Stack, { gap: 7 }, () => items.map((props) => h(Radio, { variant: 'light', ...props }))),
  }),
  code: `<script setup lang="ts">
import { Radio, Stack } from '@mantine-vue/core'
</script>
<template>
  <Stack :gap="7">
    <Radio variant="light" defaultChecked label="Light radio" />
    <Radio variant="light" color="teal" defaultChecked label="Teal light radio" />
    <Radio variant="light" color="grape" defaultChecked label="Grape light radio" />
    <Radio variant="light" color="#e64980" defaultChecked label="Light radio with CSS color" />
  </Stack>
</template>`,
}
