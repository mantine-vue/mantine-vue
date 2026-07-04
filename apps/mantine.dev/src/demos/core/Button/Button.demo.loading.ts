import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Button loading>Filled</Button>
    <Button loading variant="light">Light</Button>
    <Button loading variant="outline">Outline</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ButtonLoadingDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(Button, { loading: true }, { default: () => 'Filled Button' }),
        h(Button, { loading: true, variant: 'light' }, { default: () => 'Light Button' }),
        h(Button, { loading: true, variant: 'outline' }, { default: () => 'Outline Button' }),
      ],
    }),
})

export const loading: MantineDemo = { type: 'code', component: Demo, code, centered: true }
