import { defineComponent, h } from 'vue'
import { Badge, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Badge size="xs" circle>1</Badge>
    <Badge size="sm" circle>7</Badge>
    <Badge size="md" circle>9</Badge>
    <Badge size="lg" circle>3</Badge>
    <Badge size="xl" circle>8</Badge>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'BadgeRoundedDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(Badge, { size: 'xs', circle: true }, { default: () => '1' }),
            h(Badge, { size: 'sm', circle: true }, { default: () => '7' }),
            h(Badge, { size: 'md', circle: true }, { default: () => '9' }),
            h(Badge, { size: 'lg', circle: true }, { default: () => '3' }),
            h(Badge, { size: 'xl', circle: true }, { default: () => '8' }),
          ],
        },
      )
  },
})

export const rounded: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
