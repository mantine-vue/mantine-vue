import { defineComponent, h } from 'vue'
import { Container } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Container } from '@mantine-vue/core'
</script>

<template>
  <Container fluid :h="50" bg="var(--mantine-color-blue-light)">
    Fluid container has 100% max-width
  </Container>
</template>
`

const Demo = defineComponent({
  name: 'ContainerFluidDemo',
  setup: () => () =>
    h(
      Container,
      { fluid: true, h: 50, bg: 'var(--mantine-color-blue-light)' },
      {
        default: () => 'Fluid container has 100% max-width',
      },
    ),
})

export const fluid: MantineDemo = { type: 'code', component: Demo, code }
