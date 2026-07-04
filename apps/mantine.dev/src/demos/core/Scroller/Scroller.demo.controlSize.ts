import { defineComponent, h } from 'vue'
import { Badge, Group, Scroller } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Group, Scroller } from '@mantine-vue/core'
</script>

<template>
  <Scroller controlSize="xl">
    <Group gap="xs" wrap="nowrap">
      <Badge
        v-for="index in 20"
        :key="index"
        variant="light"
        size="lg"
        miw="fit-content"
      >
        Badge {{ index }}
      </Badge>
    </Group>
  </Scroller>
</template>
`

const Demo = defineComponent({
  name: 'ScrollerControlSizeDemo',
  setup() {
    return () =>
      h(
        Scroller,
        { controlSize: 'xl' },
        {
          default: () =>
            h(
              Group,
              { gap: 'xs', wrap: 'nowrap' },
              {
                default: () =>
                  Array.from({ length: 20 }, (_, i) =>
                    h(
                      Badge,
                      { key: i, variant: 'light', size: 'lg', miw: 'fit-content' },
                      { default: () => `Badge ${i + 1}` },
                    ),
                  ),
              },
            ),
        },
      )
  },
})

export const controlSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
