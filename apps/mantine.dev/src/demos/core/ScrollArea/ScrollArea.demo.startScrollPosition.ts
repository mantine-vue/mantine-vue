import { defineComponent, h } from 'vue'
import { ScrollArea, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ScrollArea } from '@mantine-vue/core'
</script>

<template>
  <ScrollArea :h="200" :startScrollPosition="{ y: 250 }">
    <!-- ... content -->
  </ScrollArea>
</template>
`

const Demo = defineComponent({
  name: 'ScrollAreaStartScrollPositionDemo',
  setup() {
    return () =>
      h(
        ScrollArea,
        { h: 200, startScrollPosition: { y: 250 } },
        {
          default: () => [
            h(Text, { size: 'xl', fw: 700 }, { default: () => 'Charizard (Pokémon)' }),
            h(Text, { c: 'dimmed' }, { default: () => 'Charizard description from Bulbapedia' }),
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
                  'As Mega Charizard X, its body and legs are more physically fit, though its arms remain thin. Its skin turns black with a sky-blue underside and soles. Two spikes with blue tips curve upward from the front and back of each shoulder.',
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
      )
  },
})

export const startScrollPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 300,
}
