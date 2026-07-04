import { defineComponent, h } from 'vue'
import { Avatar, Group } from '@mantine-vue/core'
import { PhStar } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Group } from '@mantine-vue/core'
import { PhStar } from '@phosphor-icons/vue'
</script>

<template>
  <Group justify="center">
    <!-- Default placeholder -->
    <Avatar :src="null" alt="no image here" />

    <!-- Default placeholder with custom color -->
    <Avatar :src="null" alt="no image here" color="indigo" />

    <!-- Placeholder with initials -->
    <Avatar :src="null" alt="Vitaly Rtishchev" color="red">VR</Avatar>

    <!-- Placeholder with custom icon -->
    <Avatar color="blue" radius="xl">
      <PhStar :size="20" />
    </Avatar>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'AvatarPlaceholdersDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(Avatar, { src: null, alt: 'no image here' }),
            h(Avatar, { src: null, alt: 'no image here', color: 'indigo' }),
            h(
              Avatar,
              { src: null, alt: 'Vitaly Rtishchev', color: 'red' },
              { default: () => 'VR' },
            ),
            h(Avatar, { color: 'blue', radius: 'xl' }, { default: () => h(PhStar, { size: 20 }) }),
          ],
        },
      )
  },
})

export const placeholders: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
