import { defineComponent, h } from 'vue'
import { Avatar, Indicator } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Indicator } from '@mantine-vue/core'
</script>

<template>
  <Indicator inline :size="16" :offset="7" position="bottom-end" color="red" withBorder>
    <Avatar
      size="lg"
      radius="xl"
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png"
    />
  </Indicator>
</template>
`

const Demo = defineComponent({
  name: 'IndicatorOffsetDemo',
  setup() {
    return () =>
      h(
        Indicator,
        {
          inline: true,
          size: 16,
          offset: 7,
          position: 'bottom-end',
          color: 'red',
          withBorder: true,
        },
        {
          default: () =>
            h(Avatar, {
              size: 'lg',
              radius: 'xl',
              src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
            }),
        },
      )
  },
})

export const offset: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
