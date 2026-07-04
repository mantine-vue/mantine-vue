import { defineComponent, h } from 'vue'
import { ColorSwatch, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorSwatch, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <ColorSwatch color="#009790" />
    <ColorSwatch color="rgba(234, 22, 174, 0.5)" />
    <ColorSwatch color="var(--mantine-color-orange-5)" />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ColorSwatchUsageDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(ColorSwatch, { color: '#009790' }),
            h(ColorSwatch, { color: 'rgba(234, 22, 174, 0.5)' }),
            h(ColorSwatch, { color: 'var(--mantine-color-orange-5)' }),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
