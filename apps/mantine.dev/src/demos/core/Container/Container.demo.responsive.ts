import { defineComponent, h } from 'vue'
import { Container } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = [
  {
    fileName: 'Demo.vue',
    language: 'vue',
    code: `
<script setup lang="ts">
import { Container } from '@mantine-vue/core'
</script>

<template>
  <Container class="responsive-container" bg="var(--mantine-color-blue-light)">
    Container with responsive size
  </Container>
</template>
`,
  },
  {
    fileName: 'Demo.module.css',
    language: 'scss',
    code: `
.responsive-container {
  max-width: 300px;

  @media (min-width: 400px) {
    max-width: 400px;
  }

  @media (min-width: 600px) {
    max-width: 600px;
  }
}
`,
  },
]

const Demo = defineComponent({
  name: 'ContainerResponsiveDemo',
  setup: () => () =>
    h(
      Container,
      { bg: 'var(--mantine-color-blue-light)' },
      {
        default: () => 'Container with responsive size',
      },
    ),
})

export const responsive: MantineDemo = { type: 'code', component: Demo, code }
