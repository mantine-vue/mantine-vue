import { defineComponent, h } from 'vue'
import { Button, Group, HoverCard, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, HoverCard, Text } from '@mantine-vue/core'
</script>

<template>
  <Group justify="center">
    <HoverCard shadow="md" :open-delay="1000">
      <HoverCard.Target>
        <Button>1000ms open delay</Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">Opened with 1000ms delay</Text>
      </HoverCard.Dropdown>
    </HoverCard>

    <HoverCard shadow="md" :close-delay="1000">
      <HoverCard.Target>
        <Button>1000ms close delay</Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">Will close with 1000ms delay</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'HoverCardDelayDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              HoverCard,
              { shadow: 'md', openDelay: 1000 },
              {
                default: () => [
                  h(HoverCard.Target, null, {
                    default: () => h(Button, null, () => '1000ms open delay'),
                  }),
                  h(HoverCard.Dropdown, null, {
                    default: () => h(Text, { size: 'sm' }, () => 'Opened with 1000ms delay'),
                  }),
                ],
              },
            ),
            h(
              HoverCard,
              { shadow: 'md', closeDelay: 1000 },
              {
                default: () => [
                  h(HoverCard.Target, null, {
                    default: () => h(Button, null, () => '1000ms close delay'),
                  }),
                  h(HoverCard.Dropdown, null, {
                    default: () => h(Text, { size: 'sm' }, () => 'Will close with 1000ms delay'),
                  }),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const delay: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
