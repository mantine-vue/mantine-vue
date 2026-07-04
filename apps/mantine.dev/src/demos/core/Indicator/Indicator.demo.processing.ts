import { defineComponent, h } from 'vue'
import { Avatar, Indicator } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar, Indicator } from '@mantine-vue/core'
</script>

<template>
  <Indicator inline processing color="red" :size="12">
    <Avatar
      size="lg"
      radius="sm"
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png"
    />
  </Indicator>
</template>
`

const Demo = defineComponent({
  name: 'IndicatorProcessingDemo',
  setup() {
    return () =>
      h(
        Indicator,
        { inline: true, processing: true, color: 'red', size: 12 },
        {
          default: () =>
            h(Avatar, {
              size: 'lg',
              radius: 'sm',
              src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
            }),
        },
      )
  },
})

export const processing: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
