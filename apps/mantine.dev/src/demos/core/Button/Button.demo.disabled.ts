import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <Button disabled>Disabled button</Button>
</template>
`

const Demo = defineComponent({
  name: 'ButtonDisabledDemo',
  setup: () => () => h(Button, { disabled: true }, { default: () => 'Disabled button' }),
})

export const disabled: MantineDemo = { type: 'code', component: Demo, code, centered: true }
