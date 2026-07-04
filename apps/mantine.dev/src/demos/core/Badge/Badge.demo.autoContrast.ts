import { defineComponent, h } from 'vue'
import { Badge, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Badge size="lg" color="lime.4">Default</Badge>
    <Badge autoContrast size="lg" color="lime.4">Auto contrast</Badge>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'BadgeAutoContrastDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(Badge, { size: 'lg', color: 'lime.4' }, { default: () => 'Default' }),
            h(
              Badge,
              { autoContrast: true, size: 'lg', color: 'lime.4' },
              { default: () => 'Auto contrast' },
            ),
          ],
        },
      )
  },
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
