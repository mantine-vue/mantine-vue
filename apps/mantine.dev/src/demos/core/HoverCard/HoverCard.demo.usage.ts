import { defineComponent, h } from 'vue'
import { Button, Group, HoverCard, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, HoverCard, Text } from '@mantine-vue/core'
</script>

<template>
  <Group justify="center">
    <HoverCard :width="280" shadow="md">
      <HoverCard.Target>
        <Button>Hover to reveal the card</Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          Hover card is revealed when user hovers over target element, it will be hidden once
          mouse is not over both target and dropdown elements
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'HoverCardUsageDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              HoverCard,
              { width: 280, shadow: 'md' },
              {
                default: () => [
                  h(HoverCard.Target, null, {
                    default: () => h(Button, null, () => 'Hover to reveal the card'),
                  }),
                  h(HoverCard.Dropdown, null, {
                    default: () =>
                      h(
                        Text,
                        { size: 'sm' },
                        () =>
                          'Hover card is revealed when user hovers over target element, it will be hidden once mouse is not over both target and dropdown elements',
                      ),
                  }),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
