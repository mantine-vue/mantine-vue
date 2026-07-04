import { defineComponent, h, ref } from 'vue'
import { Box, Button, Collapse, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Box, Button, Collapse, Group, Text } from '@mantine-vue/core'

const expanded = ref(false)
</script>

<template>
  <Box :maw="400" mx="auto">
    <Group justify="center" :mb="5">
      <Button @click="expanded = !expanded">Toggle content</Button>
    </Group>

    <Collapse :expanded="expanded">
      <Text>
        From Bulbapedia: Bulbasaur is a small, quadrupedal Pokémon that has blue-green skin with
        darker patches. It has red eyes with white pupils, pointed, ear-like structures on top of
        its head, and a short, blunt snout with a wide mouth. A pair of small, pointed teeth are
        visible in the upper jaw when its mouth is open. Each of its thick legs ends with three
        sharp claws. On Bulbasaur's back is a green plant bulb, which is grown from a seed planted
        there at birth. The bulb also conceals two slender, tentacle-like vines and provides it
        with energy through photosynthesis as well as from the nutrient-rich seeds contained within.
      </Text>
    </Collapse>
  </Box>
</template>
`

const lorem =
  "From Bulbapedia: Bulbasaur is a small, quadrupedal Pokémon that has blue-green skin with darker patches. It has red eyes with white pupils, pointed, ear-like structures on top of its head, and a short, blunt snout with a wide mouth. A pair of small, pointed teeth are visible in the upper jaw when its mouth is open. Each of its thick legs ends with three sharp claws. On Bulbasaur's back is a green plant bulb, which is grown from a seed planted there at birth. The bulb also conceals two slender, tentacle-like vines and provides it with energy through photosynthesis as well as from the nutrient-rich seeds contained within."

const Demo = defineComponent({
  name: 'CollapseUsageDemo',
  setup() {
    const expanded = ref(false)
    return () =>
      h(Box, { maw: 400, mx: 'auto' }, () => [
        h(Group, { justify: 'center', mb: 5 }, () =>
          h(
            Button,
            {
              onClick: () => {
                expanded.value = !expanded.value
              },
            },
            () => 'Toggle content',
          ),
        ),
        h(Collapse, { expanded: expanded.value }, () => h(Text, {}, () => lorem)),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
