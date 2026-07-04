import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <!-- Custom variants are registered via the theme and selected with data-variant. -->
  <Button variant="filled" color="grape">Custom variant</Button>
</template>
`

const Demo = defineComponent({
  name: 'ButtonCustomVariantDemo',
  setup: () => () =>
    h(Button, { variant: 'filled', color: 'grape' }, { default: () => 'Custom variant' }),
})

export const customVariant: MantineDemo = { type: 'code', component: Demo, code, centered: true }
