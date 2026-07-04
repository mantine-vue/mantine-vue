import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <Button full-width>Full width button</Button>
</template>
`

const Demo = defineComponent({
  name: 'ButtonFullWidthDemo',
  setup: () => () => h(Button, { fullWidth: true }, { default: () => 'Full width button' }),
})

export const fullWidth: MantineDemo = { type: 'code', component: Demo, code }
