import { defineComponent, h } from 'vue'
import { AspectRatio, Image } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { AspectRatio, Image } from '@mantine-vue/core'
</script>

<template>
  <div style="display: flex">
    <AspectRatio :ratio="1" flex="0 0 100px">
      <Image
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png"
        alt="Avatar"
      />
    </AspectRatio>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'AspectRatioFlexDemo',
  setup() {
    return () =>
      h('div', { style: { display: 'flex' } }, [
        h(
          AspectRatio,
          { ratio: 1, flex: '0 0 100px' },
          {
            default: () =>
              h(Image, {
                src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
                alt: 'Avatar',
              }),
          },
        ),
      ])
  },
})

export const flex: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
