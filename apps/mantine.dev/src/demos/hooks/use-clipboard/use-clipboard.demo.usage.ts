import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { useClipboard } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { useClipboard } from '@mantine-vue/hooks'

const clipboard = useClipboard({ timeout: 500 })
</script>

<template>
  <Button
    :color="clipboard.copied.value ? 'teal' : 'blue'"
    @click="clipboard.copy('Hello, world!')"
  >
    {{ clipboard.copied.value ? 'Copied' : 'Copy' }}
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'UseClipboardUsageDemo',
  setup() {
    const clipboard = useClipboard({ timeout: 500 })

    return () =>
      h(
        Button,
        {
          color: clipboard.copied.value ? 'teal' : 'blue',
          onClick: () => clipboard.copy('Hello, world!'),
        },
        { default: () => (clipboard.copied.value ? 'Copied' : 'Copy') },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
}
