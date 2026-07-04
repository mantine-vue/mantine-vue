import { defineComponent, h } from 'vue'
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import { Badge, Group, Scroller } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import { Badge, Group, Scroller } from '@mantine-vue/core'
</script>

<template>
  <Scroller :startControlIcon="() => h(PhArrowLeft, { size: 16 })" :endControlIcon="() => h(PhArrowRight, { size: 16 })">
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
  name: 'ScrollerCustomIconsDemo',
  setup() {
    return () =>
      h(
        Scroller,
        {
          startControlIcon: () => h(PhArrowLeft, { size: 16 }),
          endControlIcon: () => h(PhArrowRight, { size: 16 }),
        },
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

export const customIcons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
