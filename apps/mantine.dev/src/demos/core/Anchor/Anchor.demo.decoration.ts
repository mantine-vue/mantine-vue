import { defineComponent, h } from 'vue'
import { Anchor, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Anchor, Group } from '@mantine-vue/core'
</script>

<template>
  <Group justify="center">
    <Anchor href="https://mantine-vue/" target="_blank" underline="always">
      Underline always
    </Anchor>
    <Anchor href="https://mantine-vue/" target="_blank" underline="hover">
      Underline hover
    </Anchor>
    <Anchor href="https://mantine-vue/" target="_blank" underline="never">
      Underline never
    </Anchor>
    <Anchor href="https://mantine-vue/" target="_blank" underline="not-hover">
      Underline not-hover
    </Anchor>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'AnchorDecorationDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              Anchor,
              { href: 'https://mantine-vue/', target: '_blank', underline: 'always' },
              { default: () => 'Underline always' },
            ),
            h(
              Anchor,
              { href: 'https://mantine-vue/', target: '_blank', underline: 'hover' },
              { default: () => 'Underline hover' },
            ),
            h(
              Anchor,
              { href: 'https://mantine-vue/', target: '_blank', underline: 'never' },
              { default: () => 'Underline never' },
            ),
            h(
              Anchor,
              { href: 'https://mantine-vue/', target: '_blank', underline: 'not-hover' },
              { default: () => 'Underline not-hover' },
            ),
          ],
        },
      )
  },
})

export const decoration: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
