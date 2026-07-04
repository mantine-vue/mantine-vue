import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Button size="compact-xs">Compact xs</Button>
    <Button size="compact-sm">Compact sm</Button>
    <Button size="compact-md">Compact md</Button>
    <Button size="compact-lg">Compact lg</Button>
    <Button size="compact-xl">Compact xl</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ButtonCompactDemo',
  setup: () => () =>
    h(Group, null, {
      default: () =>
        ['xs', 'sm', 'md', 'lg', 'xl'].map((s) =>
          h(Button, { size: `compact-${s}`, key: s }, { default: () => `Compact ${s}` }),
        ),
    }),
})

export const compact: MantineDemo = { type: 'code', component: Demo, code, centered: true }
