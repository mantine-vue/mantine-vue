import { defineComponent, h } from 'vue'
import { Container } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Container } from '@mantine-vue/core'
</script>

<template>
  <Container bg="var(--mantine-color-blue-light)" :h="50">
    Default Container
  </Container>

  <Container size="xs" bg="var(--mantine-color-blue-light)" :h="50" mt="md">
    xs Container
  </Container>

  <Container :px="0" :size="480" bg="var(--mantine-color-blue-light)" :h="50" mt="md">
    480px Container without padding
  </Container>
</template>
`

const demoProps = {
  bg: 'var(--mantine-color-blue-light)',
  h: 50,
}

const Demo = defineComponent({
  name: 'ContainerUsageDemo',
  setup: () => () =>
    h('div', null, [
      h(Container, { ...demoProps }, { default: () => 'Default Container' }),
      h(Container, { ...demoProps, size: 'xs', mt: 'md' }, { default: () => 'xs Container' }),
      h(
        Container,
        { ...demoProps, px: 0, size: 480, mt: 'md' },
        { default: () => '480px Container without padding' },
      ),
    ]),
})

export const usage: MantineDemo = { type: 'code', component: Demo, code }
