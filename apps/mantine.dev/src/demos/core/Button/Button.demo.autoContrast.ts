import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Button color="lime.4">No auto contrast</Button>
    <Button color="lime.4" auto-contrast>Auto contrast</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ButtonAutoContrastDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(Button, { color: 'lime.4' }, { default: () => 'No auto contrast' }),
        h(Button, { color: 'lime.4', autoContrast: true }, { default: () => 'Auto contrast' }),
      ],
    }),
})

export const autoContrast: MantineDemo = { type: 'code', component: Demo, code, centered: true }
