import { defineComponent, h } from 'vue'
import { Button, Stack } from '@mantine-vue/core'
import { useFullscreenElement } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Stack } from '@mantine-vue/core'
import { useFullscreenElement } from '@mantine-vue/hooks'

const { ref: imageRef, toggle, fullscreen } = useFullscreenElement<HTMLImageElement>()
</script>

<template>
  <Stack align="center">
    <img
      ref="imageRef"
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png"
      alt="For demo"
      width="200"
    />
    <Button :color="fullscreen ? 'red' : 'blue'" @click="toggle">
      {{ fullscreen ? 'Exit Fullscreen' : 'View Image Fullscreen' }}
    </Button>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'UseFullscreenElementDemo',
  setup() {
    const { ref: imageRef, toggle, fullscreen } = useFullscreenElement<HTMLImageElement>()

    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h('img', {
              ref: imageRef,
              src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
              alt: 'For demo',
              width: 200,
            }),
            h(
              Button,
              { color: fullscreen.value ? 'red' : 'blue', onClick: toggle },
              { default: () => (fullscreen.value ? 'Exit Fullscreen' : 'View Image Fullscreen') },
            ),
          ],
        },
      )
  },
})

export const ref: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
