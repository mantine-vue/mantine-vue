import { defineComponent, h } from 'vue'
import { Box, ScrollArea, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ScrollArea, Box } from '@mantine-vue/core'
</script>

<template>
  <ScrollArea :w="300" :h="200">
    <Box :w="600">
      <!-- ... content -->
    </Box>
  </ScrollArea>
</template>
`

const Demo = defineComponent({
  name: 'ScrollAreaHorizontalDemo',
  setup() {
    return () =>
      h(
        ScrollArea,
        { w: 300, h: 200 },
        {
          default: () =>
            h(
              Box,
              { w: 600 },
              {
                default: () => [
                  h(Text, { size: 'xl', fw: 700 }, { default: () => 'Charizard (Pokémon)' }),
                  h(
                    Text,
                    { c: 'dimmed' },
                    { default: () => 'Charizard description from Bulbapedia' },
                  ),
                  h(
                    Text,
                    { size: 'sm', mt: 'md' },
                    {
                      default: () =>
                        'Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside from the chest to the tip of its tail. It has a long neck, small blue eyes, slightly raised nostrils, and two horn-like structures protruding from the back of its rectangular head.',
                    },
                  ),
                  h(
                    Text,
                    { size: 'sm', mt: 'md' },
                    {
                      default: () =>
                        'As Mega Charizard X, its body and legs are more physically fit, though its arms remain thin. Its skin turns black with a sky-blue underside and soles. Two spikes with blue tips curve upward from the front and back of each shoulder.',
                    },
                  ),
                ],
              },
            ),
        },
      )
  },
})

export const horizontal: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
