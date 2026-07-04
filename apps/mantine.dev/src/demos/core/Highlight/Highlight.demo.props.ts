import { defineComponent, h } from 'vue'
import { Highlight } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Highlight } from '@mantine-vue/core'
</script>

<template>
  <Highlight
    component="a"
    href="https://mantine.dev"
    target="_blank"
    highlight="mantine"
    :fw="500"
    c="var(--mantine-color-anchor)"
  >
    Mantine website
  </Highlight>
</template>
`

const Demo = defineComponent({
  name: 'HighlightPropsDemo',
  setup() {
    return () =>
      h(
        Highlight,
        {
          component: 'a',
          href: 'https://mantine.dev',
          target: '_blank',
          highlight: 'mantine',
          fw: 500,
          c: 'var(--mantine-color-anchor)',
        },
        { default: () => 'Mantine website' },
      )
  },
})

export const props: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
