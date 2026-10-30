import { defineComponent, h } from 'vue'
import { ScrollArea, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ScrollArea } from '@mantine-vue/core'
</script>

<template>
  <ScrollArea
    :w="300"
    :h="200"
    type="always"
    :scrollbar-size="6"
    offset-scrollbars="y"
    :style="{ '--scrollarea-offset-size': '20px' }"
  >
    <!-- ... content -->
  </ScrollArea>
</template>
`

const Demo = defineComponent({
  name: 'ScrollAreaOffsetSizeDemo',
  setup: () => () =>
    h(
      ScrollArea,
      {
        w: 300,
        h: 200,
        type: 'always',
        scrollbarSize: 6,
        offsetScrollbars: 'y',
        style: { '--scrollarea-offset-size': '20px' },
      },
      {
        default: () =>
          Array.from({ length: 12 }, (_, index) =>
            h(
              Text,
              { key: index, mb: 'sm' },
              {
                default: () =>
                  'Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside from the chest to the tip of its tail.',
              },
            ),
          ),
      },
    ),
})

export const offsetSize: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
