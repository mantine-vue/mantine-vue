import { defineComponent, h } from 'vue'
import { Container } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Container } from '@mantine-vue/core'
</script>

<style>
/*
  Override --container-size via CSS variables on the theme or root element.
  Custom sizes map to rem values:
    xxs → 300px, xs → 400px, sm → 500px
    md → 600px, lg → 700px, xl → 800px, xxl → 900px
*/
:root {
  --container-size-xxs: 18.75rem;  /* 300px */
  --container-size-xxl: 56.25rem;  /* 900px */
}
</style>

<template>
  <!-- Use any of the built-in or custom sizes -->
  <Container size="xxs" bg="var(--mantine-color-blue-light)">
    Container with custom size (xxs = 300px)
  </Container>
</template>
`

const Demo = defineComponent({
  name: 'ContainerSizesDemo',
  setup: () => () =>
    h(
      Container,
      { size: 'xs', bg: 'var(--mantine-color-blue-light)' },
      {
        default: () => 'Container with custom size',
      },
    ),
})

export const sizes: MantineDemo = { type: 'code', component: Demo, code }
