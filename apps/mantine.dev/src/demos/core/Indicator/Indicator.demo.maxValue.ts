import { defineComponent, h } from 'vue'
import { Avatar, Group, Indicator } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Group, Indicator } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Indicator inline :label="50" :maxValue="99">
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png" />
    </Indicator>

    <Indicator inline :label="100" :maxValue="99">
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png" />
    </Indicator>

    <Indicator inline :label="1000" :maxValue="999">
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png" />
    </Indicator>
  </Group>
</template>
`

const avatarUrl = (n: number) =>
  `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${n}.png`

const Demo = defineComponent({
  name: 'IndicatorMaxValueDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(
              Indicator,
              { inline: true, label: 50, maxValue: 99 },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(1) }),
              },
            ),
            h(
              Indicator,
              { inline: true, label: 100, maxValue: 99 },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(2) }),
              },
            ),
            h(
              Indicator,
              { inline: true, label: 1000, maxValue: 999 },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(3) }),
              },
            ),
          ],
        },
      )
  },
})

export const maxValue: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
