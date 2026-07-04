import { defineComponent, h } from 'vue'
import { Anchor } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Anchor } from '@mantine-vue/core'
</script>

<template>
  <Anchor
    variant="gradient"
    :gradient="{ from: 'pink', to: 'yellow' }"
    :fw="500"
    fz="lg"
    href="#text-props"
  >
    A link with pink to yellow gradient
  </Anchor>
</template>
`

const Demo = defineComponent({
  name: 'AnchorTextPropsDemo',
  setup() {
    return () =>
      h(
        Anchor,
        {
          variant: 'gradient',
          gradient: { from: 'pink', to: 'yellow' },
          fw: 500,
          fz: 'lg',
          href: '#text-props',
        },
        { default: () => 'A link with pink to yellow gradient' },
      )
  },
})

export const textProps: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
