import { defineComponent, h } from 'vue'
import { Avatar, Tooltip } from '@mantine-vue/core'
import { avatars } from './_mockdata'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Tooltip } from '@mantine-vue/core'
</script>

<template>
  <Tooltip.Group :openDelay="300" :closeDelay="100">
    <Avatar.Group spacing="sm">
      <Tooltip label="Salazar Troop" withArrow>
        <Avatar src="image.png" radius="xl" />
      </Tooltip>
      <Tooltip label="Bandit Crimes" withArrow>
        <Avatar src="image.png" radius="xl" />
      </Tooltip>
      <Tooltip label="Jane Rata" withArrow>
        <Avatar src="image.png" radius="xl" />
      </Tooltip>
      <Tooltip withArrow label="John Outcast, Levi Capitan">
        <Avatar radius="xl">+2</Avatar>
      </Tooltip>
    </Avatar.Group>
  </Tooltip.Group>
</template>
`

const Demo = defineComponent({
  name: 'AvatarGroupTooltipDemo',
  setup() {
    return () =>
      h(
        Tooltip.Group,
        { openDelay: 300, closeDelay: 100 },
        {
          default: () =>
            h(
              Avatar.Group,
              { spacing: 'sm' },
              {
                default: () => [
                  h(
                    Tooltip,
                    { label: 'Salazar Troop', withArrow: true },
                    {
                      default: () => h(Avatar, { src: avatars[0], radius: 'xl' }),
                    },
                  ),
                  h(
                    Tooltip,
                    { label: 'Bandit Crimes', withArrow: true },
                    {
                      default: () => h(Avatar, { src: avatars[1], radius: 'xl' }),
                    },
                  ),
                  h(
                    Tooltip,
                    { label: 'Jane Rata', withArrow: true },
                    {
                      default: () => h(Avatar, { src: avatars[2], radius: 'xl' }),
                    },
                  ),
                  h(
                    Tooltip,
                    { label: 'John Outcast, Levi Capitan', withArrow: true },
                    {
                      default: () => h(Avatar, { radius: 'xl' }, { default: () => '+2' }),
                    },
                  ),
                ],
              },
            ),
        },
      )
  },
})

export const groupTooltip: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
