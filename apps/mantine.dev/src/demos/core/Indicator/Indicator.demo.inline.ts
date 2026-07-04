import { defineComponent, h } from 'vue'
import { Avatar, Indicator } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Indicator } from '@mantine-vue/core'
</script>

<template>
  <Indicator inline label="New" :size="16">
    <Avatar
      size="lg"
      radius="sm"
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
    />
  </Indicator>
</template>
`

const Demo = defineComponent({
  name: 'IndicatorInlineDemo',
  setup() {
    return () =>
      h(
        Indicator,
        { inline: true, label: 'New', size: 16 },
        {
          default: () =>
            h(Avatar, {
              size: 'lg',
              radius: 'sm',
              src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
            }),
        },
      )
  },
})

export const inline: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
