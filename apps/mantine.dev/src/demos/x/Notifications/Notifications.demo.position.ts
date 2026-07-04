import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const positions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'top-center',
  'bottom-center',
] as const

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'

const positions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'top-center',
  'bottom-center',
] as const
</script>

<template>
  <Group>
    <Button
      v-for="position in positions"
      :key="position"
      @click="
        notifications.show({
          title: \`Notification at \${position}\`,
          message: \`Notification at \${position} message\`,
          position,
        })
      "
    >
      {{ position }}
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'NotificationsPositionDemo',
  setup() {
    return () =>
      h(Group, null, () =>
        positions.map((position) =>
          h(
            Button,
            {
              key: position,
              onClick: () =>
                notifications.show({
                  title: `Notification at ${position}`,
                  message: `Notification at ${position} message`,
                  position,
                }),
            },
            () => position,
          ),
        ),
      )
  },
})

export const position: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
