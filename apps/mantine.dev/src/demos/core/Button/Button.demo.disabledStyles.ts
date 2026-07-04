import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Button disabled>Disabled</Button>
    <Button data-disabled>Looks disabled</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ButtonDisabledStylesDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(Button, { disabled: true }, { default: () => 'Disabled' }),
        h(
          Button,
          { 'data-disabled': true, onClick: (e: Event) => e.preventDefault() },
          { default: () => 'Looks disabled' },
        ),
      ],
    }),
})

export const disabledStyles: MantineDemo = { type: 'code', component: Demo, code, centered: true }
