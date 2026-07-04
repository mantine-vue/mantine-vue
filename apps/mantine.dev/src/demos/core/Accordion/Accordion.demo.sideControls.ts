import { defineComponent, h } from 'vue'
import { Accordion, ActionIcon, Center } from '@mantine-vue/core'
import { PhDotsThree } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Accordion, ActionIcon, Center } from '@mantine-vue/core'
import { PhDotsThree } from '@phosphor-icons/vue'
</script>

<template>
  <Accordion chevronPosition="left" :order="3">
    <Accordion.Item v-for="n in 3" :key="n" :value="\`item-\${n}\`">
      <Center>
        <Accordion.Control>Control {{ n }}</Accordion.Control>
        <ActionIcon size="lg" variant="subtle" color="gray" aria-label="More options">
          <PhDotsThree :size="20" />
        </ActionIcon>
      </Center>
      <Accordion.Panel>Panel {{ n }}</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
</template>
`

function makeItem(value: string, label: string, panel: string) {
  return h(
    Accordion.Item,
    { value },
    {
      default: () => [
        h(
          Center,
          {},
          {
            default: () => [
              h(Accordion.Control, {}, { default: () => label }),
              h(
                ActionIcon,
                { size: 'lg', variant: 'subtle', color: 'gray', 'aria-label': 'More options' },
                {
                  default: () => h(PhDotsThree, { size: 20 }),
                },
              ),
            ],
          },
        ),
        h(Accordion.Panel, {}, { default: () => panel }),
      ],
    },
  )
}

const Demo = defineComponent({
  name: 'AccordionSideControlsDemo',
  setup() {
    return () =>
      h(
        Accordion,
        { chevronPosition: 'left', order: 3 },
        {
          default: () => [
            makeItem('item-1', 'Control 1', 'Panel 1'),
            makeItem('item-2', 'Control 2', 'Panel 2'),
            makeItem('item-3', 'Control 3', 'Panel 3'),
          ],
        },
      )
  },
})

export const sideControls: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
