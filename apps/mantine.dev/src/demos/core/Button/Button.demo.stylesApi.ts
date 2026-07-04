import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <Button
    :styles="{
      root: { fontStyle: 'italic' },
      label: { letterSpacing: '2px' },
    }"
  >
    Styled button
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'ButtonStylesApiDemo',
  setup: () => () =>
    h(
      Button,
      { styles: { root: { fontStyle: 'italic' }, label: { letterSpacing: '2px' } } },
      { default: () => 'Styled button' },
    ),
})

export const stylesApi: MantineDemo = { type: 'code', component: Demo, code, centered: true }
