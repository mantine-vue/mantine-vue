import { defineComponent, h } from 'vue'
import { Avatar, Group, Indicator } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Group, Indicator } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Indicator inline label="99" color="lime.4">
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png" />
    </Indicator>

    <Indicator inline label="99" color="lime.4" autoContrast>
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png" />
    </Indicator>

    <Indicator inline label="99" color="cyan.9">
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png" />
    </Indicator>

    <Indicator inline label="99" color="cyan.9" autoContrast>
      <Avatar size="lg" radius="xl" src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png" />
    </Indicator>
  </Group>
</template>
`

const avatarUrl = (n: number) =>
  `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${n}.png`

const Demo = defineComponent({
  name: 'IndicatorAutoContrastDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(
              Indicator,
              { inline: true, label: '99', color: 'lime.4' },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(1) }),
              },
            ),
            h(
              Indicator,
              { inline: true, label: '99', color: 'lime.4', autoContrast: true },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(2) }),
              },
            ),
            h(
              Indicator,
              { inline: true, label: '99', color: 'cyan.9' },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(3) }),
              },
            ),
            h(
              Indicator,
              { inline: true, label: '99', color: 'cyan.9', autoContrast: true },
              {
                default: () => h(Avatar, { size: 'lg', radius: 'xl', src: avatarUrl(4) }),
              },
            ),
          ],
        },
      )
  },
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
