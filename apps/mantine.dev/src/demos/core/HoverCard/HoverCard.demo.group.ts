import { defineComponent, h } from 'vue'
import { Button, Group, HoverCard, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { Button, Group, HoverCard, Text } from '@mantine-vue/core'
</script>

<template>
  <HoverCard.Group :open-delay="500" :close-delay="100">
    <Group justify="center">
      <HoverCard shadow="md">
        <HoverCard.Target>
          <Button>First</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">First hover card content</Text>
        </HoverCard.Dropdown>
      </HoverCard>

      <HoverCard shadow="md">
        <HoverCard.Target>
          <Button>Second</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">Second hover card content</Text>
        </HoverCard.Dropdown>
      </HoverCard>

      <HoverCard shadow="md">
        <HoverCard.Target>
          <Button>Third</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">Third hover card content</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  </HoverCard.Group>
</template>
`

const Demo = defineComponent({
  name: 'HoverCardGroupDemo',
  setup() {
    return () =>
      h(
        HoverCard.Group,
        { openDelay: 500, closeDelay: 100 },
        {
          default: () => [
            h(
              Group,
              { justify: 'center' },
              {
                default: () => [
                  h(
                    HoverCard,
                    { shadow: 'md' },
                    {
                      default: () => [
                        h(HoverCard.Target, null, {
                          default: () => h(Button, null, () => 'First'),
                        }),
                        h(HoverCard.Dropdown, null, {
                          default: () => h(Text, { size: 'sm' }, () => 'First hover card content'),
                        }),
                      ],
                    },
                  ),
                  h(
                    HoverCard,
                    { shadow: 'md' },
                    {
                      default: () => [
                        h(HoverCard.Target, null, {
                          default: () => h(Button, null, () => 'Second'),
                        }),
                        h(HoverCard.Dropdown, null, {
                          default: () => h(Text, { size: 'sm' }, () => 'Second hover card content'),
                        }),
                      ],
                    },
                  ),
                  h(
                    HoverCard,
                    { shadow: 'md' },
                    {
                      default: () => [
                        h(HoverCard.Target, null, {
                          default: () => h(Button, null, () => 'Third'),
                        }),
                        h(HoverCard.Dropdown, null, {
                          default: () => h(Text, { size: 'sm' }, () => 'Third hover card content'),
                        }),
                      ],
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

export const group: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
