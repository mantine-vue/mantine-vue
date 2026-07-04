import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <Button component="a" href="https://mantine.dev" data-disabled @click.prevent>
    Disabled link
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'ButtonDisabledLinkDemo',
  setup: () => () =>
    h(
      Button,
      {
        component: 'a',
        href: 'https://mantine.dev',
        'data-disabled': true,
        onClick: (e: Event) => e.preventDefault(),
      },
      { default: () => 'Disabled link' },
    ),
})

export const disabledLink: MantineDemo = { type: 'code', component: Demo, code, centered: true }
