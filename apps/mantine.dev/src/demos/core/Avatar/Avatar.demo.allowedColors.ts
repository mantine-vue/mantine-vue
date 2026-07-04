import { defineComponent, h } from 'vue'
import { Avatar, Group } from '@mantine-vue/core'
import { names, namesCode } from './_mockdata'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Group } from '@mantine-vue/core'

${namesCode}
</script>

<template>
  <Group>
    <Avatar
      v-for="name in names"
      :key="name"
      :name="name"
      color="initials"
      :allowedInitialsColors="['blue', 'red']"
    />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'AvatarAllowedColorsDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () =>
            names.map((name) =>
              h(Avatar, {
                key: name,
                name,
                color: 'initials',
                allowedInitialsColors: ['blue', 'red'],
              }),
            ),
        },
      )
  },
})

export const allowedColors: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
