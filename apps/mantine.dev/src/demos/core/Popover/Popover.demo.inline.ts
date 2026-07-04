import { defineComponent, h } from 'vue'
import { Mark, Popover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Mark, Text } from '@mantine-vue/core'
</script>

<template>
  <Text>
    Stantler's magnificent antlers were traded at high prices as works of art. As a result, this
    Pokémon was hunted close to extinction by those who were after the priceless antlers.
    <Popover :middlewares="{ flip: true, shift: true, inline: true }" position="top">
      <Popover.Target>
        <Mark>When visiting a junkyard</Mark>
      </Popover.Target>
      <Popover.Dropdown>Inline dropdown</Popover.Dropdown>
    </Popover>
    , you may catch sight of it having an intense fight with Murkrow over shiny objects. Ho-Oh's
    feathers glow in seven colors depending on the angle at which they are struck by light. These
    feathers are said to bring happiness to the bearers. This Pokémon is said to live at the foot
    of a rainbow.
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'PopoverInlineDemo',
  setup() {
    return () =>
      h(Text, null, {
        default: () => [
          "Stantler's magnificent antlers were traded at high prices as works of art. As a result, this Pokémon was hunted close to extinction by those who were after the priceless antlers. ",
          h(
            Popover,
            { middlewares: { flip: true, shift: true, inline: true }, position: 'top' },
            {
              default: () => [
                h(Popover.Target, null, {
                  default: () => h(Mark, null, () => 'When visiting a junkyard'),
                }),
                h(Popover.Dropdown, null, () => 'Inline dropdown'),
              ],
            },
          ),
          ", you may catch sight of it having an intense fight with Murkrow over shiny objects. Ho-Oh's feathers glow in seven colors depending on the angle at which they are struck by light. These feathers are said to bring happiness to the bearers. This Pokémon is said to live at the foot of a rainbow.",
        ],
      })
  },
})

export const inline: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
