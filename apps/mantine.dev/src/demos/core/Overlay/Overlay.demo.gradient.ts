import { defineComponent, h, ref } from 'vue'
import { AspectRatio, Button, Overlay } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { AspectRatio, Button, Overlay } from '@mantine-vue/core'

const visible = ref(true)
</script>

<template>
  <AspectRatio :ratio="16 / 9" :maw="400" mx="auto" pos="relative">
    <img
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      alt="Demo"
    />
    <Overlay
      v-if="visible"
      gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)"
    />
  </AspectRatio>
  <Button @click="visible = !visible" fullWidth :maw="200" mx="auto" mt="xl">
    Toggle overlay
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'OverlayGradientDemo',
  setup() {
    const visible = ref(true)

    return () =>
      h('div', null, [
        h(
          AspectRatio,
          { ratio: 16 / 9, maw: 400, mx: 'auto', pos: 'relative' },
          {
            default: () => [
              h('img', {
                src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png',
                alt: 'Demo',
              }),
              visible.value
                ? h(Overlay, {
                    gradient:
                      'linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)',
                  })
                : null,
            ],
          },
        ),
        h(
          Button,
          {
            onClick: () => {
              visible.value = !visible.value
            },
            fullWidth: true,
            maw: 200,
            mx: 'auto',
            mt: 'xl',
          },
          () => 'Toggle overlay',
        ),
      ])
  },
})

export const gradient: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
