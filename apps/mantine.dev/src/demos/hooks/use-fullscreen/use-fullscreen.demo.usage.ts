import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { useFullscreenDocument } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { useFullscreenDocument } from '@mantine-vue/hooks'

const { toggle, fullscreen } = useFullscreenDocument()
</script>

<template>
  <Button :color="fullscreen ? 'red' : 'blue'" @click="toggle">
    {{ fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'UseFullscreenUsageDemo',
  setup() {
    const { toggle, fullscreen } = useFullscreenDocument()

    return () =>
      h(
        Button,
        { color: fullscreen.value ? 'red' : 'blue', onClick: toggle },
        { default: () => (fullscreen.value ? 'Exit Fullscreen' : 'Enter Fullscreen') },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
}
