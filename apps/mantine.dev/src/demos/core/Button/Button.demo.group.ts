import { defineComponent, h } from 'vue'
import { Button, ButtonGroup } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ButtonGroup } from '@mantine-vue/core'
</script>

<template>
  <ButtonGroup>
    <Button variant="default">First</Button>
    <Button variant="default">Second</Button>
    <Button variant="default">Third</Button>
  </ButtonGroup>
</template>
`

const Demo = defineComponent({
  name: 'ButtonGroupDemo',
  setup: () => () =>
    h(ButtonGroup, null, {
      default: () => [
        h(Button, { variant: 'default' }, { default: () => 'First' }),
        h(Button, { variant: 'default' }, { default: () => 'Second' }),
        h(Button, { variant: 'default' }, { default: () => 'Third' }),
      ],
    }),
})

export const group: MantineDemo = { type: 'code', component: Demo, code, centered: true }
