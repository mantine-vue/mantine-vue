import { defineComponent, h } from 'vue'
import { Avatar, Group, Indicator } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Group, Indicator } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Indicator inline :label="0">
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png" />
    </Indicator>

    <Indicator inline :label="0" :showZero="false">
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png" />
    </Indicator>
  </Group>
</template>
`

const avatarUrl = (n: number) =>
  `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${n}.png`

const Demo = defineComponent({
  name: 'IndicatorShowZeroDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(
              Indicator,
              { inline: true, label: 0 },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(1) }),
              },
            ),
            h(
              Indicator,
              { inline: true, label: 0, showZero: false },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(2) }),
              },
            ),
          ],
        },
      )
  },
})

export const showZero: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
