import { defineComponent, h } from 'vue'
import { Box, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text } from '@mantine-vue/core'
</script>

<template>
  <Text{{props}}>
    <!-- Text content -->
  </Text>
</template>
`

const lorem =
  "From Bulbapedia: Bulbasaur is a small, quadrupedal Pokémon that has blue-green skin with darker patches. It has red eyes with white pupils, pointed, ear-like structures on top of its head, and a short, blunt snout with a wide mouth. A pair of small, pointed teeth are visible in the upper jaw when its mouth is open. Each of its thick legs ends with three sharp claws. On Bulbasaur's back is a green plant bulb, which is grown from a seed planted there at birth. The bulb also conceals two slender, tentacle-like vines and provides it with energy through photosynthesis as well as from the nutrient-rich seeds contained within."

const Wrapper = defineComponent({
  name: 'TextLinesConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Box,
        { maw: 400, mx: 'auto' },
        {
          default: () => h(Text, { ...(attrs as any) }, { default: () => lorem }),
        },
      )
  },
})

export const linesConfigurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'size', type: 'size', libraryValue: 'md', initialValue: 'md' },
    {
      prop: 'lineClamp',
      type: 'number',
      initialValue: 4,
      libraryValue: null,
      min: 1,
      max: 10,
      step: 1,
    },
  ],
}
