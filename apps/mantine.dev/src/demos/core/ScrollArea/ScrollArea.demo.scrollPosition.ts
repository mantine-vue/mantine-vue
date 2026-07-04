import { defineComponent, h, ref } from 'vue'
import { Box, Code, ScrollArea, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ScrollArea, Box, Text, Code } from '@mantine-vue/core'

const scrollPosition = ref({ x: 0, y: 0 })
</script>

<template>
  <ScrollArea
    :w="300"
    :h="200"
    :onScrollPositionChange="(pos) => scrollPosition = pos"
  >
    <Box :w="600">
      <!-- ... content -->
    </Box>
  </ScrollArea>

  <Text>
    Scroll position:
    <Code>{{ \`{ x: \${scrollPosition.x}, y: \${scrollPosition.y} }\` }}</Code>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'ScrollAreaScrollPositionDemo',
  setup() {
    const scrollPosition = ref({ x: 0, y: 0 })

    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h(
              ScrollArea,
              {
                w: 300,
                h: 200,
                onScrollPositionChange: (pos: { x: number; y: number }) => {
                  scrollPosition.value = pos
                },
              },
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
                              'Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside from the chest to the tip of its tail. It has a long neck, small blue eyes, slightly raised nostrils, and two horn-like structures protruding from the back of its rectangular head. There are two fangs visible in the upper jaw when its mouth is closed.',
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
            ),
            h(
              Text,
              {},
              {
                default: () => [
                  'Scroll position: ',
                  h(
                    Code,
                    {},
                    {
                      default: () =>
                        `{ x: ${scrollPosition.value.x}, y: ${scrollPosition.value.y} }`,
                    },
                  ),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const scrollPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
