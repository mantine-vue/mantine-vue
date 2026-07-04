import { defineComponent, h, ref } from 'vue'
import { Button, Group, ScrollArea, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ScrollArea, Button, Stack, Group } from '@mantine-vue/core'

const viewport = ref<any>(null)

const scrollToBottom = () =>
  viewport.value?.$el?.scrollTo({ top: viewport.value.$el.scrollHeight, behavior: 'smooth' })

const scrollToCenter = () =>
  viewport.value?.$el?.scrollTo({ top: viewport.value.$el.scrollHeight / 2, behavior: 'smooth' })

const scrollToTop = () =>
  viewport.value?.$el?.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <Stack align="center">
    <ScrollArea :w="300" :h="200" :viewportProps="{ ref: viewport }">
      <!-- ... content -->
    </ScrollArea>

    <Group justify="center">
      <Button @click="scrollToBottom">Scroll to bottom</Button>
      <Button @click="scrollToCenter">Scroll to center</Button>
      <Button @click="scrollToTop">Scroll to top</Button>
    </Group>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'ScrollAreaScrollToDemo',
  setup() {
    const viewport = ref<any>(null)

    const scrollToBottom = () =>
      viewport.value?.$el?.scrollTo({ top: viewport.value.$el.scrollHeight, behavior: 'smooth' })

    const scrollToCenter = () =>
      viewport.value?.$el?.scrollTo({
        top: viewport.value.$el.scrollHeight / 2,
        behavior: 'smooth',
      })

    const scrollToTop = () => viewport.value?.$el?.scrollTo({ top: 0, behavior: 'smooth' })

    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h(
              ScrollArea,
              { w: 300, h: 200, viewportProps: { ref: viewport } },
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
                        'Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside from the chest to the tip of its tail. It has a long neck, small blue eyes, slightly raised nostrils, and two horn-like structures protruding from the back of its rectangular head. There are two fangs visible in the upper jaw when its mouth is closed. Two large wings with blue-green undersides sprout from its back.',
                    },
                  ),
                  h(
                    Text,
                    { size: 'sm', mt: 'md' },
                    {
                      default: () =>
                        'As Mega Charizard X, its body and legs are more physically fit, though its arms remain thin. Its skin turns black with a sky-blue underside and soles. Two spikes with blue tips curve upward from the front and back of each shoulder, while the tips of its horns sharpen, turn blue, and curve slightly upward.',
                    },
                  ),
                  h(
                    Text,
                    { size: 'sm', mt: 'md' },
                    {
                      default: () =>
                        'Charizard flies around the sky in search of powerful opponents. It breathes fire of such great heat that it melts anything. However, it never turns its fiery breath on any opponent weaker than itself.',
                    },
                  ),
                ],
              },
            ),
            h(
              Group,
              { justify: 'center' },
              {
                default: () => [
                  h(Button, { onClick: scrollToBottom }, { default: () => 'Scroll to bottom' }),
                  h(Button, { onClick: scrollToCenter }, { default: () => 'Scroll to center' }),
                  h(Button, { onClick: scrollToTop }, { default: () => 'Scroll to top' }),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const scrollTo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
